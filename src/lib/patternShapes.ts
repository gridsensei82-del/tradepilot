import type { Candle } from './market'

/**
 * Generates synthetic candle series that visually express each pattern,
 * so the trainer and quiz show realistic-looking charts without external data.
 */

// normalized price paths (0-100-ish), one value per candle close
const SHAPES: Record<string, number[]> = {
  'head-shoulders': [
    30, 34, 38, 42, 47, 52, 56, 60, 57, 52, 48, 46, 48, 52, 58, 64, 70, 76, 82, 78, 72, 66, 58, 52, 50, 52, 56, 60, 63, 61, 57, 52, 47, 44, 42, 38, 34, 30, 27, 24,
  ],
  'inverse-head-shoulders': [
    70, 66, 62, 58, 53, 48, 44, 40, 43, 48, 52, 54, 52, 48, 42, 36, 30, 24, 18, 22, 28, 34, 42, 48, 50, 48, 44, 40, 37, 39, 43, 48, 53, 56, 58, 62, 66, 70, 73, 76,
  ],
  'double-top': [
    35, 40, 45, 50, 55, 60, 65, 70, 68, 62, 57, 54, 56, 60, 64, 68, 71, 69, 64, 58, 53, 48, 44, 40, 37, 34, 31, 29, 27, 26,
  ],
  'double-bottom': [
    65, 60, 55, 50, 45, 40, 35, 30, 32, 38, 43, 46, 44, 40, 36, 32, 29, 31, 36, 42, 47, 52, 56, 60, 63, 66, 69, 71, 73, 74,
  ],
  'ascending-triangle': [
    40, 46, 52, 58, 64, 70, 65, 58, 52, 48, 52, 58, 64, 70, 66, 60, 56, 58, 62, 66, 70, 67, 63, 62, 65, 68, 70, 69, 68, 72, 77, 82, 86, 89,
  ],
  'bull-flag': [
    38, 44, 50, 57, 64, 71, 78, 76, 74, 72, 70, 69, 71, 69, 67, 68, 70, 69, 71, 74, 79, 84, 88, 92,
  ],
  'cup-and-handle': [
    70, 66, 61, 56, 52, 49, 47, 46, 45, 46, 47, 49, 52, 56, 60, 64, 67, 70, 68, 65, 63, 64, 66, 68, 71, 75, 79, 83,
  ],
  'falling-wedge': [
    82, 78, 74, 70, 74, 70, 66, 62, 66, 63, 59, 56, 60, 57, 54, 52, 55, 53, 51, 50, 52, 55, 59, 64, 69, 73,
  ],
}

// deterministic pseudo-random so charts are stable between renders
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function generatePatternCandles(shapeId: string): Candle[] {
  const closes = SHAPES[shapeId] ?? SHAPES['bull-flag']
  const rand = seeded(shapeId.length * 777 + 13)
  const base = Date.UTC(2025, 0, 1) / 1000
  const candles: Candle[] = []
  let prev = closes[0] - 1
  for (let i = 0; i < closes.length; i++) {
    const c = closes[i]
    const o = prev
    const range = Math.abs(c - o) + 1.5
    const h = Math.max(o, c) + rand() * range * 0.45
    const l = Math.min(o, c) - rand() * range * 0.45
    candles.push({ t: base + i * 86400, o: round2(o), h: round2(h), l: round2(l), c: round2(c) })
    prev = c
  }
  return candles
}

function round2(v: number) {
  return Math.round(v * 100) / 100
}

export const PATTERN_SHAPE_IDS = Object.keys(SHAPES)
