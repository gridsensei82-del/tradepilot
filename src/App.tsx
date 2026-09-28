import { useEffect, useState } from 'react'
import Dashboard from '@/sections/Dashboard'
import Analyzer from '@/sections/Analyzer'
import Patterns from '@/sections/Patterns'
import Strategies from '@/sections/Strategies'
import Learn from '@/sections/Learn'
import Journal from '@/sections/Journal'
import Tools from '@/sections/Tools'
import { LayoutDashboard, ScanLine, Shapes, BookOpen, GraduationCap, NotebookPen, Calculator } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', short: 'Home', icon: LayoutDashboard, component: Dashboard },
  { id: 'analyzer', label: 'Chart Analyzer', short: 'Analyze', icon: ScanLine, component: Analyzer },
  { id: 'patterns', label: 'Patterns', short: 'Patterns', icon: Shapes, component: Patterns },
  { id: 'strategies', label: 'Strategies', short: 'Playbook', icon: BookOpen, component: Strategies },
  { id: 'learn', label: 'Daily Lesson', short: 'Learn', icon: GraduationCap, component: Learn },
  { id: 'journal', label: 'Journal', short: 'Journal', icon: NotebookPen, component: Journal },
  { id: 'tools', label: 'Tools', short: 'Tools', icon: Calculator, component: Tools },
] as const

type TabId = (typeof TABS)[number]['id']

export default function App() {
  const [tab, setTab] = useState<TabId>('dashboard')
  const Active = TABS.find((t) => t.id === tab)!.component

  // scroll to top on tab change (mobile feels broken otherwise)
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [tab])

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-200">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-[#161b26] bg-[#080a10]/90 backdrop-blur" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 font-mono text-sm font-bold text-emerald-400">TP</div>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-100">TradePilot</div>
              <div className="text-[10px] text-slate-500">Daily trading companion</div>
            </div>
          </div>
          {/* desktop top nav */}
          <nav className="ml-auto hidden flex-wrap items-center gap-1 md:flex">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    active ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-500 hover:bg-[#11151f] hover:text-slate-300'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{t.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-5 md:pb-8 md:pt-6">
        <Active />
      </main>

      {/* mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#161b26] bg-[#0a0d13]/95 backdrop-blur md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-7">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-1.5 transition-colors ${active ? 'text-emerald-400' : 'text-slate-600'}`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[9px] font-medium leading-none">{t.short}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <footer className="mx-auto hidden max-w-7xl px-4 pb-8 pt-2 text-center text-[11px] leading-relaxed text-slate-700 md:block">
        TradePilot is an educational companion. Nothing here is financial advice — markets involve risk, and the only edge that compounds is your process.
      </footer>
    </div>
  )
}
