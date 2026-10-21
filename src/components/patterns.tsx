import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from './icon-library'
import { Checkbox } from './controls'
import { ProgressBar } from './feedback'
import { PrimaryButton, SecondaryButton } from './ui'

/* Dialog ----------------------------------------------------------------- */
export function Dialog({ open, title, description, children, onClose, footer, tone }: { open: boolean; title: string; description?: string; children?: ReactNode; onClose: () => void; footer?: ReactNode; tone?: 'danger' }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-8">
      <div className="animate-fade-in absolute inset-0 bg-ink/30" onClick={onClose} />
      <div role="dialog" aria-modal aria-label={title} className="animate-fade-in relative w-full max-w-[480px] rounded-[6px] border border-line bg-white">
        <div className="flex items-start gap-3 px-6 pt-6">
          {tone === 'danger' && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fcebea] text-danger"><Icon name="warning" size={18} /></span>}
          <div className="flex-1">
            <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
            {description && <p className="mt-1.5 text-[13px] leading-5 text-body">{description}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="-mr-2 -mt-1 grid h-8 w-8 place-items-center rounded-[5px] text-muted hover:bg-[#f5f5f5] hover:text-ink"><Icon name="close" size={16} /></button>
        </div>
        {children && <div className="px-6 pt-5">{children}</div>}
        <div className="mt-6 flex justify-end gap-2 border-t border-line px-6 py-4">
          {footer ?? <><SecondaryButton onClick={onClose}>Cancel</SecondaryButton><PrimaryButton onClick={onClose}>Confirm</PrimaryButton></>}
        </div>
      </div>
    </div>
  )
}

/* File upload ------------------------------------------------------------ */
type UpFile = { name: string; size: number; progress: number }
export function FileUpload({ accept = '.csv,.xlsx,.pdf', hint = 'CSV, XLSX or PDF, max. 20 MB' }: { accept?: string; hint?: string }) {
  const [files, setFiles] = useState<UpFile[]>([{ name: 'inventory-feb-2026.csv', size: 284_000, progress: 100 }, { name: 'site-budapest-photos.pdf', size: 4_200_000, progress: 62 }])
  const [drag, setDrag] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const add = (list: FileList | null) => list && setFiles((f) => [...f, ...Array.from(list).map((x) => ({ name: x.name, size: x.size, progress: 100 }))])
  const kb = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.round(n / 1e3)} KB`)
  return (
    <div>
      <div onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files) }}
        className={`flex flex-col items-center rounded-[6px] border border-dashed px-6 py-8 text-center transition-colors ${drag ? 'border-accent bg-accent-soft/50' : 'border-[#cfcfcf] bg-[#fafafa]'}`}>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink"><Icon name="cloud-upload" /></span>
        <p className="mt-3 text-[13px] text-ink">Drag and drop files here, or <button onClick={() => input.current?.click()} className="font-medium underline decoration-accent decoration-2 underline-offset-4">browse</button></p>
        <p className="mt-1 text-[12px] text-muted">{hint}</p>
        <input ref={input} type="file" multiple accept={accept} className="sr-only" onChange={(e) => add(e.target.files)} />
      </div>
      <ul className="mt-3 space-y-2">
        {files.map((f, i) => (
          <li key={i} className="flex items-center gap-3 rounded-[5px] border border-line px-3 py-2.5">
            <Icon name={f.name.endsWith('.pdf') ? 'file-pdf' : 'file-csv'} className="text-muted" />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between text-[12px]"><span className="truncate text-ink">{f.name}</span><span className="text-muted">{f.progress < 100 ? `${f.progress}%` : kb(f.size)}</span></div>
              {f.progress < 100 && <div className="mt-1.5"><ProgressBar value={f.progress} /></div>}
            </div>
            <button onClick={() => setFiles(files.filter((_, k) => k !== i))} aria-label={`Remove ${f.name}`} className="grid h-7 w-7 place-items-center rounded-[4px] text-muted hover:bg-[#f5f5f5] hover:text-ink"><Icon name="trash" size={16} /></button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Search ----------------------------------------------------------------- */
export function SearchBar({ value, onChange, placeholder = 'Search…', size = 'md', suggestions }: { value: string; onChange: (v: string) => void; placeholder?: string; size?: 'sm' | 'md' | 'lg'; suggestions?: string[] }) {
  const h = { sm: 'h-8 text-[12px]', md: 'h-9 text-[13px]', lg: 'h-12 text-[14px]' }[size]
  const [focus, setFocus] = useState(false)
  const matches = suggestions?.filter((s) => value && s.toLowerCase().includes(value.toLowerCase()) && s !== value).slice(0, 5) ?? []
  return (
    <div className="relative">
      <Icon name="search" size={size === 'lg' ? 20 : 16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 120)}
        className={`${h} w-full rounded-[5px] border border-line bg-white ${size === 'lg' ? 'pl-10' : 'pl-9'} pr-16 text-ink outline-none placeholder:text-muted hover:border-[#cfcfcf] focus:border-accent focus:ring-2 focus:ring-accent/40 [&::-webkit-search-cancel-button]:hidden`} />
      <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {value && <button onClick={() => onChange('')} aria-label="Clear search" className="grid h-6 w-6 place-items-center rounded-[4px] text-muted hover:text-ink"><Icon name="close" size={14} /></button>}
        {size === 'lg' && !value && <kbd className="rounded-[3px] border border-line px-1.5 text-[11px] text-muted">/</kbd>}
      </span>
      {focus && matches.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 rounded-[5px] border border-line bg-white py-1">
          {matches.map((m) => <li key={m}><button onMouseDown={() => onChange(m)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-ink hover:bg-blue-tint"><Icon name="search" size={14} className="text-muted" />{m}</button></li>)}
        </ul>
      )}
    </div>
  )
}

/* List builder (dual list) ----------------------------------------------- */
export function ListBuilder({ available: init, selected: initSel = [] }: { available: string[]; selected?: string[] }) {
  const [sel, setSel] = useState<string[]>(initSel)
  const [pick, setPick] = useState<Set<string>>(new Set())
  const [q, setQ] = useState('')
  const avail = init.filter((x) => !sel.includes(x) && x.toLowerCase().includes(q.toLowerCase()))
  const tog = (x: string) => setPick((s) => { const n = new Set(s); n.has(x) ? n.delete(x) : n.add(x); return n })
  const move = (to: 'right' | 'left') => {
    if (to === 'right') setSel([...sel, ...avail.filter((x) => pick.has(x))])
    else setSel(sel.filter((x) => !pick.has(x)))
    setPick(new Set())
  }
  const Panel = ({ title, items, search }: { title: string; items: string[]; search?: boolean }) => (
    <div className="flex h-[280px] flex-col rounded-[6px] border border-line">
      <div className="flex h-10 items-center justify-between border-b border-line bg-[#fafafa] px-3 text-[12px]"><span className="font-medium text-ink">{title}</span><span className="text-muted">{items.length}</span></div>
      {search && <div className="border-b border-line p-2"><SearchBar size="sm" value={q} onChange={setQ} placeholder="Filter…" /></div>}
      <ul className="flex-1 overflow-y-auto p-1">
        {items.map((x) => <li key={x} className="rounded-[4px] px-2 py-1.5 hover:bg-[#f5f5f5]"><Checkbox label={x} checked={pick.has(x)} onChange={() => tog(x)} /></li>)}
        {!items.length && <li className="px-2 py-6 text-center text-[12px] text-muted">No items</li>}
      </ul>
    </div>
  )
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      {Panel({ title: "Available", items: avail, search: true })}
      <div className="flex flex-col gap-2">
        <SecondaryButton onClick={() => move('right')} aria-label="Add selected" className="w-9 px-0"><Icon name="chevron-right" size={16} /></SecondaryButton>
        <SecondaryButton onClick={() => move('left')} aria-label="Remove selected" className="w-9 px-0"><Icon name="chevron-left" size={16} /></SecondaryButton>
      </div>
      {Panel({ title: "Selected", items: sel })}
    </div>
  )
}

/* Wizard ----------------------------------------------------------------- */
export type WizardStep = { title: string; description?: string; content: ReactNode }
export function Wizard({ steps, orientation = 'horizontal', onFinish }: { steps: WizardStep[]; orientation?: 'horizontal' | 'vertical'; onFinish?: () => void }) {
  const [i, setI] = useState(0)
  const last = i === steps.length - 1
  const marker = (k: number) => (
    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${k < i ? 'bg-ink text-white' : k === i ? 'bg-accent text-ink' : 'border border-[#d0d0d0] bg-white text-muted'}`}>
      {k < i ? <Icon name="check" size={12} strokeWidth={2.5} /> : k + 1}
    </span>
  )
  const stepsPanel = orientation === 'horizontal' ? (
    <ol className="flex items-center gap-3 border-b border-line px-6 py-4">
      {steps.map((s, k) => (
        <li key={k} className="flex flex-1 items-center gap-3 last:flex-none">
          <button disabled={k > i} onClick={() => setI(k)} className="flex items-center gap-2.5 disabled:cursor-default">
            {marker(k)}<span className={`whitespace-nowrap text-[13px] ${k === i ? 'font-semibold text-ink' : k < i ? 'text-ink' : 'text-muted'}`}>{s.title}</span>
          </button>
          {k < steps.length - 1 && <span className={`h-px flex-1 ${k < i ? 'bg-ink' : 'bg-line'}`} />}
        </li>
      ))}
    </ol>
  ) : (
    <ol className="w-[240px] shrink-0 border-r border-line bg-blue-tint p-6">
      {steps.map((s, k) => (
        <li key={k} className="relative pb-6 last:pb-0">
          {k < steps.length - 1 && <span className={`absolute left-3 top-7 bottom-1 w-px ${k < i ? 'bg-ink' : 'bg-[#d5dde6]'}`} />}
          <button disabled={k > i} onClick={() => setI(k)} className="flex items-start gap-3 text-left disabled:cursor-default">
            {marker(k)}
            <span><span className={`block text-[13px] ${k === i ? 'font-semibold text-ink' : k < i ? 'text-ink' : 'text-muted'}`}>{s.title}</span>{s.description && <span className="mt-0.5 block text-[12px] text-muted">{s.description}</span>}</span>
          </button>
        </li>
      ))}
    </ol>
  )
  return (
    <div className={`overflow-hidden rounded-[6px] border border-line bg-white ${orientation === 'vertical' ? 'flex' : ''}`}>
      {stepsPanel}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Step {i + 1} of {steps.length}</p>
          <h3 className="mt-1 text-[16px] font-semibold text-ink">{steps[i].title}</h3>
          <div className="mt-5">{steps[i].content}</div>
        </div>
        <div className="flex justify-between border-t border-line px-6 py-4">
          <SecondaryButton disabled={i === 0} onClick={() => setI(i - 1)} className="disabled:opacity-40">Back</SecondaryButton>
          <PrimaryButton onClick={() => (last ? (onFinish?.(), setI(0)) : setI(i + 1))}>{last ? 'Finish' : 'Continue'}</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
