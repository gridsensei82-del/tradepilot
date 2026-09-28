import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Sparkline from '@/components/Sparkline'
import { STRATEGIES } from '@/data/content'
import { fmtPct } from '@/lib/market'
import { Trash2, BookText } from 'lucide-react'

export interface Trade {
  id: string
  date: string
  symbol: string
  direction: 'long' | 'short'
  entry: number
  exit: number | null
  stop: number
  size: number
  strategy: string
  emotion: string
  followedPlan: boolean
  notes: string
}

const STORE_KEY = 'tradepilot.journal'

function load(): Trade[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]')
  } catch {
    return []
  }
}

const EMOTIONS = ['Calm / planned', 'Confident', 'FOMO', 'Fearful', 'Revenge', 'Bored', 'Greedy', 'Hesitant']

export default function Journal() {
  const [trades, setTrades] = useState<Trade[]>(load)
  const [form, setForm] = useState({ symbol: '', direction: 'long', entry: '', exit: '', stop: '', size: '', strategy: '', emotion: 'Calm / planned', followedPlan: 'yes', notes: '' })

  const persist = (t: Trade[]) => {
    setTrades(t)
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(t))
    } catch {
      /* ignore */
    }
  }

  const add = () => {
    const entry = parseFloat(form.entry)
    const stop = parseFloat(form.stop)
    const size = parseFloat(form.size)
    if (!form.symbol || !Number.isFinite(entry) || !Number.isFinite(stop) || !Number.isFinite(size)) return
    const exit = form.exit ? parseFloat(form.exit) : null
    const t: Trade = {
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString().slice(0, 10),
      symbol: form.symbol.toUpperCase(),
      direction: form.direction as 'long' | 'short',
      entry,
      exit: exit !== null && Number.isFinite(exit) ? exit : null,
      stop,
      size,
      strategy: form.strategy,
      emotion: form.emotion,
      followedPlan: form.followedPlan === 'yes',
      notes: form.notes,
    }
    persist([t, ...trades])
    setForm({ symbol: '', direction: 'long', entry: '', exit: '', stop: '', size: '', strategy: '', emotion: 'Calm / planned', followedPlan: 'yes', notes: '' })
  }

  const pnl = (t: Trade) => (t.exit === null ? null : (t.direction === 'long' ? (t.exit - t.entry) * t.size : (t.entry - t.exit) * t.size))
  const rMultiple = (t: Trade) => {
    if (t.exit === null) return null
    const risk = Math.abs(t.entry - t.stop) * t.size
    if (risk === 0) return null
    return (pnl(t) as number) / risk
  }

  const stats = useMemo(() => {
    const closed = trades.filter((t) => t.exit !== null)
    const wins = closed.filter((t) => (pnl(t) ?? 0) > 0)
    const totalPnl = closed.reduce((a, t) => a + (pnl(t) ?? 0), 0)
    const rs = closed.map(rMultiple).filter((r): r is number => r !== null)
    const avgR = rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : null
    const discipline = trades.length ? (trades.filter((t) => t.followedPlan).length / trades.length) * 100 : null
    // equity curve (chronological)
    let cum = 0
    const curve = [...closed].reverse().map((t) => (cum += pnl(t) ?? 0))
    // emotion leak analysis
    const leaks: Record<string, number> = {}
    for (const t of closed) {
      leaks[t.emotion] = (leaks[t.emotion] ?? 0) + (pnl(t) ?? 0)
    }
    const worstEmotion = Object.entries(leaks).sort((a, b) => a[1] - b[1])[0]
    return { closed: closed.length, winRate: closed.length ? (wins.length / closed.length) * 100 : null, totalPnl, avgR, discipline, curve, worstEmotion }
  }, [trades])

  return (
    <div className="space-y-4">
      {/* stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { k: 'Closed trades', v: String(stats.closed) },
          { k: 'Win rate', v: stats.winRate !== null ? fmtPct(stats.winRate, false) : '—' },
          { k: 'Total P&L', v: stats.closed ? `$${stats.totalPnl.toFixed(2)}` : '—', tone: stats.totalPnl >= 0 ? 'up' : 'down' },
          { k: 'Avg R multiple', v: stats.avgR !== null ? `${stats.avgR.toFixed(2)}R` : '—' },
          { k: 'Discipline score', v: stats.discipline !== null ? fmtPct(stats.discipline, false) : '—' },
        ].map((s) => (
          <Card key={s.k} className="border-[#1e2433] bg-[#0d1017]">
            <CardContent className="p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">{s.k}</div>
              <div className={`mt-0.5 font-mono text-lg font-semibold ${s.tone === 'up' ? 'text-emerald-400' : s.tone === 'down' ? 'text-rose-400' : 'text-slate-100'}`}>{s.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.curve.length > 1 && (
        <Card className="border-[#1e2433] bg-[#0d1017]">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-xs font-semibold text-slate-300">Equity curve (cumulative P&L)</div>
              {stats.worstEmotion && stats.worstEmotion[1] < 0 && (
                <p className="mt-1 text-xs text-amber-400">
                  Leak detected: trades taken while feeling "{stats.worstEmotion[0]}" have cost you ${Math.abs(stats.worstEmotion[1]).toFixed(2)} net. This is why you journal.
                </p>
              )}
            </div>
            <Sparkline values={stats.curve} width={220} height={48} positive={stats.totalPnl >= 0} />
          </CardContent>
        </Card>
      )}

      {/* entry form */}
      <Card className="border-[#1e2433] bg-[#0d1017]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <BookText className="h-4 w-4 text-emerald-400" /> Log a trade (real or paper)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div>
              <Label className="text-xs text-slate-500">Symbol</Label>
              <Input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="NVDA" className="mt-1 border-[#2a3245] bg-[#0a0d13] font-mono" />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Direction</Label>
              <Select value={form.direction} onValueChange={(v) => setForm({ ...form, direction: v })}>
                <SelectTrigger className="mt-1 border-[#2a3245] bg-[#0a0d13]"><SelectValue /></SelectTrigger>
                <SelectContent className="border-[#2a3245] bg-[#0d1017] text-slate-200">
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Entry</Label>
              <Input value={form.entry} onChange={(e) => setForm({ ...form, entry: e.target.value })} inputMode="decimal" className="mt-1 border-[#2a3245] bg-[#0a0d13] font-mono" />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Stop</Label>
              <Input value={form.stop} onChange={(e) => setForm({ ...form, stop: e.target.value })} inputMode="decimal" className="mt-1 border-[#2a3245] bg-[#0a0d13] font-mono" />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Exit (blank = open)</Label>
              <Input value={form.exit} onChange={(e) => setForm({ ...form, exit: e.target.value })} inputMode="decimal" className="mt-1 border-[#2a3245] bg-[#0a0d13] font-mono" />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Size (units)</Label>
              <Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} inputMode="decimal" className="mt-1 border-[#2a3245] bg-[#0a0d13] font-mono" />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Strategy used</Label>
              <Select value={form.strategy} onValueChange={(v) => setForm({ ...form, strategy: v })}>
                <SelectTrigger className="mt-1 border-[#2a3245] bg-[#0a0d13]"><SelectValue placeholder="Pick..." /></SelectTrigger>
                <SelectContent className="border-[#2a3245] bg-[#0d1017] text-slate-200">
                  {STRATEGIES.map((s) => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                  <SelectItem value="other">Other / none</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Emotion before entry</Label>
              <Select value={form.emotion} onValueChange={(v) => setForm({ ...form, emotion: v })}>
                <SelectTrigger className="mt-1 border-[#2a3245] bg-[#0a0d13]"><SelectValue /></SelectTrigger>
                <SelectContent className="border-[#2a3245] bg-[#0d1017] text-slate-200">
                  {EMOTIONS.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[160px_1fr]">
            <div>
              <Label className="text-xs text-slate-500">Followed my plan?</Label>
              <Select value={form.followedPlan} onValueChange={(v) => setForm({ ...form, followedPlan: v })}>
                <SelectTrigger className="mt-1 border-[#2a3245] bg-[#0a0d13]"><SelectValue /></SelectTrigger>
                <SelectContent className="border-[#2a3245] bg-[#0d1017] text-slate-200">
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Notes (thesis, lesson, what you'd repeat)</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={1} className="mt-1 border-[#2a3245] bg-[#0a0d13] text-sm" placeholder="Bought the MA20 pullback after bullish engulfing..." />
            </div>
          </div>
          <Button onClick={add} className="bg-emerald-600 text-white hover:bg-emerald-500">Log trade</Button>
        </CardContent>
      </Card>

      {/* table */}
      {trades.length > 0 && (
        <Card className="border-[#1e2433] bg-[#0d1017]">
          <CardContent className="px-2 pb-2 pt-4">
            <Table>
              <TableHeader>
                <TableRow className="border-[#1e2433] hover:bg-transparent">
                  <TableHead className="text-slate-500">Date</TableHead>
                  <TableHead className="text-slate-500">Symbol</TableHead>
                  <TableHead className="text-slate-500">Side</TableHead>
                  <TableHead className="text-right text-slate-500">Entry → Exit</TableHead>
                  <TableHead className="text-right text-slate-500">P&L</TableHead>
                  <TableHead className="text-right text-slate-500">R</TableHead>
                  <TableHead className="hidden text-slate-500 md:table-cell">Emotion</TableHead>
                  <TableHead className="hidden text-slate-500 md:table-cell">Plan</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((t) => {
                  const p = pnl(t)
                  const r = rMultiple(t)
                  return (
                    <TableRow key={t.id} className="border-[#161b26]" title={t.notes}>
                      <TableCell className="font-mono text-xs text-slate-500">{t.date}</TableCell>
                      <TableCell className="font-mono font-semibold text-slate-200">{t.symbol}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-0 text-[10px] ${t.direction === 'long' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{t.direction}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-slate-300">
                        {t.entry} → {t.exit ?? <span className="text-blue-400">open</span>}
                      </TableCell>
                      <TableCell className={`text-right font-mono text-xs ${p === null ? 'text-slate-600' : p >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {p === null ? '—' : `${p >= 0 ? '+' : ''}$${p.toFixed(2)}`}
                      </TableCell>
                      <TableCell className={`text-right font-mono text-xs ${r === null ? 'text-slate-600' : r >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {r === null ? '—' : `${r.toFixed(1)}R`}
                      </TableCell>
                      <TableCell className="hidden text-xs text-slate-500 md:table-cell">{t.emotion}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {t.followedPlan ? <span className="text-xs text-emerald-400">✓</span> : <span className="text-xs text-rose-400">✕</span>}
                      </TableCell>
                      <TableCell>
                        <button onClick={() => persist(trades.filter((x) => x.id !== t.id))} className="text-slate-700 hover:text-rose-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {trades.length === 0 && (
        <p className="text-center text-xs text-slate-600">No trades yet. Paper trades count — the journal is where pattern recognition becomes self-knowledge.</p>
      )}
    </div>
  )
}
