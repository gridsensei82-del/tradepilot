import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { STRATEGIES } from '@/data/content'
import { Target, ShieldAlert, TrendingUp, AlertTriangle, ListChecks } from 'lucide-react'

function DifficultyDots({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5" title={`Difficulty ${n}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= n ? 'bg-amber-400' : 'bg-slate-700'}`} />
      ))}
    </span>
  )
}

export default function Strategies() {
  const [open, setOpen] = useState<string | undefined>('trend-pullback')

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-slate-500">
        Six complete playbooks covering your markets — indices, stocks, crypto, gold. Every strategy has exact rules: when it works, when it fails, and the mistakes that kill it. <span className="text-slate-300">Pick ONE that matches today's regime and master it before adding another.</span>
      </p>
      <Accordion type="single" collapsible value={open} onValueChange={setOpen} className="space-y-3">
        {STRATEGIES.map((s) => (
          <AccordionItem key={s.id} value={s.id} className="overflow-hidden rounded-lg border border-[#1e2433] bg-[#0d1017]">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 pr-2 text-left">
                <span className="text-sm font-semibold text-slate-200">{s.name}</span>
                <Badge variant="outline" className="border-0 bg-blue-500/10 text-[10px] text-blue-400">{s.style}</Badge>
                <Badge variant="outline" className="border-0 bg-slate-500/10 text-[10px] text-slate-400">{s.timeframe}</Badge>
                <span className="ml-auto flex items-center gap-2">
                  <DifficultyDots n={s.difficulty} />
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-slate-400">{s.thesis}</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <TrendingUp className="h-3.5 w-3.5" /> Entry
                    </div>
                    <p className="text-[13px] leading-relaxed text-slate-300">{s.entry}</p>
                  </div>
                  <div className="rounded-md border border-rose-500/20 bg-rose-500/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                      <ShieldAlert className="h-3.5 w-3.5" /> Stop loss
                    </div>
                    <p className="text-[13px] leading-relaxed text-slate-300">{s.stopLoss}</p>
                  </div>
                  <div className="rounded-md border border-blue-500/20 bg-blue-500/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                      <Target className="h-3.5 w-3.5" /> Take profit
                    </div>
                    <p className="text-[13px] leading-relaxed text-slate-300">{s.takeProfit}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <ListChecks className="h-3.5 w-3.5" /> The rules
                  </div>
                  <ul className="space-y-1.5">
                    {s.rules.map((r, i) => (
                      <li key={i} className="text-[13px] leading-relaxed text-slate-400">
                        <span className="mr-1.5 font-mono text-emerald-500">{i + 1}.</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-[#1e2433] bg-[#0a0d13] p-3">
                    <div className="mb-1 text-xs font-semibold text-slate-400">Works best when</div>
                    <p className="text-[13px] leading-relaxed text-slate-500">{s.whenItWorks}</p>
                    <div className="mb-1 mt-2 text-xs font-semibold text-slate-400">Best markets</div>
                    <p className="text-[13px] text-slate-500">{s.bestFor}</p>
                  </div>
                  <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                      <AlertTriangle className="h-3.5 w-3.5" /> Fails when
                    </div>
                    <p className="text-[13px] leading-relaxed text-slate-400">{s.whenItFails}</p>
                    <div className="mb-1 mt-2 text-xs font-semibold text-amber-400">Classic mistakes</div>
                    <ul className="space-y-1">
                      {s.mistakes.map((m, i) => (
                        <li key={i} className="text-[13px] text-slate-400">
                          <span className="mr-1 text-rose-400">✕</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export function StrategiesCard() {
  return (
    <Card className="border-[#1e2433] bg-[#0d1017]">
      <CardHeader>
        <CardTitle className="text-sm text-slate-200">Strategy Playbook</CardTitle>
      </CardHeader>
      <CardContent>
        <Strategies />
      </CardContent>
    </Card>
  )
}
