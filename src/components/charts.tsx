import { useState } from 'react'
import { Icon } from './icon-library'

export const CHART_COLORS = ['#FFC629', '#111111', '#8FA3B8', '#C9D3DE', '#4A4A4A', '#FFE08A']

export function KpiCard({ label, value, unit, delta, spark }: { label: string; value: string; unit?: string; delta?: number; spark?: number[] }) {
  return (
    <div className="rounded-[6px] border border-line p-5">
      <p className="text-[12px] text-muted">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <p className="text-[28px] font-semibold leading-none tracking-[-0.01em] tabular-nums text-ink">{value}{unit && <span className="ml-1 text-[14px] font-medium text-muted">{unit}</span>}</p>
        {spark && <Sparkline data={spark} />}
      </div>
      {delta !== undefined && (
        <p className={`mt-3 flex items-center gap-1 text-[12px] ${delta >= 0 ? 'text-[#1d6b3a]' : 'text-danger'}`}>
          <Icon name={delta >= 0 ? 'arrow-up-right' : 'arrow-down-left'} size={14} />{Math.abs(delta)}% <span className="text-muted">vs. last period</span>
        </p>
      )}
    </div>
  )
}

export function Sparkline({ data, w = 96, h = 32 }: { data: number[]; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - min) / (max - min || 1)) * (h - 4)}`).join(' ')
  return <svg width={w} height={h} aria-hidden><polyline points={pts} fill="none" stroke="#FFC629" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" /></svg>
}

export function BarChart({ data, height = 200, max = 100, unit = '%' }: { data: { label: string; value: number }[]; height?: number; max?: number; unit?: string }) {
  const [h, setH] = useState<number | null>(null)
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2" onMouseEnter={() => setH(i)} onMouseLeave={() => setH(null)}>
          <span className={`text-[11px] tabular-nums ${h === i ? 'text-ink' : 'text-muted'}`}>{d.value}{unit}</span>
          <div className={`w-full max-w-[40px] rounded-t-[3px] transition-colors ${h === null || h === i ? 'bg-accent' : 'bg-accent/40'}`} style={{ height: `${(d.value / max) * 100 * 0.78}%` }} />
          <span className="text-[11px] text-muted">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export function HBarChart({ data, max = 100 }: { data: { label: string; value: number }[]; max?: number }) {
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label} className="grid grid-cols-[110px_1fr_40px] items-center gap-3 text-[12px]">
          <span className="truncate text-body">{d.label}</span>
          <span className="h-2 rounded-full bg-[#f0f0f0]"><span className="block h-full rounded-full bg-ink" style={{ width: `${(d.value / max) * 100}%` }} /></span>
          <span className="text-right tabular-nums text-ink">{d.value}%</span>
        </li>
      ))}
    </ul>
  )
}

export function DonutChart({ data, size = 160, label }: { data: { label: string; value: number }[]; size?: number; label?: string }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const r = 15.9155, c = 100
  let acc = 0
  return (
    <div className="flex items-center gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 42 42" className="-rotate-90" width={size} height={size}>
          <circle cx="21" cy="21" r={r} fill="none" stroke="#F2F2F2" strokeWidth="5" />
          {data.map((d, i) => {
            const pct = (d.value / total) * c
            const el = <circle key={d.label} cx="21" cy="21" r={r} fill="none" stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth="5" strokeDasharray={`${Math.max(0, pct - 0.6)} ${c - pct + 0.6}`} strokeDashoffset={-acc} />
            acc += pct
            return el
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center"><div><p className="text-[22px] font-semibold tabular-nums text-ink">{total}</p>{label && <p className="text-[11px] text-muted">{label}</p>}</div></div>
      </div>
      <ul className="space-y-2 text-[12px]">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} /><span className="w-24 text-body">{d.label}</span><span className="tabular-nums text-ink">{d.value}</span></li>
        ))}
      </ul>
    </div>
  )
}

export function Gauge({ value, label }: { value: number; label: string }) {
  const a = Math.PI * (1 - value / 100)
  const x = 50 + 40 * Math.cos(a), y = 50 - 40 * Math.sin(a)
  return (
    <div className="text-center">
      <svg viewBox="0 0 100 58" className="mx-auto w-[180px]">
        <path d="M10 50a40 40 0 0180 0" fill="none" stroke="#F0F0F0" strokeWidth="8" strokeLinecap="round" />
        <path d={`M10 50A40 40 0 0${value > 50 ? 1 : 0}1${x.toFixed(2)} ${y.toFixed(2)}`} fill="none" stroke="#FFC629" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <p className="-mt-6 text-[24px] font-semibold tabular-nums text-ink">{value}%</p>
      <p className="text-[12px] text-muted">{label}</p>
    </div>
  )
}

export function StackedBar({ segments }: { segments: { label: string; value: number; color: string; pattern?: boolean }[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0)
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-[3px]">
        {segments.map((s) => <span key={s.label} title={`${s.label}: ${s.value}%`} className={s.pattern ? 'hatch' : ''} style={{ width: `${(s.value / total) * 100}%`, background: s.pattern ? undefined : s.color }} />)}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[12px]">
        {segments.map((s) => <li key={s.label} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-[2px] ${s.pattern ? 'hatch' : ''}`} style={{ background: s.pattern ? undefined : s.color }} /><span className="text-body">{s.label}</span><span className="tabular-nums text-ink">{s.value}%</span></li>)}
      </ul>
    </div>
  )
}

export function StatList({ items }: { items: { icon: string; label: string; value: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-line bg-line">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-3 bg-white p-4">
          <span className="grid h-9 w-9 place-items-center rounded-[6px] bg-blue-tint text-ink"><Icon name={i.icon} size={18} /></span>
          <span><span className="block text-[18px] font-semibold tabular-nums text-ink">{i.value}</span><span className="text-[12px] text-muted">{i.label}</span></span>
        </li>
      ))}
    </ul>
  )
}
