import { useEffect, type ReactNode } from 'react'
import { APPS, type AppId } from '../apps'
import { CloseIcon, MenuIcon } from './icons'
import { Tag } from './ui'

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative block h-4 w-4">
        <span className="absolute inset-0 rotate-45 rounded-[2px] bg-accent" />
      </span>
      <span className="text-[14px] font-bold tracking-[0.18em] text-ink">NEXERA</span>
    </div>
  )
}

export function Header({ user, onLogin, onLogout, onHome }: { user: string | null; onLogin: () => void; onLogout: () => void; onHome: () => void }) {
  const initials = user?.split(' ').map((s) => s[0]).join('').slice(0, 2)
  return (
    <header className="flex h-12 items-center justify-between bg-white px-8">
      <button onClick={onHome} aria-label="Nexera Admin home"><Logo /></button>
      <div className="flex items-center gap-4 text-[13px]">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-tint text-[11px] font-semibold text-ink">{initials}</span>
              <span className="text-ink">{user}</span>
            </div>
            <span className="h-4 w-px bg-line" />
            <button onClick={onLogout} className="text-body hover:text-ink hover:underline underline-offset-4">Log out</button>
          </>
        ) : (
          <button onClick={onLogin} className="font-medium text-ink hover:underline underline-offset-4">Log in</button>
        )}
      </div>
    </header>
  )
}

export type Crumb = { label: string; onClick?: () => void }

export function AppBar({ title, crumbs, right, onOpenApps, className = '' }: { title: string; crumbs?: Crumb[]; right?: ReactNode; onOpenApps: () => void; className?: string }) {
  return (
    <div className={`flex h-11 items-center justify-between border-y border-line bg-[#f7f7f7] px-8 ${className}`}>
      <nav className="flex min-w-0 items-center gap-2 text-[13px]" aria-label="Breadcrumb">
        {crumbs && crumbs.length ? (
          crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-[#c4c4c4]">/</span>}
              {c.onClick ? (
                <button onClick={c.onClick} className={`${i === 0 ? 'font-semibold text-ink' : 'text-muted'} hover:text-ink`}>{c.label}</button>
              ) : (
                <span className={i === crumbs.length - 1 ? 'font-medium text-ink' : 'text-muted'}>{c.label}</span>
              )}
            </span>
          ))
        ) : (
          <h1 className="font-semibold text-ink">{title}</h1>
        )}
      </nav>
      <div className="flex items-center gap-6">
        {right}
        <button onClick={onOpenApps} className="flex h-8 items-center gap-2 rounded-[5px] px-2 text-[13px] font-medium text-ink hover:bg-[#ececec]">
          <MenuIcon width={18} height={18} /> Apps
        </button>
      </div>
    </div>
  )
}

export function AppSwitcher({ open, current, onClose, onSelect }: { open: boolean; current: AppId | null; onClose: () => void; onSelect: (id: AppId) => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="animate-fade-in absolute inset-0 bg-ink/20" onClick={onClose} />
      <aside className="animate-slide-in absolute right-0 top-0 flex h-full w-[380px] flex-col border-l border-line bg-white" role="dialog" aria-label="Apps">
        <div className="flex h-[92px] items-end justify-between border-b border-line px-6 pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Nexera Admin</p>
            <h2 className="mt-1 text-[20px] font-semibold text-ink">Apps</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-[5px] text-body hover:bg-[#f5f5f5]"><CloseIcon width={18} height={18} /></button>
        </div>
        <ul className="flex-1 overflow-y-auto py-2">
          {APPS.map((a) => {
            const active = a.id === current
            const Icon = a.icon
            return (
              <li key={a.id}>
                <button
                  disabled={!a.available}
                  onClick={() => onSelect(a.id)}
                  className={`flex w-full items-start gap-4 border-l-[3px] px-6 py-4 text-left transition-colors ${active ? 'border-accent bg-[#fafafa]' : 'border-transparent'} ${a.available ? 'hover:bg-[#fafafa]' : 'cursor-not-allowed opacity-50'}`}
                >
                  <Icon className="mt-0.5 shrink-0 text-ink" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-ink">{a.name}</span>
                      {!a.available && <Tag>Coming soon</Tag>}
                    </span>
                    <span className="mt-1 block text-[12px] leading-[18px] text-muted">{a.description}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="border-t border-line px-6 py-4 text-[12px] text-muted">Nexera Admin · v0.1</div>
      </aside>
    </div>
  )
}
