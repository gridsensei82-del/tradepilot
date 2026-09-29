#!/usr/bin/env python3
"""Fetch the daily market snapshot for TradePilot and write src/data/marketSnapshot.json.

Runs in GitHub Actions every morning. Uses only the Python standard library.
Data source: Yahoo Finance chart API (public, no key).
"""
import json
import ssl
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

SYMBOLS = [
    "^GSPC", "^IXIC", "GC=F",
    "BTC-USD", "ETH-USD", "SOL-USD",
    "AAPL", "MSFT", "NVDA", "AMZN", "TSLA", "GOOGL", "META", "AMD",
]

OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "marketSnapshot.json"
CTX = ssl.create_default_context()
HEADERS = {"User-Agent": "Mozilla/5.0 (TradePilot snapshot bot)"}


def fetch(symbol: str) -> dict | None:
    url = (
        "https://query1.finance.yahoo.com/v8/finance/chart/"
        + symbol.replace("^", "%5E")
        + "?range=6mo&interval=1d"
    )
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=25, context=CTX) as res:
            d = json.loads(res.read().decode())
        r = d["chart"]["result"][0]
        ts = r["timestamp"]
        q = r["indicators"]["quote"][0]
        candles = []
        for i, t in enumerate(ts):
            c = q["close"][i]
            if c is None:
                continue
            candles.append(
                {
                    "t": t,
                    "o": round(q["open"][i] or c, 2),
                    "h": round(q["high"][i] or c, 2),
                    "l": round(q["low"][i] or c, 2),
                    "c": round(c, 2),
                }
            )
        return {
            "candles": candles,
            "price": r["meta"].get("regularMarketPrice"),
            "name": r["meta"].get("shortName") or r["meta"].get("longName") or symbol,
            "currency": r["meta"].get("currency", "USD"),
        }
    except Exception as e:  # noqa: BLE001 — a failed symbol must not kill the run
        print(f"FAIL {symbol}: {e}")
        return None


def main() -> None:
    snapshot: dict = {}
    if OUT.exists():
        try:
            snapshot = json.loads(OUT.read_text())
        except Exception:
            snapshot = {}

    ok = 0
    for s in SYMBOLS:
        data = fetch(s)
        if data and len(data["candles"]) > 20:
            snapshot[s] = data
            ok += 1
            print(f"OK {s} ({len(data['candles'])} candles)")
        else:
            print(f"KEEP previous {s}")
        time.sleep(0.6)

    snapshot["_fetchedAt"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    OUT.write_text(json.dumps(snapshot))
    print(f"done: {ok}/{len(SYMBOLS)} symbols refreshed -> {OUT}")


if __name__ == "__main__":
    main()
