import type { ReactNode } from 'react'
import { ChevronRight, FilterIcon } from './icons'

export function SidePanel({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  if (!open)
    return (
      <button onClick={onToggle} aria-label={`Open ${title}`} className="flex w-10 shrink-0 flex-col items-center gap-3 border-l border-line bg-blue-tint pt-6 text-[12px] font-medium text-ink hover:bg-[#e4eaf0]">
        <FilterIcon />
        <span style={{ writingMode: 'vertical-rl' }} className="tracking-[0.06em]">{title}</span>
      </button>
    )
  return (
    <aside className="w-[280px] shrink-0 border-l border-line bg-blue-tint">
      <div className="flex h-14 items-center justify-between px-6">
        <h2 className="flex items-center gap-2 text-[14px] font-semibold text-ink"><FilterIcon />{title}</h2>
        <button onClick={onToggle} aria-label={`Collapse ${title}`} className="grid h-7 w-7 place-items-center rounded-[4px] text-body hover:bg-white"><ChevronRight /></button>
      </div>
      <div className="px-6 pb-6">{children}</div>
    </aside>
  )
}
