import { useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Checkbox } from '@/components/ui/checkbox'
import { PATTERNS, STRATEGIES } from '@/data/content'
import { captureChartPhoto } from '@/lib/native'
import { Upload, RotateCcw, ChevronRight, ChevronLeft, ScanLine, Camera } from 'lucide-react'

type Trend = 'uptrend' | 'downtrend' | 'range' | ''
type Bias = 'bullish' | 'bearish' | ''

const FEATURES: { id: string; label: string; patterns: string[] }[] = [
  { id: 'three-peaks', label: 'Three peaks/troughs with a dominant middle one', patterns: ['head-shoulders', 'inverse-head-shoulders'] },
  { id: 'two-tests', label: 'Same level tested twice and held/rejected', patterns: ['double-top', 'double-bottom'] },
  { id: 'flat-top-rising-bottom', label: 'Flat ceiling + rising lows', patterns: ['ascending-triangle'] },
  { id: 'sharp-move-drift', label: 'Vertical move followed by a shallow drift', patterns: ['bull-flag'] },
  { id: 'rounded-base', label: 'Long rounded U-shaped recovery', patterns: ['cup-and-handle'] },
  { id: 'converging-down', label: 'Lower highs AND lower lows, converging', patterns: ['falling-wedge'] },
  { id: 'neckline', label: 'A clear neckline / horizontal trigger level', patterns: ['head-shoulders', 'inverse-head-shoulders', 'double-top', 'double-bottom'] },
  { id: 'volume-contract', label: 'Volume contracting as price compresses', patterns: ['ascending-triangle', 'falling-wedge', 'bull-flag', 'cup-and-handle'] },
]

const STEPS = ['Upload', 'Trend', 'Levels', 'Features', 'Your Read']

export default function Analyzer() {
  const [step, setStep] = useState(0)
  const [image, setImage] = useState<string | null>(null)
  const [symbol, setSymbol] = useState('')
  const [timeframe, setTimeframe] = useState('Daily')
  const [trend, setTrend] = useState<Trend>('')
  const [bias, setBias] = useState<Bias>('')
  const [support, setSupport] = useState('')
  const [resistance, setResistance] = useState('')
  const [checked, setChecked] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const matched = useMemo(() => {
    if (checked.length === 0) return []
    const scores = new Map<string, number>()
    for (const f of FEATURES) {
      if (!checked.includes(f.id)) continue
      for (const p of f.patterns) scores.set(p, (scores.get(p) ?? 0) + 1)
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, score]) => ({ pattern: PATTERNS.find((p) => p.id === id)!, score }))
      .filter((m) => m.pattern)
  }, [checked])

  const strategyPicks = useMemo(() => {
    if (trend === 'uptrend') return STRATEGIES.filter((s) => ['trend-pullback', 'breakout'].includes(s.id))
    if (trend === 'downtrend') return STRATEGIES.filter((s) => ['golden-cross', 'gold-safe-haven'].includes(s.id))
    if (trend === 'range') return STRATEGIES.filter((s) => ['rsi-reversal', 'breakout'].includes(s.id))
    return []
  }, [trend])

  const canNext = step === 0 ? image !== null : step === 1 ? trend !== '' && bias !== '' : true

  const reset = () => {
    setStep(0)
    setImage(null)
    setSymbol('')
    setTrend('')
    setBias('')
    setSupport('')
    setResistance('')
    setChecked([])
  }

  const onFile = (f: File | undefined) => {
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(f)
  }

  return (
    <div className="space-y-5">
      <Card className="border-[#1e2433] bg-[#0d1017]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <ScanLine className="h-4 w-4 text-emerald-400" />
            Chart Screenshot Analyzer
          </CardTitle>
          <p className="text-xs leading-relaxed text-slate-500">
            Drop in any chart screenshot. This is a <span className="text-slate-300">guided analysis</span> — it walks you through the same questions a professional asks (trend → levels → structure → plan) and builds a structured read from YOUR observations. That is how pattern recognition becomes a skill instead of a guess.
          </p>
        </CardHeader>
        <CardContent>
          {/* stepper */}
          <div className="mb-5 flex items-center gap-1 overflow-x-auto">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    i === step ? 'bg-emerald-500/15 text-emerald-400' : i < step ? 'text-slate-300 hover:text-slate-100' : 'text-slate-600'
                  }`}
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${i <= step ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{i + 1}</span>
                  {s}
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="mx-0.5 h-3 w-3 text-slate-700" />}
              </div>
            ))}
          </div>

          {/* STEP 0: upload */}
          {step === 0 && (
            <div>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  onFile(e.dataTransfer.files?.[0])
                }}
                className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#2a3245] bg-[#0a0d13] p-6 text-center transition-colors hover:border-emerald-500/50"
              >
                {image ? (
                  <img src={image} alt="chart" className="max-h-[380px] rounded-md object-contain" />
                ) : (
                  <>
                    <Upload className="mb-3 h-8 w-8 text-slate-600" />
                    <p className="text-sm text-slate-400">Click or drop a chart screenshot here</p>
                    <p className="mt-1 text-xs text-slate-600">PNG / JPG — from TradingView, your broker, anywhere</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-[#2a3245] bg-transparent text-slate-300"
                onClick={async () => {
                  const dataUrl = await captureChartPhoto()
                  if (dataUrl) setImage(dataUrl)
                }}
              >
                <Camera className="mr-1.5 h-4 w-4 text-emerald-400" /> Take photo of a chart
              </Button>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-500">Symbol (optional)</Label>
                  <Input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="BTC, NVDA, SPX..." className="mt-1 border-[#2a3245] bg-[#0a0d13] font-mono" />
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Timeframe</Label>
                  <ToggleGroup type="single" value={timeframe} onValueChange={(v) => v && setTimeframe(v)} className="mt-1 justify-start">
                    {['15m', '1H', '4H', 'Daily', 'Weekly'].map((t) => (
                      <ToggleGroupItem key={t} value={t} className="border border-[#2a3245] px-2.5 text-xs data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-400">
                        {t}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: trend */}
          {step === 1 && image && (
            <Split image={image}>
              <div className="space-y-5">
                <div>
                  <Label className="text-sm text-slate-300">1. What is the dominant trend on this chart?</Label>
                  <p className="mb-2 mt-0.5 text-xs text-slate-500">Higher highs + higher lows = uptrend. Lower highs + lower lows = downtrend. Neither = range.</p>
                  <ToggleGroup type="single" value={trend} onValueChange={(v) => setTrend((v || '') as Trend)} className="justify-start">
                    {(['uptrend', 'downtrend', 'range'] as const).map((t) => (
                      <ToggleGroupItem key={t} value={t} className="border border-[#2a3245] px-4 capitalize data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-400">
                        {t}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                <div>
                  <Label className="text-sm text-slate-300">2. Which side do you want to trade?</Label>
                  <p className="mb-2 mt-0.5 text-xs text-slate-500">Hint: agreeing with the trend you just named is usually the higher-probability side.</p>
                  <ToggleGroup type="single" value={bias} onValueChange={(v) => setBias((v || '') as Bias)} className="justify-start">
                    <ToggleGroupItem value="bullish" className="border border-[#2a3245] px-4 data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-400">
                      Bullish (long)
                    </ToggleGroupItem>
                    <ToggleGroupItem value="bearish" className="border border-[#2a3245] px-4 data-[state=on]:bg-rose-500/15 data-[state=on]:text-rose-400">
                      Bearish (short / avoid)
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                {trend !== '' && bias !== '' && (
                  <div className={`rounded-md border p-3 text-sm ${trend === 'range' || (trend === 'uptrend' && bias === 'bullish') || (trend === 'downtrend' && bias === 'bearish') ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-amber-500/30 bg-amber-500/5 text-amber-300'}`}>
                    {trend === 'uptrend' && bias === 'bullish' && 'Aligned: trading with the trend. Your job is finding a good entry, not being right about direction.'}
                    {trend === 'downtrend' && bias === 'bearish' && 'Aligned: trading with the trend. Rallies into resistance are your hunting ground.'}
                    {trend === 'range' && 'Range mode: trade the edges, small size, fast exits. Breakout traders wait for the range to resolve.'}
                    {trend === 'uptrend' && bias === 'bearish' && 'Warning: shorting an uptrend is counter-trend. Only do it at a proven level with a tight stop — and know the odds are worse.'}
                    {trend === 'downtrend' && bias === 'bullish' && 'Warning: buying a downtrend is counter-trend. Falling knives cut. Demand a reversal trigger, not just a low price.'}
                  </div>
                )}
              </div>
            </Split>
          )}

          {/* STEP 2: levels */}
          {step === 2 && image && (
            <Split image={image}>
              <div className="space-y-4">
                <Label className="text-sm text-slate-300">Mark the two prices that matter most</Label>
                <p className="text-xs leading-relaxed text-slate-500">
                  Look at your screenshot: where did price repeatedly bounce (support)? Where did it repeatedly stall (resistance)? These two numbers define the playing field — every good trade is planned relative to them.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-emerald-500">Support (floor)</Label>
                    <Input value={support} onChange={(e) => setSupport(e.target.value)} placeholder="e.g. 61500" inputMode="decimal" className="mt-1 border-[#2a3245] bg-[#0a0d13] font-mono" />
                  </div>
                  <div>
                    <Label className="text-xs text-rose-400">Resistance (ceiling)</Label>
                    <Input value={resistance} onChange={(e) => setResistance(e.target.value)} placeholder="e.g. 68000" inputMode="decimal" className="mt-1 border-[#2a3245] bg-[#0a0d13] font-mono" />
                  </div>
                </div>
                <div className="rounded-md border border-[#1e2433] bg-[#0a0d13] p-3 text-xs leading-relaxed text-slate-500">
                  <span className="font-medium text-slate-300">Pro habit:</span> place stops OUTSIDE these zones, never exactly on the line — obvious levels are where stop-hunts happen. Entries near a level with a stop beyond it give the best risk/reward.
                </div>
              </div>
            </Split>
          )}

          {/* STEP 3: features */}
          {step === 3 && image && (
            <Split image={image}>
              <div className="space-y-3">
                <Label className="text-sm text-slate-300">Which of these do you actually see on the chart?</Label>
                <p className="text-xs text-slate-500">Check only what is genuinely visible. Honesty here is what makes the read useful.</p>
                <div className="space-y-2">
                  {FEATURES.map((f) => (
                    <label key={f.id} className="flex cursor-pointer items-start gap-2.5 rounded-md border border-[#1e2433] bg-[#0a0d13] p-2.5 transition-colors hover:border-[#2e3850]">
                      <Checkbox
                        checked={checked.includes(f.id)}
                        onCheckedChange={(v) => setChecked((prev) => (v ? [...prev, f.id] : prev.filter((x) => x !== f.id)))}
                        className="mt-0.5 border-[#2a3245] data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                      />
                      <span className="text-sm text-slate-300">{f.label}</span>
                    </label>
                  ))}
                </div>
                {matched.length > 0 && (
                  <div className="rounded-md border border-[#1e2433] bg-[#0a0d13] p-3">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Closest pattern matches</div>
                    <div className="flex flex-wrap gap-2">
                      {matched.map((m) => (
                        <Badge key={m.pattern.id} variant="outline" className={`border-0 text-xs ${m.pattern.bias === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {m.pattern.name} · {m.score} feature{m.score > 1 ? 's' : ''}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Split>
          )}

          {/* STEP 4: the read */}
          {step === 4 && image && (
            <div className="grid gap-5 lg:grid-cols-2">
              <img src={image} alt="chart" className="w-full rounded-lg border border-[#1e2433] object-contain" />
              <div className="space-y-4">
                <div className="rounded-lg border border-[#1e2433] bg-[#0a0d13] p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">Structured read {symbol && `· ${symbol}`} · {timeframe}</div>
                  <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
                    <li><span className="text-slate-500">Regime:</span> {trend || '—'}. {trend === 'uptrend' ? 'Longs have the wind at their back.' : trend === 'downtrend' ? 'Defense and shorts have the edge.' : 'Edges of the range are the trade; the middle is noise.'}</li>
                    <li><span className="text-slate-500">Bias:</span> <span className={bias === 'bullish' ? 'text-emerald-400' : 'text-rose-400'}>{bias || '—'}</span></li>
                    {(support || resistance) && (
                      <li><span className="text-slate-500">Levels:</span> support <span className="font-mono text-emerald-400">{support || '—'}</span> / resistance <span className="font-mono text-rose-400">{resistance || '—'}</span>. Plan entries near these, stops beyond them.</li>
                    )}
                    {matched.length > 0 && (
                      <li><span className="text-slate-500">Structure:</span> most consistent with <span className="text-slate-100">{matched[0].pattern.name}</span> ({matched[0].pattern.bias.toLowerCase()} {matched[0].pattern.category.toLowerCase()}). Remember: the pattern is a hypothesis — the trigger is the trade.</li>
                    )}
                  </ul>
                </div>

                {matched.length > 0 && (
                  <div className="rounded-lg border border-[#1e2433] bg-[#0a0d13] p-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">If this is a {matched[0].pattern.name}:</div>
                    <ul className="space-y-1.5 text-sm text-slate-400">
                      <li><span className="mr-1.5 text-emerald-500">Entry</span>{matched[0].pattern.entry}</li>
                      <li><span className="mr-1.5 text-rose-400">Stop</span>{matched[0].pattern.stop}</li>
                      <li><span className="mr-1.5 text-blue-400">Target</span>{matched[0].pattern.target}</li>
                    </ul>
                  </div>
                )}

                {strategyPicks.length > 0 && (
                  <div className="rounded-lg border border-[#1e2433] bg-[#0a0d13] p-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Playbook strategies that fit this regime</div>
                    <div className="flex flex-wrap gap-2">
                      {strategyPicks.map((s) => (
                        <Badge key={s.id} variant="outline" className="border-[#2a3245] bg-transparent text-xs text-slate-300">{s.name}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-200/80">
                  Before any real trade: define the stop (where is the thesis wrong?), size the position at ≤1% risk (Tools tab), and write the plan in the Journal. Educational tool — not financial advice.
                </div>
              </div>
            </div>
          )}

          {/* nav */}
          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={reset} className="text-slate-500 hover:text-slate-300">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Start over
            </Button>
            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="outline" size="sm" onClick={() => setStep(step - 1)} className="border-[#2a3245] bg-transparent text-slate-300">
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Back
                </Button>
              )}
              {step < STEPS.length - 1 && (
                <Button size="sm" onClick={() => canNext && setStep(step + 1)} disabled={!canNext} className="bg-emerald-600 text-white hover:bg-emerald-500">
                  Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Split({ image, children }: { image: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <img src={image} alt="chart" className="w-full self-start rounded-lg border border-[#1e2433] object-contain" />
      <div>{children}</div>
    </div>
  )
}
