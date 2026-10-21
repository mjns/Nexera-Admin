import { useMemo, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, SortIcon } from './icons'
import { SearchBar } from './patterns'

export type Column<T> = { id?: string; key: keyof T & string; header: string; width?: string; align?: 'left' | 'right'; render?: (row: T) => ReactNode; sortable?: boolean }

export function DataTable<T extends Record<string, unknown>>({ columns, rows, rowKey, onRowClick, pageSize = 10, trailing, searchable, title, actions }: {
  columns: Column<T>[]; rows: T[]; rowKey: (r: T) => string; onRowClick?: (r: T) => void; pageSize?: number; trailing?: (r: T) => ReactNode; searchable?: boolean; title?: ReactNode; actions?: ReactNode
}) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null)
  const [page, setPage] = useState(0)
  const [q, setQ] = useState('')
  const filtered = useMemo(() => (q ? rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q.toLowerCase()))) : rows), [rows, q])
  const sorted = useMemo(() => {
    if (!sort) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[sort.key] as string | number, bv = b[sort.key] as string | number
      const c = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))
      return sort.dir === 'asc' ? c : -c
    })
  }, [filtered, sort])
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const view = sorted.slice(page * pageSize, page * pageSize + pageSize)
  const toggle = (k: string) => setSort((s) => (s?.key !== k ? { key: k, dir: 'asc' } : s.dir === 'asc' ? { key: k, dir: 'desc' } : null))

  return (
    <div className="overflow-hidden rounded-[6px] border border-line">
      {(searchable || title || actions) && (
        <div className="flex items-center gap-3 border-b border-line bg-white px-3 py-2.5">
          {title && <div className="mr-auto text-[13px] font-semibold text-ink">{title}</div>}
          {searchable && <div className="w-[260px]"><SearchBar size="sm" value={q} onChange={(v) => { setQ(v); setPage(0) }} placeholder="Search in table…" /></div>}
          {actions}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-line bg-[#fafafa]">
              {columns.map((c) => (
                <th key={c.id ?? c.key} style={{ width: c.width }} className={`h-10 whitespace-nowrap px-3 font-medium text-muted ${c.align === 'right' ? 'text-right' : 'text-left'}`}>
                  {c.sortable === false ? c.header : (
                    <button onClick={() => toggle(c.key)} className={`inline-flex items-center gap-1 hover:text-ink ${sort?.key === c.key ? 'text-ink' : ''}`}>
                      {c.header}<SortIcon dir={sort?.key === c.key ? sort.dir : null} />
                    </button>
                  )}
                </th>
              ))}
              {trailing && <th className="w-16" />}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={rowKey(r)} onClick={() => onRowClick?.(r)} className="group h-12 cursor-pointer border-b border-line last:border-0 hover:bg-blue-tint/60">
                {columns.map((c) => (
                  <td key={c.id ?? c.key} className={`whitespace-nowrap px-3 text-body ${c.align === 'right' ? 'text-right' : ''}`}>{c.render ? c.render(r) : String(r[c.key])}</td>
                ))}
                {trailing && <td className="px-3 text-right">{trailing(r)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex h-11 items-center justify-between border-t border-line bg-white px-3 text-[12px] text-muted">
        <span>Showing {sorted.length ? page * pageSize + 1 : 0}–{Math.min(sorted.length, (page + 1) * pageSize)} of {sorted.length}</span>
        <div className="flex items-center gap-1">
          <PageBtn disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft /></PageBtn>
          {Array.from({ length: pages }, (_, i) => (
            <PageBtn key={i} active={i === page} onClick={() => setPage(i)}>{i + 1}</PageBtn>
          ))}
          <PageBtn disabled={page >= pages - 1} onClick={() => setPage(page + 1)}><ChevronRight /></PageBtn>
        </div>
      </div>
    </div>
  )
}

function PageBtn({ active, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return <button {...p} className={`grid h-7 min-w-7 place-items-center rounded-[4px] px-1.5 text-[12px] disabled:opacity-30 ${active ? 'bg-ink font-medium text-white' : 'text-body hover:bg-[#f2f2f2]'}`} />
}
