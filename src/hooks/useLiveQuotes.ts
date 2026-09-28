import { useEffect, useState } from 'react'
import { fetchLiveQuotes } from '@/lib/live'
import type { LiveQuote } from '@/lib/live'

export function useLiveQuotes(refreshMs = 60_000) {
  const [quotes, setQuotes] = useState<Record<string, LiveQuote>>({})
  const [live, setLive] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const q = await fetchLiveQuotes()
      if (!cancelled && q) {
        setQuotes(q)
        setLive(true)
        setLastSync(new Date())
      }
    }
    run()
    const id = setInterval(run, refreshMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [refreshMs])

  return { quotes, live, lastSync }
}
