import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import CandleChart from '@/components/CandleChart'
import Sparkline from '@/components/Sparkline'
import { useLiveQuotes } from '@/hooks/useLiveQuotes'
import { WATCHLIST, CORE_ASSETS, getSnapshot, analyze, fmtPrice, fmtPct, rsiLabel, FETCHED_AT } from '@/lib/market'
import type { WatchItem } from '@/lib/market'
import { TrendingUp, TrendingDown, Minus, Activity, Radio } from 'lucide-react'

function ToneIcon({ v }: { v: number }) {
  if (v > 0.05) return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
  if (v < -0.05) return <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
  return <Minus className="h-3.5 w-3.5 text-slate-500" />
}

function toneClass(v: number) {
  return v > 0.005 ? 'text-emerald-400' : v < -0.005 ? 'text-rose-400' : 'text-slate-400'
}

export default function Dashboard() {
  const { quotes, live, lastSync } = useLiveQuotes()
  const [selected, setSelected] = useState<WatchItem | null>(null)

  const reads = useMemo(() => {
    const map: Record<string, ReturnType<typeof analyze>> = {}
    for (const w of WATCHLIST) {
      const snap = getSnapshot(w.symbol)
      map[w.symbol] = snap ? analyze(snap.candles) : null
    }
    return map
  }, [])

  const coreItems = WATCHLIST.filter((w) => CORE_ASSETS.includes(w.symbol))
  const stockItems = WATCHLIST.filter((w) => w.kind === 'stock')

  const regime = useMemo(() => {
    const lines: string[] = []
    const spx = reads['^GSPC']
    const ndx = reads['^IXIC']
    const gold = reads['GC=F']
    const btc = reads['BTC-USD']
    if (spx) {
      lines.push(
        spx.trend === 'uptrend'
          ? `S&P 500 is in an uptrend above its rising 20/50-day averages — pullbacks toward the 20D (~${fmtPrice(spx.sma20)}) are the higher-probability long zone.`
          : spx.trend === 'downtrend'
            ? `S&P 500 is below falling 20/50-day averages — defense first; rallies into the 20D (~${fmtPrice(spx.sma20)}) are where sellers have been stepping in.`
            : `S&P 500 is chopping between the 20D and 50D — range rules apply: fade extremes, don't chase breakouts until price resolves.`,
      )
      const r = rsiLabel(spx.rsi14)
      lines.push(`Index momentum (RSI-14 ${spx.rsi14?.toFixed(0)}) reads ${r.text.toLowerCase()}${ndx && ndx.trend === spx.trend ? ', and NASDAQ confirms the same regime' : ndx ? `, while NASDAQ shows a ${ndx.trend} — watch for divergence between the two` : ''}.`)
    }
    if (gold && btc) {
      const riskOn = (spx?.change5dPct ?? 0) > 0 && btc.change5dPct > 0
      const hedgeOn = gold.change5dPct > 0 && (spx?.change5dPct ?? 0) < 0
      if (riskOn) lines.push('Stocks and Bitcoin rising together this week = classic risk-on tape. Trend-following longs have the wind at their back.')
      else if (hedgeOn) lines.push('Gold up while equities slip = defensive rotation. Trim aggression, tighten stops, let the tape prove itself.')
      else lines.push('Mixed cross-asset signals — no dominant regime. Size down and wait for alignment between equities, gold and crypto.')
    }
    return lines
  }, [reads])

  return (
    <div className="space-y-6">
      {/* status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5" />
          <span>Daily candles · snapshot {new Date(FETCHED_AT).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Radio className={`h-3.5 w-3.5 ${live ? 'animate-pulse text-emerald-400' : 'text-slate-600'}`} />
          <span>{live ? `Live quotes synced ${lastSync?.toLocaleTimeString()}` : 'Live feed unavailable — showing latest snapshot'}</span>
        </div>
      </div>

      {/* core cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {coreItems.map((w) => {
          const snap = getSnapshot(w.symbol)
          const read = reads[w.symbol]
          if (!snap || !read) return null
          const lq = quotes[w.symbol]
          const price = lq?.price ?? read.price
          const chg = lq?.changePct ?? read.changePct
          const closes = snap.candles.slice(-40).map((c) => c.c)
          if (lq) closes.push(lq.price)
          const rl = rsiLabel(read.rsi14)
          return (
            <Card
              key={w.symbol}
              className="cursor-pointer border-[#1e2433] bg-[#0d1017] transition-colors hover:border-[#2e3850]"
              onClick={() => setSelected(w)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{w.label}</div>
                    <div className="mt-1 font-mono text-xl font-semibold text-slate-100">{fmtPrice(price, w.kind)}</div>
                  </div>
                  <ToneIcon v={chg} />
                </div>
                <div className={`mt-0.5 font-mono text-sm ${toneClass(chg)}`}>{fmtPct(chg)}</div>
                <div className="mt-2 flex items-end justify-between">
                  <Sparkline values={closes} width={96} height={30} />
                  <Badge
                    variant="outline"
                    className={`border-0 text-[10px] ${rl.tone === 'up' ? 'bg-emerald-500/10 text-emerald-400' : rl.tone === 'down' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'}`}
                  >
                    RSI {read.rsi14?.toFixed(0)} · {rl.text}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* regime read */}
      <Card className="border-[#1e2433] bg-[#0d1017]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-200">Today's Regime Read</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {regime.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed text-slate-400">
              <span className="mr-2 text-emerald-500">▸</span>
              {line}
            </p>
          ))}
          <p className="pt-1 text-[11px] text-slate-600">Auto-generated from the snapshot's moving averages, RSI and cross-asset moves. A starting point for your own read — not advice.</p>
        </CardContent>
      </Card>

      {/* watchlist table */}
      <Card className="border-[#1e2433] bg-[#0d1017]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-200">Stock Watchlist</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <Table>
            <TableHeader>
              <TableRow className="border-[#1e2433] hover:bg-transparent">
                <TableHead className="text-slate-500">Symbol</TableHead>
                <TableHead className="text-right text-slate-500">Price</TableHead>
                <TableHead className="text-right text-slate-500">1D</TableHead>
                <TableHead className="hidden text-right text-slate-500 md:table-cell">5D</TableHead>
                <TableHead className="hidden text-right text-slate-500 md:table-cell">RSI</TableHead>
                <TableHead className="hidden text-slate-500 lg:table-cell">Trend</TableHead>
                <TableHead className="hidden text-right text-slate-500 lg:table-cell">vs 20D</TableHead>
                <TableHead className="hidden w-[120px] text-slate-500 xl:table-cell">40D</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((w) => {
                const snap = getSnapshot(w.symbol)
                const read = reads[w.symbol]
                if (!snap || !read) return null
                const lq = quotes[w.symbol]
                const price = lq?.price ?? read.price
                const chg = lq?.changePct ?? read.changePct
                const vsSma = read.sma20 ? ((price - read.sma20) / read.sma20) * 100 : null
                return (
                  <TableRow key={w.symbol} className="cursor-pointer border-[#161b26] hover:bg-[#11151f]" onClick={() => setSelected(w)}>
                    <TableCell>
                      <div className="font-mono font-semibold text-slate-200">{w.symbol}</div>
                      <div className="text-[11px] text-slate-500">{w.label}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-100">{fmtPrice(price, w.kind)}</TableCell>
                    <TableCell className={`text-right font-mono ${toneClass(chg)}`}>{fmtPct(chg)}</TableCell>
                    <TableCell className={`hidden text-right font-mono md:table-cell ${toneClass(read.change5dPct)}`}>{fmtPct(read.change5dPct)}</TableCell>
                    <TableCell className="hidden text-right font-mono text-slate-300 md:table-cell">{read.rsi14?.toFixed(0) ?? '—'}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        variant="outline"
                        className={`border-0 text-[10px] ${read.trend === 'uptrend' ? 'bg-emerald-500/10 text-emerald-400' : read.trend === 'downtrend' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'}`}
                      >
                        {read.trend}
                      </Badge>
                    </TableCell>
                    <TableCell className={`hidden text-right font-mono lg:table-cell ${vsSma !== null ? toneClass(vsSma) : ''}`}>{fmtPct(vsSma)}</TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <Sparkline values={snap.candles.slice(-40).map((c) => c.c)} width={100} height={26} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* detail dialog */}
      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl border-[#1e2433] bg-[#0b0e14] text-slate-200">
          {selected && <SymbolDetail item={selected} livePrice={quotes[selected.symbol]?.price} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SymbolDetail({ item, livePrice }: { item: WatchItem; livePrice?: number }) {
  const snap = getSnapshot(item.symbol)
  const read = useMemo(() => (snap ? analyze(snap.candles) : null), [snap])
  if (!snap || !read) return null
  const price = livePrice ?? read.price
  const rl = rsiLabel(read.rsi14)

  const observations: string[] = []
  observations.push(
    read.trend === 'uptrend'
      ? 'Uptrend: price above a rising 20D, which sits above the 50D. Buy-the-dip territory, not chase territory.'
      : read.trend === 'downtrend'
        ? 'Downtrend: price below a falling 20D under the 50D. Shorts and patience outperform hero longs here.'
        : 'Range: price is rotating around its moving averages. Trade the edges, not the middle.',
  )
  if (read.rsi14 !== null) {
    observations.push(
      read.rsi14 >= 70
        ? `RSI ${read.rsi14.toFixed(0)} — overbought. Chasing here means buying what everyone already bought. Wait for a reset.`
        : read.rsi14 <= 30
          ? `RSI ${read.rsi14.toFixed(0)} — oversold. Capitulation zone; watch for a reversal candle before stepping in.`
          : `RSI ${read.rsi14.toFixed(0)} — ${rl.text.toLowerCase()} momentum, no extreme.`,
    )
  }
  if (read.macdHist !== null) {
    observations.push(read.macdHist > 0 ? 'MACD histogram positive — momentum is with the buyers.' : 'MACD histogram negative — momentum is with the sellers.')
  }
  observations.push(`Key levels: support ${fmtPrice(read.support, item.kind)} / resistance ${fmtPrice(read.resistance, item.kind)} (60-day range). Plan trades around these, not in the void between.`)

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-baseline gap-3">
          <span className="font-mono text-lg">{item.symbol}</span>
          <span className="text-sm font-normal text-slate-400">{item.label}</span>
          <span className="font-mono text-lg text-slate-100">{fmtPrice(price, item.kind)}</span>
          <span className={`font-mono text-sm ${toneClass(read.changePct)}`}>{fmtPct(read.changePct)}</span>
        </DialogTitle>
      </DialogHeader>
      <CandleChart candles={snap.candles} livePrice={livePrice} height={320} />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {[
          { k: 'Support (60D)', v: fmtPrice(read.support, item.kind) },
          { k: 'Resistance (60D)', v: fmtPrice(read.resistance, item.kind) },
          { k: 'MA20', v: fmtPrice(read.sma20, item.kind) },
          { k: 'MA50', v: fmtPrice(read.sma50, item.kind) },
          { k: 'RSI-14', v: read.rsi14?.toFixed(1) ?? '—' },
          { k: 'Volatility (ann.)', v: `${read.volatilityPct.toFixed(0)}%` },
          { k: '6M High', v: fmtPrice(read.high52wLike, item.kind) },
          { k: '6M Low', v: fmtPrice(read.low52wLike, item.kind) },
        ].map((s) => (
          <div key={s.k} className="rounded-md border border-[#1e2433] bg-[#0d1017] px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{s.k}</div>
            <div className="font-mono text-sm text-slate-100">{s.v}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1.5 rounded-md border border-[#1e2433] bg-[#0d1017] p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Auto technical read</div>
        {observations.map((o, i) => (
          <p key={i} className="text-[13px] leading-relaxed text-slate-400">
            <span className="mr-1.5 text-emerald-500">▸</span>
            {o}
          </p>
        ))}
      </div>
    </>
  )
}
