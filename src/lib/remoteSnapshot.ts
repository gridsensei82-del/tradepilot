import { applySnapshotOverride, getFetchedAt } from './market'
import type { SymbolData } from './market'

const REMOTE_URL = 'https://raw.githubusercontent.com/gridsensei82-del/tradepilot/main/src/data/marketSnapshot.json'
const CACHE_KEY = 'tradepilot.remoteSnapshot'

type SnapshotMap = Record<string, SymbolData | string>

function isNewer(data: SnapshotMap): boolean {
  const remote = data?._fetchedAt
  if (typeof remote !== 'string') return false
  const local = getFetchedAt()
  return new Date(remote).getTime() > new Date(local).getTime()
}

/**
 * Over-the-air snapshot update. The repo's daily GitHub Actions job commits a
 * fresh marketSnapshot.json every morning; on startup the app pulls it and
 * swaps it in — on desktop AND on the installed Android app, no APK reinstall
 * needed. Any failure silently keeps the bundled snapshot.
 */
export async function refreshRemoteSnapshot(): Promise<boolean> {
  // 1) apply a previously cached remote snapshot immediately (offline start)
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const data = JSON.parse(cached) as SnapshotMap
      if (isNewer(data)) applySnapshotOverride(data)
    }
  } catch {
    /* ignore */
  }

  // 2) try the network for an even newer one
  try {
    const res = await fetch(REMOTE_URL, { signal: AbortSignal.timeout(6000), cache: 'no-store' })
    if (!res.ok) return false
    const data = (await res.json()) as SnapshotMap
    if (!isNewer(data)) return false
    applySnapshotOverride(data)
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    } catch {
      /* storage full — non-fatal */
    }
    return true
  } catch {
    return false
  }
}
