import { WATCHLIST } from './market'
import type { WatchItem } from './market'

export interface LiveQuote {
  price: number
  changePct: number
}

/**
 * Live refresh strategy (all CORS-friendly, no API key):
 *  - crypto      → CoinGecko simple/price
 *  - stocks/indices/gold → stooq.com CSV quote endpoint
 * Any failure returns null and the caller keeps the bundled snapshot values.
 */
export async function fetchLiveQuotes(): Promise<Record<string, LiveQuote> | null> {
  const out: Record<string, LiveQuote> = {}
  try {
    await Promise.all([fetchCrypto(out), fetchStooq(out)])
  } catch {
    // partial results are fine
  }
  return Object.keys(out).length > 0 ? out : null
}

async function fetchCrypto(out: Record<string, LiveQuote>): Promise<void> {
  const ids = WATCHLIST.filter((w) => w.cg).map((w) => w.cg as string)
  if (ids.length === 0) return
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) return
  const data = (await res.json()) as Record<string, { usd: number; usd_24h_change: number }>
  for (const w of WATCHLIST) {
    if (w.cg && data[w.cg]) {
      out[w.symbol] = { price: data[w.cg].usd, changePct: data[w.cg].usd_24h_change ?? 0 }
    }
  }
}

async function fetchStooq(out: Record<string, LiveQuote>): Promise<void> {
  const items: WatchItem[] = WATCHLIST.filter((w) => w.stooq)
  if (items.length === 0) return
  const syms = items.map((w) => encodeURIComponent(w.stooq as string)).join(',')
  const url = `https://stooq.com/q/l/?s=${syms}&f=sd2t2ohlcv&h&e=csv`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) return
  const text = await res.text()
  const lines = text.trim().split('\n')
  if (lines.length < 2) return
  const header = lines[0].split(',')
  const iSym = header.indexOf('Symbol')
  const iClose = header.indexOf('Close')
  const iOpen = header.indexOf('Open')
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',')
    const stooqSym = cols[iSym]
    const close = parseFloat(cols[iClose])
    const open = parseFloat(cols[iOpen])
    if (!Number.isFinite(close) || !Number.isFinite(open) || open === 0) continue
    const item = items.find((w) => w.stooq?.toLowerCase() === stooqSym.toLowerCase())
    if (item) out[item.symbol] = { price: close, changePct: ((close - open) / open) * 100 }
  }
}
