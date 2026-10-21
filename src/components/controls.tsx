import { useId, type ReactNode } from 'react'
import { Icon } from './icon-library'

export function Checkbox({ label, checked, indeterminate, disabled, onChange, description }: { label: ReactNode; checked: boolean; indeterminate?: boolean; disabled?: boolean; onChange?: (v: boolean) => void; description?: string }) {
  const on = checked || indeterminate
  return (
    <label className={`flex items-start gap-2.5 text-[13px] ${disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer'}`}>
      <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} />
      <span className={`mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent ${on ? 'border-ink bg-ink text-white' : 'border-[#c8c8c8] bg-white hover:border-body'}`}>
        {indeterminate ? <Icon name="minus" size={12} strokeWidth={2.5} /> : checked && <Icon name="check" size={12} strokeWidth={2.5} />}
      </span>
      <span><span className="text-ink">{label}</span>{description && <span className="block text-[12px] text-muted">{description}</span>}</span>
    </label>
  )
}

export function Radio({ label, checked, onChange, name }: { label: string; checked: boolean; onChange: () => void; name: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink">
      <input type="radio" name={name} className="peer sr-only" checked={checked} onChange={onChange} />
      <span className={`grid h-4 w-4 place-items-center rounded-full border peer-focus-visible:ring-2 peer-focus-visible:ring-accent ${checked ? 'border-ink' : 'border-[#c8c8c8]'}`}>{checked && <span className="h-2 w-2 rounded-full bg-ink" />}</span>
      {label}
    </label>
  )
}

export function Switch({ label, checked, onChange, disabled }: { label?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  const id = useId()
  return (
    <span className={`inline-flex items-center gap-2.5 text-[13px] ${disabled ? 'opacity-45' : ''}`}>
      <button id={id} role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-ink' : 'bg-[#d6d6d6]'} disabled:cursor-not-allowed`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${checked ? 'left-[18px] bg-accent' : 'left-0.5'}`} />
      </button>
      {label && <label htmlFor={id} className="cursor-pointer text-ink">{label}</label>}
    </span>
  )
}

export function Textarea(p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={`min-h-[88px] w-full rounded-[5px] border border-line bg-white px-3 py-2 text-[13px] text-ink outline-none placeholder:text-muted hover:border-[#cfcfcf] focus:border-accent focus:ring-2 focus:ring-accent/40 ${p.className ?? ''}`} />
}
