import { useState } from 'react'
import { CATEGORIES, DEVICES, GRANULARITY, SITES, fmtDate, type Device } from '../data'
import { DataTable, type Column } from '../components/DataTable'
import { DownloadIcon, EyeIcon, SearchIcon } from '../components/icons'
import { Field, FieldGroup, PrimaryButton, SecondaryButton, SelectInput, TextInput, TextLink } from '../components/ui'

export type Filters = { from: string; to: string; tFrom: string; tTo: string; gran: string; name: string; serial: string; category: string; site: string }
export const EMPTY: Filters = { from: '2026-02-01', to: '2026-02-28', tFrom: '08:00', tTo: '18:00', gran: 'Daily', name: '', serial: '', category: '', site: '' }

export function UtilizationSearch({ filters, setFilters, submitted, setSubmitted, onView }: {
  filters: Filters; setFilters: (f: Filters) => void; submitted: boolean; setSubmitted: (b: boolean) => void; onView: (d: Device) => void
}) {
  const [f, setF] = useState(filters)
  const set = (k: keyof Filters) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })
  const a = filters
  const results = DEVICES.filter((d) =>
    (!a.name || d.name.toLowerCase().includes(a.name.toLowerCase())) &&
    (!a.serial || d.serial.toLowerCase().includes(a.serial.toLowerCase())) &&
    (!a.category || d.category === a.category) && (!a.site || d.site === a.site))

  const cols: Column<Device>[] = [
    { key: 'inv', header: 'Inventory no.', render: (d) => <button onClick={(e) => { e.stopPropagation(); onView(d) }} className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink">{d.inv}</button> },
    { id: 'view', key: 'inv', header: '', width: '44px', sortable: false, render: (d) => (
      <button onClick={(e) => { e.stopPropagation(); onView(d) }} aria-label={`View ${d.inv}`}
        className="group/eye relative grid h-7 w-7 place-items-center rounded-[4px] text-muted hover:bg-white hover:text-ink">
        <EyeIcon />
        <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-ink px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover/eye:opacity-100">View</span>
      </button>) },
    { key: 'serial', header: 'Serial no.', render: (d) => <span className="tabular-nums">{d.serial}</span> },
    { key: 'name', header: 'Name', render: (d) => <span className="text-ink">{d.name}</span> },
    { key: 'type', header: 'Type' },
    { key: 'category', header: 'Category' },
    { key: 'site', header: 'Site' },
    { key: 'since', header: 'In service since', render: (d) => fmtDate(d.since) },
    { key: 'util', header: 'Avg. utilization', render: (d) => (
      <span className="flex items-center gap-2.5">
        <span className="h-1 w-20 overflow-hidden rounded-full bg-[#efefef]"><span className="block h-full rounded-full bg-accent" style={{ width: `${d.util}%` }} /></span>
        <span className="w-8 tabular-nums text-ink">{d.util}%</span>
      </span>) },
    { key: 'notes', header: 'Notes', sortable: false, render: (d) => <span title={d.notes} className="block max-w-[180px] truncate text-muted">{d.notes}</span> },
  ]

  return (
    <div className="flex min-h-[calc(100vh-92px)]">
      <aside className="w-[300px] shrink-0 border-r border-line bg-blue-tint">
        <form className="flex flex-col gap-8 p-6" onSubmit={(e) => { e.preventDefault(); setFilters(f); setSubmitted(true) }}>
          <h2 className="text-[14px] font-semibold text-ink">Filters</h2>
          <FieldGroup title="Date range">
            <div className="grid grid-cols-2 gap-2">
              <Field label="From"><TextInput type="date" value={f.from} onChange={set('from')} /></Field>
              <Field label="To"><TextInput type="date" value={f.to} onChange={set('to')} /></Field>
            </div>
          </FieldGroup>
          <FieldGroup title="Time of day">
            <div className="grid grid-cols-2 gap-2">
              <Field label="From"><TextInput type="time" value={f.tFrom} onChange={set('tFrom')} /></Field>
              <Field label="To"><TextInput type="time" value={f.tTo} onChange={set('tTo')} /></Field>
            </div>
          </FieldGroup>
          <FieldGroup title="Device">
            <div className="space-y-4">
              <Field label="Granularity"><SelectInput options={GRANULARITY} value={f.gran} onChange={set('gran')} /></Field>
              <Field label="Device name"><TextInput placeholder="e.g. Core Router" value={f.name} onChange={set('name')} /></Field>
              <Field label="Serial number"><TextInput placeholder="e.g. SN-4G7K-22931" value={f.serial} onChange={set('serial')} /></Field>
              <Field label="Category"><SelectInput placeholder="All categories" options={CATEGORIES} value={f.category} onChange={set('category')} /></Field>
              <Field label="Site"><SelectInput placeholder="All sites" options={SITES} value={f.site} onChange={set('site')} /></Field>
            </div>
          </FieldGroup>
          <div className="flex flex-col items-center gap-3 border-t border-[#dfe5ec] pt-6">
            <PrimaryButton type="submit" full>Submit</PrimaryButton>
            <TextLink type="button" onClick={() => { setF(EMPTY); setFilters(EMPTY); setSubmitted(false) }}>Clear filters</TextLink>
          </div>
        </form>
      </aside>

      <main className="min-w-0 flex-1 px-8 py-8">
        {!submitted ? (
          <div className="grid h-full min-h-[420px] place-items-center">
            <div className="max-w-[340px] text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-line text-muted"><SearchIcon /></span>
              <h2 className="mt-5 text-[16px] font-semibold text-ink">No results yet</h2>
              <p className="mt-2 text-[13px] leading-5 text-muted">Set your filters and press Submit to see device utilization.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-[20px] font-semibold text-ink">{results.length} devices</h2>
                <p className="mt-1 text-[12px] text-muted">{fmtDate(a.from)} – {fmtDate(a.to)} · {a.tFrom}–{a.tTo} · {a.gran}</p>
              </div>
              <SecondaryButton><DownloadIcon />Export CSV</SecondaryButton>
            </div>
            <DataTable columns={cols} rows={results} rowKey={(d) => d.inv} onRowClick={onView} />
          </>
        )}
      </main>
    </div>
  )
}
