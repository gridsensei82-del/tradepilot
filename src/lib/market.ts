import snapshot from '../data/marketSnapshot.json'

export interface Candle {
  t: number
  o: number
  h: number
  l: number
  c: number
}

export interface SymbolData {
  candles: Candle[]
  price: number
  name: string
  currency: string
}

const raw = snapshot as unknown as Record<string, SymbolData | string>
export const FETCHED_AT = raw._fetchedAt as string

export function getSnapshot(symbol: string): SymbolData | null {
  const d = raw[symbol]
  if (!d || typeof d === 'string') return null
  return d as SymbolData
}

export type AssetKind = 'index' | 'commodity' | 'crypto' | 'stock'

export interface WatchItem {
  symbol: string
  label: string
  kind: AssetKind
  stooq?: string
  cg?: string
}

export const CORE_ASSETS = ['^GSPC', '^IXIC', 'GC=F', 'BTC-USD', 'ETH-USD']

export const WATCHLIST: WatchItem[] = [
  { symbol: '^GSPC', label: 'S&P 500', kind: 'index', stooq: '^spx' },
  { symbol: '^IXIC', label: 'NASDAQ', kind: 'index', stooq: '^ndx' },
  { symbol: 'GC=F', label: 'Gold', kind: 'commodity', stooq: 'xauusd' },
  { symbol: 'BTC-USD', label: 'Bitcoin', kind: 'crypto', cg: 'bitcoin' },
  { symbol: 'ETH-USD', label: 'Ethereum', kind: 'crypto', cg: 'ethereum' },
  { symbol: 'SOL-USD', label: 'Solana', kind: 'crypto', cg: 'solana' },
  { symbol: 'NVDA', label: 'NVIDIA', kind: 'stock', stooq: 'nvda.us' },
  { symbol: 'AAPL', label: 'Apple', kind: 'stock', stooq: 'aapl.us' },
  { symbol: 'MSFT', label: 'Microsoft', kind: 'stock', stooq: 'msft.us' },
  { symbol: 'AMZN', label: 'Amazon', kind: 'stock', stooq: 'amzn.us' },
  { symbol: 'TSLA', label: 'Tesla', kind: 'stock', stooq: 'tsla.us' },
  { symbol: 'GOOGL', label: 'Alphabet', kind: 'stock', stooq: 'googl.us' },
  { symbol: 'META', label: 'Meta', kind: 'stock', stooq: 'meta.us' },
  { symbol: 'AMD', label: 'AMD', kind: 'stock', stooq: 'amd.us' },
]

// ---------- indicators ----------

export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = []
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]
    if (i >= period) sum -= values[i - period]
    out.push(i >= period - 1 ? sum / period : null)
  }
  return out
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = []
  const k = 2 / (period + 1)
  let prev: number | null = null
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      out.push(null)
      continue
    }
    if (prev === null) {
      let sum = 0
      for (let j = i - period + 1; j <= i; j++) sum += values[j]
      prev = sum / period
    } else {
      prev = values[i] * k + prev * (1 - k)
    }
    out.push(prev)
  }
  return out
}

export function rsi(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null
  let gains = 0
  let losses = 0
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1]
    if (diff >= 0) gains += diff
    else losses -= diff
  }
  if (losses === 0) return 100
  const rs = gains / period / (losses / period)
  return 100 - 100 / (1 + rs)
}

export function rsiSeries(closes: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = new Array(closes.length).fill(null)
  if (closes.length < period + 1) return out
  let gains = 0
  let losses = 0
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1]
    if (diff >= 0) gains += diff
    else losses -= diff
  }
  let avgGain = gains / period
  let avgLoss = losses / period
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1]
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss)
  }
  return out
}

export function macd(closes: number[]): { macd: number | null; signal: number | null; hist: number | null } {
  const e12 = ema(closes, 12)
  const e26 = ema(closes, 26)
  const macdLine: number[] = []
  for (let i = 0; i < closes.length; i++) {
    if (e12[i] !== null && e26[i] !== null) macdLine.push((e12[i] as number) - (e26[i] as number))
  }
  if (macdLine.length < 9) return { macd: null, signal: null, hist: null }
  const sig = ema(macdLine, 9)
  const m = macdLine[macdLine.length - 1]
  const s = sig[sig.length - 1]
  return { macd: m, signal: s, hist: s !== null ? m - s : null }
}

// ---------- technical read ----------

export interface TechRead {
  price: number
  changePct: number
  change5dPct: number
  sma20: number | null
  sma50: number | null
  aboveSma20: boolean | null
  aboveSma50: boolean | null
  goldenCross: boolean | null
  rsi14: number | null
  macdHist: number | null
  support: number
  resistance: number
  high52wLike: number
  low52wLike: number
  trend: 'uptrend' | 'downtrend' | 'range'
  volatilityPct: number
}

export function analyze(candles: Candle[]): TechRead | null {
  if (candles.length < 30) return null
  const closes = candles.map((c) => c.c)
  const price = closes[closes.length - 1]
  const prev = closes[closes.length - 2]
  const prev5 = closes[closes.length - 6] ?? closes[0]
  const s20 = sma(closes, 20)
  const s50 = sma(closes, 50)
  const sma20 = s20[s20.length - 1]
  const sma50 = s50[s50.length - 1]
  const { hist } = macd(closes)
  const lookback = candles.slice(-60)
  const support = Math.min(...lookback.map((c) => c.l))
  const resistance = Math.max(...lookback.map((c) => c.h))
  const high52wLike = Math.max(...candles.map((c) => c.h))
  const low52wLike = Math.min(...candles.map((c) => c.l))
  // volatility: stdev of daily returns, annualized-ish
  const rets: number[] = []
  for (let i = closes.length - 20; i < closes.length; i++) {
    if (i > 0) rets.push((closes[i] - closes[i - 1]) / closes[i - 1])
  }
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const variance = rets.reduce((a, b) => a + (b - mean) ** 2, 0) / rets.length
  const volatilityPct = Math.sqrt(variance) * 100 * Math.sqrt(252)

  let trend: TechRead['trend'] = 'range'
  if (sma20 !== null && sma50 !== null) {
    if (price > sma20 && sma20 > sma50) trend = 'uptrend'
    else if (price < sma20 && sma20 < sma50) trend = 'downtrend'
  }

  return {
    price,
    changePct: ((price - prev) / prev) * 100,
    change5dPct: ((price - prev5) / prev5) * 100,
    sma20,
    sma50,
    aboveSma20: sma20 !== null ? price > sma20 : null,
    aboveSma50: sma50 !== null ? price > sma50 : null,
    goldenCross: sma20 !== null && sma50 !== null ? sma20 > sma50 : null,
    rsi14: rsi(closes),
    macdHist: hist,
    support,
    resistance,
    high52wLike,
    low52wLike,
    trend,
    volatilityPct,
  }
}

// ---------- formatting ----------

export function fmtPrice(v: number | null | undefined, kind?: AssetKind): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—'
  const decimals = kind === 'crypto' ? (v < 10 ? 4 : v < 1000 ? 2 : 0) : 2
  return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: Math.max(decimals, 2) })
}

export function fmtPct(v: number | null | undefined, withSign = true): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—'
  const sign = withSign && v > 0 ? '+' : ''
  return `${sign}${v.toFixed(2)}%`
}

export function fmtDate(t: number): string {
  return new Date(t * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function rsiLabel(r: number | null): { text: string; tone: 'up' | 'down' | 'flat' } {
  if (r === null) return { text: '—', tone: 'flat' }
  if (r >= 70) return { text: 'Overbought', tone: 'down' }
  if (r <= 30) return { text: 'Oversold', tone: 'up' }
  if (r >= 55) return { text: 'Bullish', tone: 'up' }
  if (r <= 45) return { text: 'Bearish', tone: 'down' }
  return { text: 'Neutral', tone: 'flat' }
}
