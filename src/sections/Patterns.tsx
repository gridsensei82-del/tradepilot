import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CandleChart from '@/components/CandleChart'
import { PATTERNS } from '@/data/content'
import type { Pattern } from '@/data/content'
import { generatePatternCandles } from '@/lib/patternShapes'
import { hapticSuccess, hapticError } from '@/lib/native'
import { BookOpen, GraduationCap, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'

function ReliabilityDots({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" title={`Reliability ${n}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= n ? 'bg-emerald-400' : 'bg-slate-700'}`} />
      ))}
    </span>
  )
}

export default function Patterns() {
  return (
    <Tabs defaultValue="library" className="space-y-4">
      <TabsList className="border border-[#1e2433] bg-[#0d1017]">
        <TabsTrigger value="library" className="data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
          <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Pattern Library
        </TabsTrigger>
        <TabsTrigger value="quiz" className="data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
          <GraduationCap className="mr-1.5 h-3.5 w-3.5" /> Recognition Quiz
        </TabsTrigger>
      </TabsList>
      <TabsContent value="library">
        <Library />
      </TabsContent>
      <TabsContent value="quiz">
        <Quiz />
      </TabsContent>
    </Tabs>
  )
}

function Library() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {PATTERNS.map((p) => (
        <Card key={p.id} className="border-[#1e2433] bg-[#0d1017]">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-semibold text-slate-200">{p.name}</CardTitle>
              <div className="flex items-center gap-2">
                <ReliabilityDots n={p.reliability} />
                <Badge variant="outline" className={`border-0 text-[10px] ${p.bias === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {p.bias}
                </Badge>
                <Badge variant="outline" className="border-0 bg-slate-500/10 text-[10px] text-slate-400">{p.category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CandleChart candles={generatePatternCandles(p.id)} height={170} showMA={false} />
            <p className="text-[13px] leading-relaxed text-slate-400">{p.description}</p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="id" className="border-[#1e2433]">
                <AccordionTrigger className="py-2 text-xs text-slate-300 hover:no-underline">How to identify it</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5">
                    {p.identification.map((r, i) => (
                      <li key={i} className="text-[13px] leading-relaxed text-slate-400">
                        <span className="mr-1.5 font-mono text-emerald-500">{i + 1}.</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="trade" className="border-[#1e2433]">
                <AccordionTrigger className="py-2 text-xs text-slate-300 hover:no-underline">How to trade it</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5 text-[13px] text-slate-400">
                    <li><span className="mr-1.5 font-medium text-emerald-400">Entry</span>{p.entry}</li>
                    <li><span className="mr-1.5 font-medium text-rose-400">Stop</span>{p.stop}</li>
                    <li><span className="mr-1.5 font-medium text-blue-400">Target</span>{p.target}</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="psy" className="border-[#1e2433]">
                <AccordionTrigger className="py-2 text-xs text-slate-300 hover:no-underline">The psychology behind it</AccordionTrigger>
                <AccordionContent>
                  <p className="text-[13px] leading-relaxed text-slate-400">{p.psychology}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface QuizState {
  pattern: Pattern
  options: Pattern[]
  candles: ReturnType<typeof generatePatternCandles>
}

function makeQuestion(): QuizState {
  const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)]
  const others = PATTERNS.filter((p) => p.id !== pattern.id).sort(() => Math.random() - 0.5).slice(0, 3)
  const options = [...others, pattern].sort(() => Math.random() - 0.5)
  return { pattern, options, candles: generatePatternCandles(pattern.id) }
}

function Quiz() {
  const [q, setQ] = useState<QuizState>(makeQuestion)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState<{ right: number; total: number }>(() => {
    try {
      const s = localStorage.getItem('tradepilot.quiz')
      return s ? JSON.parse(s) : { right: 0, total: 0 }
    } catch {
      return { right: 0, total: 0 }
    }
  })

  const pct = score.total > 0 ? Math.round((score.right / score.total) * 100) : 0

  const answer = (id: string) => {
    if (picked) return
    setPicked(id)
    if (id === q.pattern.id) hapticSuccess()
    else hapticError()
    const next = { right: score.right + (id === q.pattern.id ? 1 : 0), total: score.total + 1 }
    setScore(next)
    try {
      localStorage.setItem('tradepilot.quiz', JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  const nextQ = () => {
    setQ(makeQuestion())
    setPicked(null)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card className="border-[#1e2433] bg-[#0d1017]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-200">Which pattern is this?</CardTitle>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="font-mono">
                {score.right}/{score.total} <span className={pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-slate-400'}>({pct}%)</span>
              </span>
              <button
                onClick={() => {
                  const s = { right: 0, total: 0 }
                  setScore(s)
                  localStorage.setItem('tradepilot.quiz', JSON.stringify(s))
                }}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-400"
              >
                <RefreshCw className="h-3 w-3" /> reset
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-[#1e2433] bg-[#0a0d13] p-2">
            <CandleChart candles={q.candles} height={260} showMA={false} />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {q.options.map((o) => {
              const isRight = o.id === q.pattern.id
              const isPicked = picked === o.id
              let cls = 'border-[#2a3245] bg-[#0a0d13] text-slate-300 hover:border-emerald-500/50'
              if (picked) {
                if (isRight) cls = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                else if (isPicked) cls = 'border-rose-500/60 bg-rose-500/10 text-rose-300'
                else cls = 'border-[#1e2433] bg-[#0a0d13] text-slate-600'
              }
              return (
                <button key={o.id} onClick={() => answer(o.id)} disabled={picked !== null} className={`flex items-center justify-between rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${cls}`}>
                  {o.name}
                  {picked && isRight && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  {picked && isPicked && !isRight && <XCircle className="h-4 w-4 text-rose-400" />}
                </button>
              )
            })}
          </div>
          {picked && (
            <div className="space-y-3">
              <div className={`rounded-md border p-3 text-sm leading-relaxed ${picked === q.pattern.id ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200' : 'border-rose-500/30 bg-rose-500/5 text-rose-200'}`}>
                {picked === q.pattern.id ? 'Correct. ' : `Not quite — this is a ${q.pattern.name}. `}
                {q.pattern.description}
              </div>
              <Button onClick={nextQ} className="w-full bg-emerald-600 text-white hover:bg-emerald-500">
                Next chart
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-center text-xs text-slate-600">Charts are synthetic training examples. Real charts are messier — that is why you drill the ideal form first.</p>
    </div>
  )
}
