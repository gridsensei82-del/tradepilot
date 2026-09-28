import { useMemo } from 'react'

interface Props {
  values: number[]
  width?: number
  height?: number
  positive?: boolean
}

export default function Sparkline({ values, width = 120, height = 36, positive }: Props) {
  const { d, color } = useMemo(() => {
    if (values.length < 2) return { d: '', color: '#64748b' }
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const step = width / (values.length - 1)
    let path = ''
    values.forEach((v, i) => {
      const px = i * step
      const py = height - 3 - ((v - min) / range) * (height - 6)
      path += `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`
    })
    const up = positive !== undefined ? positive : values[values.length - 1] >= values[0]
    return { d: path, color: up ? '#34d399' : '#fb7185' }
  }, [values, width, height, positive])

  return (
    <svg width={width} height={height} className="block">
      <path d={d} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
