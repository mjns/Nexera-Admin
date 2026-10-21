import { useMemo, useState, type ReactNode } from 'react'
import { APPS } from '../apps'
import { AppCard } from '../components/AppCard'
import { BarChart, DonutChart, Gauge, HBarChart, KpiCard, StackedBar, StatList } from '../components/charts'
import { Checkbox, Radio, Switch, Textarea } from '../components/controls'
import { DataTable, type Column } from '../components/DataTable'
import { Accordion, Carousel, Timeline, Tree, type TimelineItem, type TreeNode } from '../components/disclosure'
import { Badge, CountBadge, DotsLoader, Notification, ProgressBar, SignalLoader, Skeleton, Spinner } from '../components/feedback'
import { HeatCell, Legend } from '../components/Heatmap'
import { ICON_GROUPS, Icon } from '../components/icon-library'
import { LineChart } from '../components/LineChart'
import { Dialog, FileUpload, ListBuilder, SearchBar, Wizard } from '../components/patterns'
import { AppBar, Header } from '../components/shell'
import { SidePanel } from '../components/SidePanel'
import { Field, FieldGroup, PrimaryButton, SecondaryButton, SelectInput, Tag, TextInput, TextLink } from '../components/ui'
import { CATEGORIES, DEVICES, SITES, buildDays, type Device } from '../data'

const NAV: [string, [string, string][]][] = [
  ['Foundations', [['colors', 'Color'], ['type', 'Typography'], ['spacing', 'Spacing & radius']]],
  ['Shell', [['header', 'Header'], ['appbar', 'AppBar'], ['switcher', 'App switcher & cards'], ['notification', 'Notification']]],
  ['Components', [['buttons', 'Buttons'], ['inputs', 'Form fields'], ['selection', 'Checkbox, radio & switch'], ['badge', 'Badge & tag'], ['loader', 'Loader'], ['progress', 'Progress bar'], ['accordion', 'Accordion'], ['tree', 'Tree'], ['carousel', 'Carousel'], ['timeline', 'Timeline'], ['table', 'Data table'], ['heatmap', 'Heatmap cell & legend'], ['sidepanel', 'Side panel']]],
  ['Patterns', [['dialog', 'Dialog'], ['upload', 'File upload'], ['form', 'Form'], ['listbuilder', 'List builder'], ['search', 'Search'], ['wizard', 'Wizard']]],
  ['Libraries', [['icons', 'Icons'], ['charts', 'Charts & infographics']]],
]

function Section({ id, title, desc, children }: { id: string; title: string; desc?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8 border-b border-line py-12 first:pt-0 last:border-0">
      <h2 className="text-[20px] font-semibold text-ink">{title}</h2>
      {desc && <p className="mt-1.5 max-w-[640px] text-[13px] leading-5 text-muted">{desc}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}
function Specimen({ label, children, pad = true, className = '' }: { label?: string; children: ReactNode; pad?: boolean; className?: string }) {
  return (
    <div className={className}>
      {label && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>}
      <div className={`rounded-[6px] border border-line bg-white ${pad ? 'p-6' : 'overflow-hidden'}`}>{children}</div>
    </div>
  )
}

const COLORS: [string, string, string][] = [
  ['Nexera Yellow', '#FFC629', 'Primary buttons, active states, focus, chart highlight'], ['Yellow soft', '#FFF4D1', 'Selected rows, low-intensity heat'],
  ['Blue grey', '#8FA3B8', 'Secondary accent'], ['Blue tint', '#EEF2F6', 'Sidebars, panels, hover'],
  ['Ink', '#111111', 'Headings, strong text'], ['Body', '#4A4A4A', 'Body text'], ['Muted', '#8A8A8A', 'Secondary text, labels'], ['Line', '#E5E5E5', 'Borders, dividers'],
  ['Surface', '#F7F7F7', 'AppBar, subtle fills'], ['Error', '#9B1C1C', 'Error states'],
]
const STATUS: [string, string, string][] = [['Information', '#EAF1FB', '#1F4E8C'], ['Success', '#E9F6EE', '#1D6B3A'], ['Warning', '#FFF1E3', '#9A4A00'], ['Error', '#FCEBEA', '#9B1C1C']]

const TREE: TreeNode[] = [
  { id: 'eu', label: 'Europe', icon: 'globe', children: [
    { id: 'hu', label: 'Hungary', icon: 'map', children: [{ id: 'bud', label: 'Budapest', icon: 'building', children: [{ id: 'bud-1', label: 'NX-INV-000123 · Macro BTS', icon: 'tower' }, { id: 'bud-2', label: 'NX-INV-000312 · Rectifier', icon: 'battery' }] }] },
    { id: 'at', label: 'Austria', icon: 'map', children: [{ id: 'vie', label: 'Vienna', icon: 'building', children: [{ id: 'vie-1', label: 'NX-INV-000147 · Core Router', icon: 'router' }] }] },
    { id: 'de', label: 'Germany', icon: 'map', children: [{ id: 'ber', label: 'Berlin', icon: 'building' }, { id: 'muc', label: 'Munich', icon: 'building' }] },
  ] },
  { id: 'lab', label: 'Test laboratories', icon: 'flask', children: [{ id: 'lab-a', label: 'Lab A', icon: 'server' }, { id: 'lab-b', label: 'Lab B', icon: 'server' }] },
]
const TL: TimelineItem[] = [
  { title: 'Ordered', date: '2025-11-04', status: 'done', body: 'PO-77812 approved by procurement.' },
  { title: 'Delivered', date: '2025-12-02', status: 'done', body: 'Received at Budapest warehouse.' },
  { title: 'Installed', date: '2026-01-15', status: 'done' },
  { title: 'Acceptance test', date: '2026-02-20', status: 'current', body: 'Running 72h soak test.' },
  { title: 'In service', date: '2026-03-01', status: 'upcoming' },
]

export function DesignSystem() {
  const [active, setActive] = useState('colors')
  const [chk, setChk] = useState({ a: true, b: false, c: false })
  const [radio, setRadio] = useState('daily')
  const [sw, setSw] = useState({ a: true, b: false })
  const [notices, setNotices] = useState(['info', 'success', 'warning', 'error'])
  const [dlg, setDlg] = useState<null | 'confirm' | 'danger' | 'form'>(null)
  const [q1, setQ1] = useState(''), [q2, setQ2] = useState('')
  const [treeSel, setTreeSel] = useState('bud-1')
  const [panel, setPanel] = useState(true)
  const days = useMemo(() => buildDays('2026-02-01', '2026-02-14'), [])

  const cols: Column<Device>[] = [
    { key: 'inv', header: 'Inventory no.', render: (d) => <span className="font-medium text-ink">{d.inv}</span> },
    { key: 'name', header: 'Name' }, { key: 'category', header: 'Category' }, { key: 'site', header: 'Site' },
    { key: 'util', header: 'Utilization', render: (d) => <span className="flex items-center gap-2"><span className="h-1 w-16 rounded-full bg-[#efefef]"><span className="block h-full rounded-full bg-accent" style={{ width: `${d.util}%` }} /></span><span className="tabular-nums">{d.util}%</span></span> },
  ]

  return (
    <div className="flex">
      <aside className="sticky top-0 h-screen w-[240px] shrink-0 overflow-y-auto border-r border-line px-4 py-8">
        <p className="px-3 text-[14px] font-semibold text-ink">Nexera Design System</p>
        <p className="px-3 text-[12px] text-muted">v1.0 · February 2026</p>
        {NAV.map(([g, items]) => (
          <div key={g} className="mt-6">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{g}</p>
            <ul className="mt-1.5">
              {items.map(([id, l]) => (
                <li key={id}><a href={`#${id}`} onClick={() => setActive(id)} className={`block rounded-[4px] border-l-2 px-3 py-1.5 text-[13px] ${active === id ? 'border-accent bg-[#fafafa] font-medium text-ink' : 'border-transparent text-body hover:text-ink'}`}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <main className="min-w-0 flex-1 px-12 py-12">
        <div className="mb-12 max-w-[720px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Nexera Admin</p>
          <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.01em] text-ink">Design System</h1>
          <p className="mt-3 text-[14px] leading-6 text-body">Foundations, components and patterns for every Nexera Admin app. Calm and minimal: white space, 1px borders, an 8px grid, and Nexera Yellow used sparingly for primary actions, active states and data highlights.</p>
        </div>

        {/* Foundations */}
        <Section id="colors" title="Color" desc="Neutrals carry the interface. Yellow signals action and focus; blue grey supports panels. Status colors are reserved for feedback.">
          <div className="grid grid-cols-5 gap-4">
            {COLORS.map(([n, hex, use]) => (
              <div key={hex} className="overflow-hidden rounded-[6px] border border-line">
                <div className="h-20 border-b border-line" style={{ background: hex }} />
                <div className="p-3"><p className="text-[13px] font-medium text-ink">{n}</p><p className="text-[12px] tabular-nums text-muted">{hex}</p><p className="mt-1.5 text-[11px] leading-4 text-muted">{use}</p></div>
              </div>
            ))}
          </div>
          <p className="mb-2 mt-8 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Status</p>
          <div className="grid grid-cols-4 gap-4">
            {STATUS.map(([n, bg, fg]) => <div key={n} className="flex h-14 items-center justify-between rounded-[6px] px-4 text-[13px] font-medium" style={{ background: bg, color: fg }}>{n}<span className="text-[11px] tabular-nums opacity-70">{fg}</span></div>)}
          </div>
        </Section>

        <Section id="type" title="Typography" desc="Inter everywhere. Tabular numerals for IDs, dates and values.">
          <Specimen>
            <div className="divide-y divide-line">
              {[['Display / 28 Semibold', 'text-[28px] font-semibold text-ink tracking-[-0.01em]', 'Welcome to Nexera Admin'], ['Heading / 20 Semibold', 'text-[20px] font-semibold text-ink', '42 devices'], ['Title / 16 Semibold', 'text-[16px] font-semibold text-ink', 'Hourly utilization'], ['Body / 14 Regular', 'text-[14px] text-body', 'Internal workspace for managing work performed and company equipment.'], ['UI / 13 Medium', 'text-[13px] font-medium text-ink', 'Submit · Clear filters · Open →'], ['Table / 12 Regular', 'text-[12px] text-body', 'NX-INV-000123 · SN-4G7K-22931 · Budapest'], ['Overline / 11 Semibold', 'text-[11px] font-semibold uppercase tracking-[0.08em] text-muted', 'Date range']].map(([l, c, t]) => (
                <div key={l} className="grid grid-cols-[200px_1fr] items-baseline gap-6 py-4 first:pt-0 last:pb-0"><span className="text-[12px] text-muted">{l}</span><span className={c}>{t}</span></div>
              ))}
            </div>
          </Specimen>
        </Section>

        <Section id="spacing" title="Spacing & radius" desc="All spacing is a multiple of 8px (4px for tight internal gaps). Radius 4–6px, 1px borders, almost no shadow.">
          <div className="grid grid-cols-2 gap-6">
            <Specimen label="Spacing scale">
              <div className="space-y-2">{[4, 8, 16, 24, 32, 48, 64].map((n) => <div key={n} className="flex items-center gap-4 text-[12px]"><span className="w-10 tabular-nums text-muted">{n}px</span><span className="h-3 rounded-[2px] bg-accent" style={{ width: n * 3 }} /></div>)}</div>
            </Specimen>
            <Specimen label="Radius & elevation">
              <div className="flex items-end gap-6">
                {[['3px', 'Cells'], ['4px', 'Tags'], ['5px', 'Controls'], ['6px', 'Cards'], ['999px', 'Pills']].map(([r, l]) => <div key={r} className="text-center"><div className="h-14 w-14 border border-ink/30 bg-[#fafafa]" style={{ borderRadius: r }} /><p className="mt-2 text-[11px] text-muted">{r}<br />{l}</p></div>)}
                <div className="text-center"><div className="h-14 w-14 rounded-[6px] border border-line bg-white shadow-[0_4px_16px_rgba(17,17,17,0.05)]" /><p className="mt-2 text-[11px] text-muted">Hover lift<br />only</p></div>
              </div>
            </Specimen>
          </div>
        </Section>

        {/* Shell */}
        <Section id="header" title="Header" desc="48px. Company identity left, session right. Identical in every app.">
          <div className="space-y-4">
            <Specimen label="Logged in" pad={false}><Header user="Anna Kovács" onLogin={() => {}} onLogout={() => {}} onHome={() => {}} /></Specimen>
            <Specimen label="Logged out" pad={false}><Header user={null} onLogin={() => {}} onLogout={() => {}} onHome={() => {}} /></Specimen>
          </div>
        </Section>
        <Section id="appbar" title="AppBar" desc="44px, light grey surface. App title or breadcrumb on the left; optional contextual actions and the Apps trigger on the right.">
          <div className="space-y-4">
            <Specimen label="Title" pad={false}><AppBar title="Utilization" onOpenApps={() => {}} /></Specimen>
            <Specimen label="Breadcrumb + action" pad={false}><AppBar title="Utilization" onOpenApps={() => {}} crumbs={[{ label: 'Utilization', onClick: () => {} }, { label: 'Device detail' }, { label: 'NX-INV-000123' }]} right={<button className="text-[13px] text-body hover:text-ink">← Back to results</button>} /></Specimen>
          </div>
        </Section>
        <Section id="switcher" title="App switcher & cards" desc="The switcher slides in from the right (open it via “Apps” above). Cards are the Home page entry points.">
          <div className="grid grid-cols-3 gap-6">
            <AppCard app={APPS[4]} onOpen={() => {}} />
            <AppCard app={APPS[0]} onOpen={() => {}} />
            <Specimen label="Switcher row states">
              <div className="-m-6">
                {[APPS[4], APPS[1]].map((a, i) => { const I = a.icon; return (
                  <div key={a.id} className={`flex gap-4 border-l-[3px] px-6 py-4 ${i === 0 ? 'border-accent bg-[#fafafa]' : 'border-transparent opacity-50'}`}>
                    <I className="mt-0.5 text-ink" /><div><p className="flex items-center gap-2 text-[14px] font-medium text-ink">{a.name}{!a.available && <Tag>Coming soon</Tag>}</p><p className="mt-1 text-[12px] text-muted">{a.description}</p></div>
                  </div>) })}
              </div>
            </Specimen>
          </div>
        </Section>
        <Section id="notification" title="Notification" desc="A full-width bar directly below the AppBar. Each tone has an icon, so meaning never relies on color alone.">
          <Specimen pad={false}>
            <AppBar title="Utilization" onOpenApps={() => {}} />
            {notices.includes('info') && <Notification tone="info" title="Scheduled maintenance." onClose={() => setNotices(notices.filter((n) => n !== 'info'))}>Data sync will pause on 3 Mar 2026, 22:00–23:00 CET.</Notification>}
            {notices.includes('success') && <Notification tone="success" title="Export complete." onClose={() => setNotices(notices.filter((n) => n !== 'success'))}>utilization-feb-2026.csv is ready to download.</Notification>}
            {notices.includes('warning') && <Notification tone="warning" title="Partial data." action={<button className="text-[12px] font-medium underline underline-offset-4">View sites</button>} onClose={() => setNotices(notices.filter((n) => n !== 'warning'))}>3 sites have not reported in the last 24 hours.</Notification>}
            {notices.includes('error') && <Notification tone="error" title="Connection lost." action={<button className="text-[12px] font-medium underline underline-offset-4">Retry</button>} onClose={() => setNotices(notices.filter((n) => n !== 'error'))}>Unable to reach the telemetry service.</Notification>}
            <div className="flex h-16 items-center px-8 text-[12px] text-muted">Page content… {notices.length < 4 && <TextLink className="ml-2" onClick={() => setNotices(['info', 'success', 'warning', 'error'])}>Reset</TextLink>}</div>
          </Specimen>
        </Section>

        {/* Components */}
        <Section id="buttons" title="Buttons" desc="One primary (yellow) action per view. Secondary for everything else; text links for low-emphasis actions.">
          <Specimen>
            <div className="flex flex-wrap items-center gap-3">
              <PrimaryButton>Submit</PrimaryButton><PrimaryButton><Icon name="plus" size={16} />Add device</PrimaryButton><PrimaryButton disabled>Disabled</PrimaryButton>
              <span className="mx-2 h-6 w-px bg-line" />
              <SecondaryButton>Cancel</SecondaryButton><SecondaryButton><Icon name="download" size={16} />Export CSV</SecondaryButton>
              <SecondaryButton aria-label="Edit" className="w-9 px-0"><Icon name="edit" size={16} className="shrink-0" /></SecondaryButton>
              <span className="mx-2 h-6 w-px bg-line" />
              <TextLink>Clear filters</TextLink><button className="text-[13px] font-medium text-ink">Open →</button>
              <button aria-label="View" className="grid h-7 w-7 place-items-center rounded-[4px] text-muted hover:bg-[#f2f2f2] hover:text-ink"><Icon name="eye" size={16} /></button>
            </div>
          </Specimen>
        </Section>

        <Section id="inputs" title="Form fields" desc="36px controls, 12px labels above, yellow focus ring.">
          <Specimen>
            <div className="grid grid-cols-3 gap-6">
              <Field label="Device name"><TextInput placeholder="e.g. Core Router" /></Field>
              <Field label="Category"><SelectInput placeholder="All categories" options={CATEGORIES} value="" onChange={() => {}} /></Field>
              <Field label="Date"><TextInput type="date" defaultValue="2026-02-13" /></Field>
              <Field label="Time"><TextInput type="time" defaultValue="08:00" /></Field>
              <Field label="Disabled"><TextInput disabled value="NX-INV-000123" className="bg-[#f7f7f7] text-muted" /></Field>
              <div><Field label="Serial number"><TextInput defaultValue="SN-4G7K" className="border-danger! focus:ring-danger/30!" aria-invalid /></Field><p className="mt-1.5 flex items-center gap-1 text-[12px] text-danger"><Icon name="error" size={14} />Serial number must have 15 characters.</p></div>
              <div className="col-span-3"><Field label="Notes"><Textarea placeholder="Add notes…" /></Field></div>
            </div>
          </Specimen>
        </Section>

        <Section id="selection" title="Checkbox, radio & switch">
          <Specimen>
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-3">
                <Checkbox label="Include standby hours" checked={chk.a} onChange={(v) => setChk({ ...chk, a: v })} />
                <Checkbox label="Only devices with errors" description="Show devices with at least one error hour" checked={chk.b} onChange={(v) => setChk({ ...chk, b: v })} />
                <Checkbox label="Select all (partial)" checked={false} indeterminate onChange={() => {}} />
                <Checkbox label="Disabled" checked={false} disabled />
              </div>
              <div className="space-y-3">{['hourly', 'daily', 'weekly'].map((r) => <Radio key={r} name="g" label={r[0].toUpperCase() + r.slice(1)} checked={radio === r} onChange={() => setRadio(r)} />)}</div>
              <div className="flex flex-col gap-3">
                <Switch label="Email alerts" checked={sw.a} onChange={(v) => setSw({ ...sw, a: v })} />
                <Switch label="Two-factor authentication" checked={sw.b} onChange={(v) => setSw({ ...sw, b: v })} />
                <Switch label="Disabled" checked={false} disabled onChange={() => {}} />
              </div>
            </div>
          </Specimen>
        </Section>

        <Section id="badge" title="Badge & tag">
          <Specimen>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Neutral</Badge><Badge tone="accent">Active</Badge><Badge tone="info" dot>Standby</Badge><Badge tone="success" dot>Online</Badge><Badge tone="warning" dot>Degraded</Badge><Badge tone="error" dot>Offline</Badge>
              <span className="mx-2 h-6 w-px bg-line" /><Tag>Coming soon</Tag>
              <span className="mx-2 h-6 w-px bg-line" /><span className="relative"><Icon name="bell" /><span className="absolute -right-2 -top-2"><CountBadge n={7} /></span></span>
            </div>
          </Specimen>
        </Section>

        <Section id="loader" title="Loader" desc="Spinner for actions, signal bars for telemetry loading, dots inline, skeletons for content placeholders.">
          <Specimen>
            <div className="grid grid-cols-4 items-center gap-8">
              <div className="flex items-center gap-3"><Spinner /><Spinner size={32} /></div>
              <div className="flex items-center gap-3"><SignalLoader /><span className="text-[12px] text-muted">Receiving data…</span></div>
              <div className="flex items-center gap-3"><DotsLoader /></div>
              <div className="space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /><Skeleton className="h-3 w-2/3" /></div>
              <div className="col-span-4"><PrimaryButton disabled className="opacity-100!"><Spinner size={16} />Submitting…</PrimaryButton></div>
            </div>
          </Specimen>
        </Section>

        <Section id="progress" title="Progress bar">
          <Specimen>
            <div className="grid grid-cols-2 gap-8">
              <ProgressBar label="Firmware upload" value={64} />
              <ProgressBar label="Syncing sites" indeterminate />
              <ProgressBar label="Acceptance tests passed" value={100} tone="success" />
              <ProgressBar label="Storage used" value={92} tone="error" />
            </div>
          </Specimen>
        </Section>

        <Section id="accordion" title="Accordion">
          <Accordion items={[
            { title: 'What does “Standby” mean?', meta: 'Utilization', content: 'The device is powered and reachable but carries no measurable load.' },
            { title: 'How is average utilization calculated?', content: 'The mean of all hourly values in the selected period and time window, excluding “Not in use” hours.' },
            { title: 'Who can export data?', content: 'Any user with the Utilization Viewer role or higher.' },
          ]} />
        </Section>

        <Section id="tree" title="Tree" desc="Nested, collapsible navigation, e.g. for sites and equipment or a table of contents.">
          <div className="grid grid-cols-2 gap-6">
            <Specimen><Tree nodes={TREE} defaultOpen={['eu', 'hu', 'bud']} selected={treeSel} onSelect={setTreeSel} /></Specimen>
            <Specimen label="Selected"><p className="text-[13px] text-ink">{treeSel}</p></Specimen>
          </div>
        </Section>

        <Section id="carousel" title="Carousel">
          <Carousel slides={[
            ['New: Utilization', 'Measure product, tool and asset utilization across all 15 sites.', 'gauge'],
            ['Coming soon: Allocation', 'Distribute tools and assets between teams and sites.', 'share'],
            ['Tip', 'Use hourly granularity to spot overnight standby waste.', 'clock'],
          ].map(([t, b, i]) => (
            <div key={t} className="flex h-[180px] items-center gap-8 bg-blue-tint px-10">
              <span className="grid h-16 w-16 place-items-center rounded-[6px] bg-white text-ink"><Icon name={i} size={32} /></span>
              <div><h3 className="text-[20px] font-semibold text-ink">{t}</h3><p className="mt-1.5 text-[13px] text-body">{b}</p></div>
            </div>
          ))} />
        </Section>

        <Section id="timeline" title="Timeline" desc="Horizontal for lifecycle overviews, vertical for detailed event history.">
          <div className="space-y-6">
            <Specimen label="Horizontal"><Timeline items={TL} orientation="horizontal" /></Specimen>
            <Specimen label="Vertical"><div className="max-w-[420px]"><Timeline items={[...TL.slice(0, 3), { title: 'Fan failure detected', date: '2026-02-13', status: 'error', body: 'Error state for 2 hours at 14:00.' }, TL[3]]} /></div></Specimen>
          </div>
        </Section>

        <Section id="table" title="Data table" desc="Sortable headers, row hover, pagination and an optional toolbar with in-table search.">
          <DataTable columns={cols} rows={DEVICES} rowKey={(d) => d.inv} pageSize={5} searchable title="Devices" actions={<SecondaryButton className="h-8"><Icon name="download" size={16} />Export</SecondaryButton>} />
        </Section>

        <Section id="heatmap" title="Heatmap cell & legend" desc="Four states distinguishable without color: value printed, flat fill, border + “!”, and hatching.">
          <Specimen>
            <Legend />
            <div className="mt-6 grid w-fit grid-cols-[repeat(8,40px)] gap-1">
              {[10, 30, 50, 70, 90].map((v) => <HeatCell key={v} cell={{ state: 'used', value: v }} />)}
              <HeatCell cell={{ state: 'standby', value: 0 }} /><HeatCell cell={{ state: 'error', value: 0 }} /><HeatCell cell={{ state: 'idle', value: 0 }} />
            </div>
          </Specimen>
        </Section>

        <Section id="sidepanel" title="Side panel" desc="Collapsible 280px panel on the right edge; collapses to a slim vertical tab.">
          <Specimen pad={false}>
            <div className="flex h-[260px]">
              <div className="flex-1 p-6 text-[12px] text-muted">Content area</div>
              <SidePanel title="Filters" open={panel} onToggle={() => setPanel(!panel)}>
                <div className="space-y-4"><Field label="From"><TextInput type="date" defaultValue="2026-02-01" /></Field><PrimaryButton full>Apply</PrimaryButton></div>
              </SidePanel>
            </div>
          </Specimen>
        </Section>

        {/* Patterns */}
        <Section id="dialog" title="Dialog" desc="Modal confirmation built from buttons and form fields. Escape or backdrop click closes.">
          <Specimen>
            <div className="flex gap-3">
              <SecondaryButton onClick={() => setDlg('confirm')}>Confirmation</SecondaryButton>
              <SecondaryButton onClick={() => setDlg('danger')}>Destructive</SecondaryButton>
              <SecondaryButton onClick={() => setDlg('form')}>With form</SecondaryButton>
            </div>
          </Specimen>
          <Dialog open={dlg === 'confirm'} title="Export utilization data?" description="42 devices, 1 Feb 2026 – 28 Feb 2026, hourly. The file will be sent to your email." onClose={() => setDlg(null)} />
          <Dialog open={dlg === 'danger'} tone="danger" title="Retire NX-INV-000123?" description="The device will be removed from utilization tracking. Historical data is kept." onClose={() => setDlg(null)}
            footer={<><SecondaryButton onClick={() => setDlg(null)}>Cancel</SecondaryButton><button onClick={() => setDlg(null)} className="h-9 rounded-[5px] bg-danger px-4 text-[13px] font-semibold text-white hover:bg-[#7f1616]">Retire device</button></>} />
          <Dialog open={dlg === 'form'} title="Add note" onClose={() => setDlg(null)} footer={<><SecondaryButton onClick={() => setDlg(null)}>Cancel</SecondaryButton><PrimaryButton onClick={() => setDlg(null)}>Save note</PrimaryButton></>}>
            <div className="space-y-4"><Field label="Device"><TextInput value="NX-INV-000123" disabled className="bg-[#f7f7f7] text-muted" /></Field><Field label="Note"><Textarea placeholder="Describe the change…" /></Field></div>
          </Dialog>
        </Section>

        <Section id="upload" title="File upload" desc="Drop zone with per-file progress and removal.">
          <div className="max-w-[560px]"><FileUpload /></div>
        </Section>

        <Section id="form" title="Form" desc="Grouped fields, 2-column grid, actions aligned right at the bottom.">
          <Specimen>
            <form className="max-w-[720px] space-y-8" onSubmit={(e) => e.preventDefault()}>
              <FieldGroup title="Device">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Name"><TextInput placeholder="e.g. Macro BTS North Ridge" /></Field>
                  <Field label="Serial number"><TextInput placeholder="SN-XXXX-XXXXX" /></Field>
                  <Field label="Category"><SelectInput placeholder="Select category" options={CATEGORIES} value="" onChange={() => {}} /></Field>
                  <Field label="Site"><SelectInput placeholder="Select site" options={SITES} value="" onChange={() => {}} /></Field>
                </div>
              </FieldGroup>
              <FieldGroup title="Monitoring">
                <div className="space-y-3"><Switch label="Track utilization" checked onChange={() => {}} /><Checkbox label="Alert on error states" checked onChange={() => {}} /></div>
              </FieldGroup>
              <div className="flex justify-end gap-2 border-t border-line pt-6"><SecondaryButton type="button">Cancel</SecondaryButton><PrimaryButton>Save device</PrimaryButton></div>
            </form>
          </Specimen>
        </Section>

        <Section id="listbuilder" title="List builder" desc="Move items between Available and Selected, e.g. to choose sites for a report.">
          <div className="max-w-[720px]"><ListBuilder available={SITES} selected={['Budapest', 'Vienna']} /></div>
        </Section>

        <Section id="search" title="Search" desc="Standalone search bar with suggestions, and compact search in a table header (see Data table).">
          <div className="grid grid-cols-2 gap-6">
            <Specimen label="Standalone"><SearchBar size="lg" value={q1} onChange={setQ1} placeholder="Search devices, sites, serial numbers…" suggestions={DEVICES.map((d) => d.name)} /></Specimen>
            <Specimen label="Compact / table header"><SearchBar size="sm" value={q2} onChange={setQ2} placeholder="Search in table…" /></Specimen>
          </div>
        </Section>

        <Section id="wizard" title="Wizard" desc="A steps panel and a content panel. Horizontal for short flows, vertical for longer ones.">
          {(['horizontal', 'vertical'] as const).map((o) => (
            <div key={o} className="mb-6 last:mb-0">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{o}</p>
              <Wizard orientation={o} steps={[
                { title: 'Device', description: 'Identify the device', content: <div className="grid max-w-[480px] grid-cols-2 gap-4"><Field label="Name"><TextInput /></Field><Field label="Serial number"><TextInput /></Field></div> },
                { title: 'Location', description: 'Site and room', content: <div className="max-w-[240px]"><Field label="Site"><SelectInput options={SITES} value="Budapest" onChange={() => {}} /></Field></div> },
                { title: 'Documents', description: 'Certificates', content: <div className="max-w-[480px]"><FileUpload /></div> },
                { title: 'Review', description: 'Confirm and save', content: <p className="text-[13px] text-body">Review the details and press Finish.</p> },
              ]} />
            </div>
          ))}
        </Section>

        {/* Libraries */}
        <Section id="icons" title="Icons" desc={`${Object.values(ICON_GROUPS).reduce((s, g) => s + Object.keys(g).length, 0)} line icons on a 24px grid, 1.5px stroke, round caps. Use <Icon name="…" />.`}>
          <div className="space-y-8">
            {Object.entries(ICON_GROUPS).map(([g, icons]) => (
              <div key={g}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{g} <span className="font-normal">· {Object.keys(icons).length}</span></p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-px overflow-hidden rounded-[6px] border border-line bg-line">
                  {Object.keys(icons).map((n) => (
                    <div key={n} title={n} className="group flex h-[88px] flex-col items-center justify-center gap-2.5 bg-white hover:bg-blue-tint">
                      <Icon name={n} size={24} className="text-ink" />
                      <span className="max-w-full truncate px-2 text-[11px] text-muted group-hover:text-ink">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="charts" title="Charts & infographics" desc="Yellow for the highlighted series, ink and blue grey for comparisons. Always label values; never rely on color alone.">
          <div className="grid grid-cols-3 gap-4">
            <KpiCard label="Avg. utilization" value="63" unit="%" delta={4.2} spark={[52, 55, 51, 58, 60, 57, 63]} />
            <KpiCard label="Devices tracked" value="1,284" delta={1.1} spark={[1200, 1210, 1230, 1240, 1255, 1270, 1284]} />
            <KpiCard label="Error hours" value="37" delta={-12} spark={[60, 52, 55, 44, 40, 41, 37]} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Specimen label="Line / area"><LineChart points={days.map((d) => ({ date: d.date, value: d.avg }))} height={200} /></Specimen>
            <Specimen label="Column"><BarChart data={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((l, i) => ({ label: l, value: [72, 78, 81, 76, 69, 28, 19][i] }))} /></Specimen>
            <Specimen label="Donut"><DonutChart label="devices" data={[{ label: 'Base station', value: 412 }, { label: 'Router', value: 286 }, { label: 'Switch', value: 241 }, { label: 'Antenna', value: 198 }, { label: 'Other', value: 147 }]} /></Specimen>
            <Specimen label="Gauge & horizontal bars">
              <div className="grid grid-cols-[180px_1fr] items-center gap-8">
                <Gauge value={78} label="Budapest" />
                <HBarChart data={[{ label: 'Paris', value: 91 }, { label: 'Munich', value: 87 }, { label: 'Vienna', value: 64 }, { label: 'Berlin', value: 41 }]} />
              </div>
            </Specimen>
            <Specimen label="State distribution"><StackedBar segments={[{ label: 'Used', value: 58, color: '#FFC629' }, { label: 'Standby', value: 30, color: '#DDE5EE' }, { label: 'Error', value: 2, color: '#9B1C1C' }, { label: 'Not in use', value: 10, color: '', pattern: true }]} /></Specimen>
            <Specimen label="Stat list"><StatList items={[{ icon: 'tower', label: 'Base stations', value: '412' }, { icon: 'pin', label: 'Sites', value: '15' }, { icon: 'users', label: 'Field engineers', value: '86' }, { icon: 'shield-check', label: 'Certified', value: '98%' }]} /></Specimen>
          </div>
        </Section>
      </main>
    </div>
  )
}
