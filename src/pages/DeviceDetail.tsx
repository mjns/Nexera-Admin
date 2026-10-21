import { useMemo, useState } from 'react'
import { buildDays, fmtDate, type Device } from '../data'
import { Heatmap, Legend } from '../components/Heatmap'
import { LineChart } from '../components/LineChart'
import { SidePanel } from '../components/SidePanel'
import { Field, PrimaryButton, TextInput } from '../components/ui'

export function DeviceDetail({ device, from, to, panelOpen, setPanelOpen }: { device: Device; from: string; to: string; panelOpen: boolean; setPanelOpen: (b: boolean) => void }) {
  const [range, setRange] = useState({ from, to })
  const [draft, setDraft] = useState(range)
  const days = useMemo(() => buildDays(range.from, range.to), [range])
  const avg = Math.round(days.reduce((s, d) => s + d.avg, 0) / Math.max(1, days.length))
  const errors = days.reduce((s, d) => s + d.hours.filter((h) => h.state === 'error').length, 0)

  const meta: [string, string][] = [['Name', device.name], ['Category', device.category], ['Site', device.site], ['Serial no.', device.serial], ['In service since', fmtDate(device.since)], ['Period', `${fmtDate(range.from)} – ${fmtDate(range.to)}`]]

  return (
    <div className="flex min-h-[calc(100vh-92px)]">
      <main className="min-w-0 flex-1 px-8 py-8">
        <section className="flex items-start justify-between gap-8 border-b border-line pb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Inventory no.</p>
            <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.01em] text-ink tabular-nums">{device.inv}</h1>
            <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
              {meta.map(([k, v]) => (
                <div key={k}><dt className="text-[12px] text-muted">{k}</dt><dd className="mt-0.5 text-[13px] font-medium text-ink">{v}</dd></div>
              ))}
            </dl>
          </div>
          <div className="flex shrink-0 gap-8 rounded-[6px] border border-line px-6 py-4">
            <div><p className="text-[12px] text-muted">Avg. utilization</p><p className="mt-1 text-[24px] font-semibold tabular-nums text-ink">{avg}%</p></div>
            <div className="w-px bg-line" />
            <div><p className="text-[12px] text-muted">Error hours</p><p className="mt-1 text-[24px] font-semibold tabular-nums text-ink">{errors}</p></div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-[16px] font-semibold text-ink">Daily utilization</h2>
            <span className="text-[12px] text-muted">Average per day, %</span>
          </div>
          <div className="rounded-[6px] border border-line p-4">
            <LineChart points={days.map((d) => ({ date: d.date, value: d.avg }))} />
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-[16px] font-semibold text-ink">Hourly utilization</h2>
              <p className="mt-1 text-[12px] text-muted">One row per day, one cell per hour (00–23)</p>
            </div>
            <Legend />
          </div>
          <div className="rounded-[6px] border border-line p-3">
            <Heatmap days={days} />
          </div>
        </section>
      </main>

      <SidePanel title="Filters" open={panelOpen} onToggle={() => setPanelOpen(!panelOpen)}>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setRange(draft) }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Date range</p>
          <Field label="From"><TextInput type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></Field>
          <Field label="To"><TextInput type="date" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} /></Field>
          <div className="pt-2"><PrimaryButton type="submit" full>Apply</PrimaryButton></div>
        </form>
      </SidePanel>
    </div>
  )
}
