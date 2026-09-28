import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LESSONS, LESSON_CATEGORIES } from '@/data/content'
import type { Lesson } from '@/data/content'
import { scheduleDailyLessonReminder } from '@/lib/native'
import { CheckCircle2, Circle, Flame, Lightbulb, Target, BookOpen, Bell, BellRing } from 'lucide-react'

const STORE_KEY = 'tradepilot.lessons.done'

function loadDone(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export default function Learn() {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const todaysDay = (dayOfYear % LESSONS.length) + 1
  const [done, setDone] = useState<number[]>(loadDone)
  const [openDay, setOpenDay] = useState<number>(todaysDay)
  const [filter, setFilter] = useState<(typeof LESSON_CATEGORIES)[number]>('All')
  const [reminderOn, setReminderOn] = useState(() => localStorage.getItem('tradepilot.reminder') === '1')

  const enableReminder = async () => {
    const ok = await scheduleDailyLessonReminder(todaysLesson.title)
    if (ok) {
      setReminderOn(true)
      localStorage.setItem('tradepilot.reminder', '1')
    }
  }

  const lesson = LESSONS.find((l) => l.day === openDay) ?? LESSONS[0]
  const todaysLesson = LESSONS.find((l) => l.day === todaysDay) ?? LESSONS[0]

  const markDone = (day: number) => {
    const next = done.includes(day) ? done.filter((d) => d !== day) : [...done, day]
    setDone(next)
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  const filtered = useMemo(() => (filter === 'All' ? LESSONS : LESSONS.filter((l) => l.category === filter)), [filter])
  const pct = Math.round((done.length / LESSONS.length) * 100)

  const catTone: Record<Lesson['category'], string> = {
    Markets: 'bg-blue-500/10 text-blue-400',
    Technical: 'bg-purple-500/10 text-purple-400',
    Risk: 'bg-rose-500/10 text-rose-400',
    Mindset: 'bg-amber-500/10 text-amber-400',
    Strategy: 'bg-emerald-500/10 text-emerald-400',
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* left: progress + list */}
      <div className="space-y-4">
        <Card className="border-[#1e2433] bg-[#0d1017]">
          <CardContent className="p-4">
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Flame className="h-4 w-4 text-orange-400" /> 30-Day Trading Curriculum
            </div>
            <p className="text-xs leading-relaxed text-slate-500">One 3-4 minute lesson per day: markets, technicals, risk, mindset, strategy.</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{done.length}/{LESSONS.length} completed</span>
              <span className="font-mono text-emerald-400">{pct}%</span>
            </div>
            <Progress value={pct} className="mt-1.5 h-1.5 bg-slate-800 [&>div]:bg-emerald-500" />
            <button
              onClick={enableReminder}
              disabled={reminderOn}
              className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                reminderOn ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-[#2a3245] text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400'
              }`}
            >
              {reminderOn ? <BellRing className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
              {reminderOn ? 'Daily reminder on · 8:12 AM' : 'Remind me daily at 8:12 AM'}
            </button>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-1.5">
          {LESSON_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${filter === c ? 'bg-emerald-500/15 text-emerald-400' : 'bg-[#0d1017] text-slate-500 hover:text-slate-300'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="max-h-[520px] space-y-1 overflow-y-auto pr-1">
          {filtered.map((l) => (
            <button
              key={l.day}
              onClick={() => setOpenDay(l.day)}
              className={`flex w-full items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors ${
                openDay === l.day ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-[#1e2433] bg-[#0d1017] hover:border-[#2e3850]'
              }`}
            >
              {done.includes(l.day) ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : <Circle className="h-4 w-4 shrink-0 text-slate-700" />}
              <div className="min-w-0 flex-1">
                <div className={`truncate text-[13px] ${openDay === l.day ? 'text-slate-100' : 'text-slate-400'}`}>
                  <span className="mr-1.5 font-mono text-[11px] text-slate-600">D{l.day}</span>
                  {l.title}
                </div>
              </div>
              {l.day === todaysDay && <Badge className="border-0 bg-orange-500/15 text-[9px] text-orange-400">TODAY</Badge>}
            </button>
          ))}
        </div>
      </div>

      {/* right: lesson reader */}
      <Card className="border-[#1e2433] bg-[#0d1017]">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`border-0 text-[10px] ${catTone[lesson.category]}`}>{lesson.category}</Badge>
            <span className="text-[11px] text-slate-600">{lesson.minutes} min read</span>
            {lesson.day === todaysDay && <Badge className="border-0 bg-orange-500/15 text-[10px] text-orange-400">Today's lesson</Badge>}
          </div>
          <CardTitle className="text-lg text-slate-100">
            Day {lesson.day} — {lesson.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lesson.body.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-slate-400">{p}</p>
          ))}
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Lightbulb className="h-3.5 w-3.5" /> Key takeaway
            </div>
            <p className="text-sm font-medium text-emerald-200">{lesson.takeaway}</p>
          </div>
          <div className="rounded-md border border-blue-500/20 bg-blue-500/5 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <Target className="h-3.5 w-3.5" /> Today's action
            </div>
            <p className="text-sm text-blue-200">{lesson.action}</p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={lesson.day <= 1} onClick={() => setOpenDay(lesson.day - 1)} className="border-[#2a3245] bg-transparent text-slate-400">
                ← Prev
              </Button>
              <Button variant="outline" size="sm" disabled={lesson.day >= LESSONS.length} onClick={() => setOpenDay(lesson.day + 1)} className="border-[#2a3245] bg-transparent text-slate-400">
                Next →
              </Button>
            </div>
            <Button
              size="sm"
              onClick={() => markDone(lesson.day)}
              className={done.includes(lesson.day) ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-emerald-600 text-white hover:bg-emerald-500'}
            >
              {done.includes(lesson.day) ? 'Completed ✓ (undo)' : 'Mark complete'}
            </Button>
          </div>
          {lesson.day !== todaysDay && (
            <button onClick={() => setOpenDay(todaysDay)} className="flex items-center gap-1 text-xs text-slate-600 hover:text-orange-400">
              <BookOpen className="h-3 w-3" /> Jump back to today's lesson (Day {todaysLesson.day}: {todaysLesson.title})
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
