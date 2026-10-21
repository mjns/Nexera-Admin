import { useState } from 'react'
import { fmtDate } from '../data'

export function LineChart({ points, height = 260 }: { points: { date: string; value: number }[]; height?: number }) {
  const W = 1000, H = height, pl = 40, pr = 16, pt = 16, pb = 28
  const [hover, setHover] = useState<number | null>(null)
  const x = (i: number) => pl + (i / (points.length - 1)) * (W - pl - pr)
  const y = (v: number) => pt + (1 - v / 100) * (H - pt - pb)
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ')
  const area = `${line} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" preserveAspectRatio="none" style={{ height }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          const px = ((e.clientX - r.left) / r.width) * W
          setHover(Math.max(0, Math.min(points.length - 1, Math.round(((px - pl) / (W - pl - pr)) * (points.length - 1)))))
        }}
        onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FFC629" stopOpacity=".28" /><stop offset="1" stopColor="#FFC629" stopOpacity=".02" /></linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={pl} x2={W - pr} y1={y(v)} y2={y(v)} stroke="#EFEFEF" vectorEffect="non-scaling-stroke" />
            <text x={pl - 10} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#8A8A8A">{v}%</text>
          </g>
        ))}
        {points.map((p, i) => (i % 3 === 0 || i === points.length - 1) && (
          <text key={p.date} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#8A8A8A">{p.date.slice(8)}</text>
        ))}
        <path d={area} fill="url(#fill)" />
        <path d={line} fill="none" stroke="#FFC629" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={pt} y2={y(0)} stroke="#111" strokeOpacity=".2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />}
      </svg>
      {hover !== null && (
        <>
          <span className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent ring-1 ring-ink/20"
            style={{ left: `${(x(hover) / W) * 100}%`, top: y(points[hover].value) }} />
          <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-[5px] bg-ink px-3 py-2 text-[11px] leading-4 text-white"
            style={{ left: `${(x(hover) / W) * 100}%`, top: y(points[hover].value) - 10 }}>
            <div className="text-white/70">{fmtDate(points[hover].date)}</div>
            <div className="font-semibold">{points[hover].value}% utilization</div>
          </div>
        </>
      )}
    </div>
  )
}
