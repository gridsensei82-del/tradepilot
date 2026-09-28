import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator, Scale } from 'lucide-react'

function Num({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div>
      <Label className="text-xs text-slate-500">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} inputMode="decimal" className="mt-1 border-[#2a3245] bg-[#0a0d13] font-mono" />
      {hint && <p className="mt-1 text-[11px] text-slate-600">{hint}</p>}
    </div>
  )
}

export default function Tools() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PositionSizer />
      <RiskReward />
    </div>
  )
}

function PositionSizer() {
  const [account, setAccount] = useState('10000')
  const [riskPct, setRiskPct] = useState('1')
  const [entry, setEntry] = useState('')
  const [stop, setStop] = useState('')

  const r = useMemo(() => {
    const a = parseFloat(account)
    const rp = parseFloat(riskPct)
    const e = parseFloat(entry)
    const s = parseFloat(stop)
    if (![a, rp, e, s].every(Number.isFinite) || e === s || a <= 0 || rp <= 0) return null
    const riskDollars = (a * rp) / 100
    const perUnit = Math.abs(e - s)
    const units = riskDollars / perUnit
    const positionValue = units * e
    const leverageNeeded = positionValue / a
    const stopPct = (perUnit / e) * 100
    return { riskDollars, units, positionValue, leverageNeeded, stopPct }
  }, [account, riskPct, entry, stop])

  return (
    <Card className="border-[#1e2433] bg-[#0d1017]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Calculator className="h-4 w-4 text-emerald-400" /> Position Sizer
        </CardTitle>
        <p className="text-xs text-slate-500">The most important calculator in trading. Size comes from your stop distance — never from confidence.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Num label="Account size ($)" value={account} onChange={setAccount} />
          <Num label="Risk per trade (%)" value={riskPct} onChange={setRiskPct} hint="1% is the professional default" />
          <Num label="Entry price" value={entry} onChange={setEntry} />
          <Num label="Stop price" value={stop} onChange={setStop} hint="Where the thesis is wrong" />
        </div>
        {r ? (
          <div className="space-y-2 rounded-md border border-[#1e2433] bg-[#0a0d13] p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Risk amount</div>
                <div className="font-mono text-lg text-rose-400">${r.riskDollars.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Position size</div>
                <div className="font-mono text-lg text-emerald-400">{r.units >= 100 ? r.units.toFixed(0) : r.units.toFixed(3)} units</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Position value</div>
                <div className="font-mono text-slate-200">${r.positionValue.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Stop distance</div>
                <div className="font-mono text-slate-200">{r.stopPct.toFixed(2)}%</div>
              </div>
            </div>
            {r.leverageNeeded > 1 && (
              <p className="border-t border-[#1e2433] pt-2 text-xs text-amber-400">
                This position needs {r.leverageNeeded.toFixed(1)}× your account. If you can't or won't use leverage, a wider % risk or closer-to-price instrument is required — do NOT just tighten the stop into noise.
              </p>
            )}
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-[#2a3245] p-4 text-center text-xs text-slate-600">Fill in entry and stop to see your size</p>
        )}
      </CardContent>
    </Card>
  )
}

function RiskReward() {
  const [entry, setEntry] = useState('')
  const [stop, setStop] = useState('')
  const [target, setTarget] = useState('')
  const [winRate, setWinRate] = useState('45')

  const r = useMemo(() => {
    const e = parseFloat(entry)
    const s = parseFloat(stop)
    const t = parseFloat(target)
    const w = parseFloat(winRate)
    if (![e, s, t, w].every(Number.isFinite) || e === s) return null
    const risk = Math.abs(e - s)
    const reward = Math.abs(t - e)
    const rr = reward / risk
    const long = t > e === s < e
    const breakeven = 100 / (1 + rr)
    const expectancy = (w / 100) * rr - (1 - w / 100)
    return { rr, breakeven, expectancy, saneDirection: long }
  }, [entry, stop, target, winRate])

  return (
    <Card className="border-[#1e2433] bg-[#0d1017]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Scale className="h-4 w-4 text-emerald-400" /> Risk / Reward & Expectancy
        </CardTitle>
        <p className="text-xs text-slate-500">You can't control win rate. You can fully control asymmetry. Below 2R, pass on the trade.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Num label="Entry price" value={entry} onChange={setEntry} />
          <Num label="Stop price" value={stop} onChange={setStop} />
          <Num label="Target price" value={target} onChange={setTarget} />
          <Num label="Your win rate (%)" value={winRate} onChange={setWinRate} hint="Estimate from your journal" />
        </div>
        {r ? (
          <div className="space-y-2 rounded-md border border-[#1e2433] bg-[#0a0d13] p-4">
            {!r.saneDirection && <p className="text-xs text-rose-400">Check direction: entry, stop and target look inconsistent.</p>}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">R multiple</div>
                <div className={`font-mono text-lg ${r.rr >= 2 ? 'text-emerald-400' : 'text-rose-400'}`}>{r.rr.toFixed(2)}R</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Breakeven win rate</div>
                <div className="font-mono text-lg text-slate-200">{r.breakeven.toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Expectancy</div>
                <div className={`font-mono text-lg ${r.expectancy > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{r.expectancy >= 0 ? '+' : ''}{r.expectancy.toFixed(2)}R</div>
              </div>
            </div>
            <p className="border-t border-[#1e2433] pt-2 text-xs leading-relaxed text-slate-500">
              {r.expectancy > 0
                ? `At a ${winRate}% win rate this trade makes ${r.expectancy.toFixed(2)}R per trade on average — a positive-edge bet. ${r.rr < 2 ? 'Still, below 2R is thin; demand more from your setups.' : 'Solid asymmetry.'}`
                : `At a ${winRate}% win rate this trade LOSES ${Math.abs(r.expectancy).toFixed(2)}R per trade on average. Raise the target, tighten the entry, or skip it.`}
            </p>
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-[#2a3245] p-4 text-center text-xs text-slate-600">Fill in entry, stop and target</p>
        )}
      </CardContent>
    </Card>
  )
}
