import { useState, type ReactNode } from 'react'
import { Icon } from './icon-library'

/* Accordion -------------------------------------------------------------- */
export function Accordion({ items, multiple }: { items: { title: string; content: ReactNode; meta?: string }[]; multiple?: boolean }) {
  const [open, setOpen] = useState<number[]>([0])
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : multiple ? [...o, i] : [i]))
  return (
    <div className="divide-y divide-line rounded-[6px] border border-line">
      {items.map((it, i) => {
        const on = open.includes(i)
        return (
          <div key={i}>
            <button onClick={() => toggle(i)} aria-expanded={on} className="flex h-12 w-full items-center gap-3 px-4 text-left text-[13px] font-medium text-ink hover:bg-[#fafafa]">
              <Icon name="chevron-right" size={16} className={`text-muted transition-transform ${on ? 'rotate-90' : ''}`} />
              <span className="flex-1">{it.title}</span>
              {it.meta && <span className="text-[12px] font-normal text-muted">{it.meta}</span>}
            </button>
            {on && <div className="px-4 pb-4 pl-11 text-[13px] leading-5 text-body">{it.content}</div>}
          </div>
        )
      })}
    </div>
  )
}

/* Tree ------------------------------------------------------------------- */
export type TreeNode = { id: string; label: string; icon?: string; children?: TreeNode[] }
export function Tree({ nodes, defaultOpen = [], selected, onSelect }: { nodes: TreeNode[]; defaultOpen?: string[]; selected?: string; onSelect?: (id: string) => void }) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen))
  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const render = (list: TreeNode[], depth: number): ReactNode => (
    <ul role={depth ? 'group' : 'tree'}>
      {list.map((n) => {
        const has = !!n.children?.length, on = open.has(n.id), sel = selected === n.id
        return (
          <li key={n.id} role="treeitem" aria-expanded={has ? on : undefined} aria-selected={sel}>
            <div className={`flex h-8 items-center gap-1.5 rounded-[4px] pr-2 text-[13px] ${sel ? 'bg-accent-soft font-medium text-ink' : 'text-body hover:bg-[#f5f5f5]'}`} style={{ paddingLeft: 4 + depth * 16 }}>
              <button onClick={() => has && toggle(n.id)} className={`grid h-5 w-5 place-items-center text-muted ${has ? '' : 'invisible'}`} aria-label={on ? 'Collapse' : 'Expand'}>
                <Icon name="chevron-right" size={14} className={`transition-transform ${on ? 'rotate-90' : ''}`} />
              </button>
              <button onClick={() => { onSelect?.(n.id); if (has && !on) toggle(n.id) }} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                {n.icon && <Icon name={n.icon} size={16} className="shrink-0 text-muted" />}
                <span className="truncate">{n.label}</span>
              </button>
            </div>
            {has && on && render(n.children!, depth + 1)}
          </li>
        )
      })}
    </ul>
  )
  return <nav>{render(nodes, 0)}</nav>
}

/* Carousel --------------------------------------------------------------- */
export function Carousel({ slides }: { slides: ReactNode[] }) {
  const [i, setI] = useState(0)
  const go = (n: number) => setI((n + slides.length) % slides.length)
  return (
    <div className="relative overflow-hidden rounded-[6px] border border-line" aria-roledescription="carousel">
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, k) => <div key={k} className="w-full shrink-0" aria-hidden={k !== i}>{s}</div>)}
      </div>
      <div className="flex items-center justify-between border-t border-line bg-white px-3 py-2">
        <div className="flex gap-1.5">
          {slides.map((_, k) => <button key={k} onClick={() => go(k)} aria-label={`Slide ${k + 1}`} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-6 bg-ink' : 'w-1.5 bg-[#d6d6d6] hover:bg-muted'}`} />)}
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-2 text-[12px] tabular-nums text-muted">{i + 1} / {slides.length}</span>
          <button onClick={() => go(i - 1)} aria-label="Previous" className="grid h-7 w-7 place-items-center rounded-[4px] border border-line hover:bg-[#fafafa]"><Icon name="chevron-left" size={16} /></button>
          <button onClick={() => go(i + 1)} aria-label="Next" className="grid h-7 w-7 place-items-center rounded-[4px] border border-line hover:bg-[#fafafa]"><Icon name="chevron-right" size={16} /></button>
        </div>
      </div>
    </div>
  )
}

/* Timeline --------------------------------------------------------------- */
export type TimelineItem = { title: string; date: string; body?: string; status: 'done' | 'current' | 'upcoming' | 'error' }
function Dot({ s }: { s: TimelineItem['status'] }) {
  if (s === 'done') return <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-white"><Icon name="check" size={12} strokeWidth={2.5} /></span>
  if (s === 'current') return <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-accent bg-white"><span className="h-2 w-2 rounded-full bg-accent" /></span>
  if (s === 'error') return <span className="grid h-5 w-5 place-items-center rounded-full border-[1.5px] border-danger bg-white text-[11px] font-bold text-danger">!</span>
  return <span className="h-5 w-5 rounded-full border-[1.5px] border-[#d0d0d0] bg-white" />
}
export function Timeline({ items, orientation = 'vertical' }: { items: TimelineItem[]; orientation?: 'vertical' | 'horizontal' }) {
  if (orientation === 'horizontal')
    return (
      <ol className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((it, i) => (
          <li key={i} className="relative pr-4">
            <div className="flex items-center">
              <Dot s={it.status} />
              {i < items.length - 1 && <span className={`ml-2 h-px flex-1 ${it.status === 'done' ? 'bg-ink' : 'bg-line'}`} />}
            </div>
            <p className="mt-3 text-[11px] tabular-nums text-muted">{it.date}</p>
            <p className={`mt-0.5 text-[13px] font-medium ${it.status === 'upcoming' ? 'text-muted' : 'text-ink'}`}>{it.title}</p>
            {it.body && <p className="mt-1 text-[12px] leading-[18px] text-muted">{it.body}</p>}
          </li>
        ))}
      </ol>
    )
  return (
    <ol>
      {items.map((it, i) => (
        <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
          {i < items.length - 1 && <span className={`absolute left-[9.5px] top-6 bottom-1 w-px ${it.status === 'done' ? 'bg-ink' : 'bg-line'}`} />}
          <Dot s={it.status} />
          <div className="-mt-0.5 min-w-0">
            <p className={`text-[13px] font-medium ${it.status === 'upcoming' ? 'text-muted' : 'text-ink'}`}>{it.title} <span className="ml-2 text-[11px] font-normal tabular-nums text-muted">{it.date}</span></p>
            {it.body && <p className="mt-1 text-[12px] leading-[18px] text-muted">{it.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
