import { useState } from 'react'
import type { Cell, CellState, Day } from '../data'

export const STATE_LABEL: Record<CellState, string> = { used: 'Used', standby: 'Standby', error: 'Error', idle: 'Not in use' }

function usedBg(v: number) {
  // interpolate #FFF4D1 -> #FFC629
  const t = Math.min(1, Math.max(0, v / 100))
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t)
  return `rgb(${mix(255, 255)}, ${mix(244, 198)}, ${mix(209, 41)})`
}

export function HeatCell({ cell, size = 'md' }: { cell: Cell; size?: 'md' | 'sm' }) {
  const dim = size === 'sm' ? 'h-4 w-5' : 'h-7 w-full min-w-[26px]'
  if (cell.state === 'used')
    return <div className={`${dim} grid place-items-center rounded-[3px] text-[10px] font-medium tabular-nums text-ink`} style={{ background: usedBg(cell.value) }}>{size === 'md' ? cell.value : ''}</div>
  if (cell.state === 'standby') return <div className={`${dim} rounded-[3px] bg-[#dde5ee]`} />
  if (cell.state === 'error')
    return (
      <div className={`${dim} grid place-items-center rounded-[3px] border-[1.5px] border-danger bg-white text-danger`}>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M5 1.5v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="5" cy="8.3" r=".9" fill="currentColor" /></svg>
      </div>
    )
  return <div className={`${dim} hatch rounded-[3px] border border-[#e8e8e8]`} />
}

export function Legend() {
  const items: [CellState, Cell][] = [['used', { state: 'used', value: 70 }], ['standby', { state: 'standby', value: 0 }], ['error', { state: 'error', value: 0 }], ['idle', { state: 'idle', value: 0 }]]
  return (
    <div className="flex flex-wrap items-center gap-6 text-[12px] text-body">
      {items.map(([s, c]) => (
        <span key={s} className="flex items-center gap-2">
          {s === 'used' ? (
            <span className="flex gap-0.5">{[15, 50, 95].map((v) => <HeatCell key={v} size="sm" cell={{ state: 'used', value: v }} />)}</span>
          ) : <HeatCell size="sm" cell={c} />}
          {STATE_LABEL[s]}{s === 'used' && <span className="text-muted">(0–100%)</span>}
        </span>
      ))}
    </div>
  )
}

export function Heatmap({ days }: { days: Day[] }) {
  const [tip, setTip] = useState<{ x: number; y: number; date: string; hour: number; cell: Cell } | null>(null)
  return (
    <div className="relative overflow-x-auto" onMouseLeave={() => setTip(null)}>
      <table className="w-full border-separate border-spacing-[3px] text-[11px]">
        <thead>
          <tr>
            <th className="w-[92px] text-left font-medium text-muted">Date</th>
            {Array.from({ length: 24 }, (_, h) => <th key={h} className="font-medium tabular-nums text-muted">{String(h).padStart(2, '0')}</th>)}
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d.date}>
              <td className="whitespace-nowrap pr-2 tabular-nums text-body">{d.date}</td>
              {d.hours.map((c, h) => (
                <td key={h} className="p-0"
                  onMouseEnter={(e) => {
                    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
                    const p = (e.currentTarget.closest('.relative') as HTMLElement).getBoundingClientRect()
                    setTip({ x: r.left - p.left + r.width / 2, y: r.top - p.top, date: d.date, hour: h, cell: c })
                  }}>
                  <div className="transition-transform hover:scale-110"><HeatCell cell={c} /></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {tip && (
        <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-[5px] bg-ink px-3 py-2 text-[11px] leading-4 text-white" style={{ left: tip.x, top: tip.y - 6 }}>
          <div className="font-medium">{tip.date} · {String(tip.hour).padStart(2, '0')}:00–{String(tip.hour + 1).padStart(2, '0')}:00</div>
          <div className="text-white/70">{STATE_LABEL[tip.cell.state]} · {tip.cell.value}%</div>
        </div>
      )}
    </div>
  )
}
