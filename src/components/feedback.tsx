import type { ReactNode } from 'react'
import { Icon } from './icon-library'

/* Badge ------------------------------------------------------------------ */
export type Tone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'error'
const TONE: Record<Tone, string> = {
  neutral: 'bg-[#f2f2f2] text-body border-line',
  accent: 'bg-accent-soft text-ink border-[#ffe08a]',
  info: 'bg-[#eaf1fb] text-[#1f4e8c] border-[#cfdff3]',
  success: 'bg-[#e9f6ee] text-[#1d6b3a] border-[#cbe8d6]',
  warning: 'bg-[#fff1e3] text-[#9a4a00] border-[#fbd9b6]',
  error: 'bg-[#fcebea] text-[#9b1c1c] border-[#f3cfcc]',
}
export function Badge({ tone = 'neutral', dot, children }: { tone?: Tone; dot?: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex h-5 items-center gap-1.5 rounded-[4px] border px-1.5 text-[11px] font-medium ${TONE[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}{children}
    </span>
  )
}
export function CountBadge({ n }: { n: number }) {
  return <span className="inline-grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white">{n > 99 ? '99+' : n}</span>
}

/* Loader ----------------------------------------------------------------- */
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin" role="status" aria-label="Loading">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#E5E5E5" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 00-9-9" fill="none" stroke="#FFC629" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
export function DotsLoader() {
  return (
    <span className="inline-flex items-center gap-1" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink" style={{ animationDelay: `${i * 120}ms` }} />)}
    </span>
  )
}
export function SignalLoader() {
  return (
    <span className="inline-flex h-5 items-end gap-[3px]" role="status" aria-label="Loading">
      {[0, 1, 2, 3].map((i) => <span key={i} className="nx-signal w-[3px] rounded-[1px] bg-accent" style={{ height: `${(i + 1) * 25}%`, animationDelay: `${i * 150}ms` }} />)}
    </span>
  )
}
export function Skeleton({ className = '' }: { className?: string }) {
  return <span className={`nx-shimmer block rounded-[4px] ${className}`} />
}

/* Progress --------------------------------------------------------------- */
export function ProgressBar({ value, label, indeterminate, tone = 'accent' }: { value?: number; label?: string; indeterminate?: boolean; tone?: 'accent' | 'ink' | 'success' | 'error' }) {
  const c = { accent: 'bg-accent', ink: 'bg-ink', success: 'bg-[#2e8b57]', error: 'bg-danger' }[tone]
  return (
    <div>
      {label && <div className="mb-1.5 flex justify-between text-[12px]"><span className="text-body">{label}</span>{!indeterminate && <span className="tabular-nums text-ink">{value}%</span>}</div>}
      <div className="relative h-1.5 overflow-hidden rounded-full bg-[#efefef]" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        {indeterminate ? <span className={`nx-indeterminate absolute inset-y-0 w-1/3 rounded-full ${c}`} /> : <span className={`block h-full rounded-full transition-[width] duration-500 ${c}`} style={{ width: `${value}%` }} />}
      </div>
    </div>
  )
}

/* Notification bar (sits directly under the AppBar) ---------------------- */
export type NoticeTone = 'info' | 'success' | 'warning' | 'error'
const NOTICE: Record<NoticeTone, { bar: string; icon: string; name: string }> = {
  info: { bar: 'bg-[#eaf1fb] border-[#cfdff3] text-[#1f4e8c]', icon: 'info', name: 'Information' },
  success: { bar: 'bg-[#e9f6ee] border-[#cbe8d6] text-[#1d6b3a]', icon: 'success', name: 'Success' },
  warning: { bar: 'bg-[#fff1e3] border-[#fbd9b6] text-[#9a4a00]', icon: 'warning', name: 'Warning' },
  error: { bar: 'bg-[#fcebea] border-[#f3cfcc] text-[#9b1c1c]', icon: 'error', name: 'Error' },
}
export function Notification({ tone, title, children, action, onClose }: { tone: NoticeTone; title?: string; children: ReactNode; action?: ReactNode; onClose?: () => void }) {
  const t = NOTICE[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex min-h-10 items-center gap-3 border-b px-8 py-2 text-[13px] ${t.bar}`}>
      <Icon name={t.icon} size={18} />
      <p className="flex-1 text-ink"><span className="sr-only">{t.name}: </span>{title && <strong className="mr-1.5 font-semibold">{title}</strong>}{children}</p>
      {action}
      {onClose && <button onClick={onClose} aria-label="Dismiss" className="grid h-6 w-6 place-items-center rounded-[4px] hover:bg-black/5"><Icon name="close" size={14} /></button>}
    </div>
  )
}
