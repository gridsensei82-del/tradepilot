import { useMemo, useState } from 'react'
import type { Candle } from '@/lib/market'
import { sma, fmtPrice, fmtDate } from '@/lib/market'

interface Props {
  candles: Candle[]
  height?: number
  showMA?: boolean
  livePrice?: number
  upColor?: string
  downColor?: string
}

interface Hover {
  i: number
  x: number
  y: number
}

export default function CandleChart({ candles, height = 320, showMA = true, livePrice, upColor = '#34d399', downColor = '#fb7185' }: Props) {
  const W = 800
  const H = height
  const PAD_R = 64
  const PAD_T = 12
  const PAD_B = 22
  const PAD_L = 8
  const [hover, setHover] = useState<Hover | null>(null)

  const view = useMemo(() => candles.slice(-90), [candles])
  const ma20 = useMemo(() => sma(view.map((c) => c.c), 20), [view])
  const ma50 = useMemo(() => sma(view.map((c) => c.c), 50), [view])

  const { min, max } = useMemo(() => {
    let lo = Infinity
    let hi = -Infinity
    for (const c of view) {
      lo = Math.min(lo, c.l)
      hi = Math.max(hi, c.h)
    }
    if (livePrice) {
      lo = Math.min(lo, livePrice)
      hi = Math.max(hi, livePrice)
    }
    const pad = (hi - lo) * 0.06 || 1
    return { min: lo - pad, max: hi + pad }
  }, [view, livePrice])

  const plotW = W - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B
  const xStep = plotW / view.length
  const candleW = Math.max(2, Math.min(9, xStep * 0.62))

  const y = (v: number) => PAD_T + ((max - v) / (max - min)) * plotH
  const x = (i: number) => PAD_L + i * xStep + xStep / 2

  const gridLevels = useMemo(() => {
    const lines: number[] = []
    const n = 5
    for (let i = 0; i <= n; i++) lines.push(min + ((max - min) * i) / n)
    return lines
  }, [min, max])

  const maPath = (arr: (number | null)[]) => {
    let d = ''
    let started = false
    arr.forEach((v, i) => {
      if (v === null) return
      d += `${started ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`
      started = true
    })
    return d
  }

  const last = view[view.length - 1]
  const lastPrice = livePrice ?? last?.c

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const i = Math.round((px - PAD_L - xStep / 2) / xStep)
    if (i >= 0 && i < view.length) {
      setHover({ i, x: x(i), y: ((e.clientY - rect.top) / rect.height) * H })
    } else setHover(null)
  }

  const hc = hover ? view[hover.i] : null

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full select-none"
        style={{ height }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {/* grid */}
        {gridLevels.map((g, i) => (
          <g key={i}>
            <line x1={PAD_L} x2={W - PAD_R} y1={y(g)} y2={y(g)} stroke="#1e2433" strokeWidth={1} />
            <text x={W - PAD_R + 6} y={y(g) + 3} fill="#5b6478" fontSize={10} fontFamily="ui-monospace, monospace">
              {fmtPrice(g)}
            </text>
          </g>
        ))}
        {/* candles */}
        {view.map((c, i) => {
          const up = c.c >= c.o
          const color = up ? upColor : downColor
          return (
            <g key={i}>
              <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={1} />
              <rect
                x={x(i) - candleW / 2}
                y={y(Math.max(c.o, c.c))}
                width={candleW}
                height={Math.max(1, Math.abs(y(c.o) - y(c.c)))}
                fill={color}
              />
            </g>
          )
        })}
        {/* MAs */}
        {showMA && <path d={maPath(ma20)} fill="none" stroke="#fbbf24" strokeWidth={1.4} opacity={0.9} />}
        {showMA && <path d={maPath(ma50)} fill="none" stroke="#60a5fa" strokeWidth={1.4} opacity={0.9} />}
        {/* last price line */}
        {lastPrice && (
          <g>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={y(lastPrice)}
              y2={y(lastPrice)}
              stroke={last && lastPrice >= last.o ? upColor : downColor}
              strokeWidth={1}
              strokeDasharray="4 3"
              opacity={0.7}
            />
            <rect x={W - PAD_R + 1} y={y(lastPrice) - 8} width={PAD_R - 4} height={16} rx={3} fill="#11151f" stroke="#2a3245" />
            <text x={W - PAD_R + 6} y={y(lastPrice) + 3.5} fill="#e6e9f0" fontSize={10} fontFamily="ui-monospace, monospace">
              {fmtPrice(lastPrice)}
            </text>
          </g>
        )}
        {/* crosshair */}
        {hover && hc && (
          <g>
            <line x1={hover.x} x2={hover.x} y1={PAD_T} y2={H - PAD_B} stroke="#3b4356" strokeWidth={1} strokeDasharray="3 3" />
            <text x={hover.x} y={H - 6} fill="#8b93a7" fontSize={10} textAnchor="middle" fontFamily="ui-monospace, monospace">
              {fmtDate(hc.t)}
            </text>
          </g>
        )}
        {/* x labels */}
        {view.map((c, i) =>
          i % Math.ceil(view.length / 6) === 0 ? (
            <text key={i} x={x(i)} y={H - 6} fill="#5b6478" fontSize={10} textAnchor="middle" fontFamily="ui-monospace, monospace">
              {fmtDate(c.t)}
            </text>
          ) : null,
        )}
      </svg>
      {hover && hc && (
        <div className="pointer-events-none absolute left-2 top-2 rounded-md border border-[#2a3245] bg-[#0c0f16]/95 px-3 py-2 font-mono text-[11px] leading-5 text-slate-300 shadow-xl">
          <div className="text-slate-500">{fmtDate(hc.t)}</div>
          <div>
            O <span className="text-slate-100">{fmtPrice(hc.o)}</span> H <span className="text-emerald-400">{fmtPrice(hc.h)}</span>
          </div>
          <div>
            L <span className="text-rose-400">{fmtPrice(hc.l)}</span> C <span className="text-slate-100">{fmtPrice(hc.c)}</span>
          </div>
        </div>
      )}
      {showMA && (
        <div className="absolute right-16 top-1 flex gap-3 font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 bg-amber-400" /> MA20
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 bg-blue-400" /> MA50
          </span>
        </div>
      )}
    </div>
  )
}
