import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { ChevronDown } from './icons'

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { full?: boolean }

export function PrimaryButton({ full, className = '', ...p }: BtnProps) {
  return <button {...p} className={`inline-flex h-9 items-center justify-center gap-2 rounded-[5px] bg-accent px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-[#f5b800] active:bg-[#e6ad00] disabled:opacity-50 ${full ? 'w-full' : ''} ${className}`} />
}

export function SecondaryButton({ full, className = '', ...p }: BtnProps) {
  return <button {...p} className={`inline-flex h-9 items-center justify-center gap-2 rounded-[5px] border border-line bg-white px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-[#cfcfcf] hover:bg-[#fafafa] ${full ? 'w-full' : ''} ${className}`} />
}

export function TextLink({ className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className={`text-[13px] text-body underline-offset-4 hover:text-ink hover:underline ${className}`} />
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-body">{label}</span>
      {children}
    </label>
  )
}

const control = 'h-9 w-full rounded-[5px] border border-line bg-white px-3 text-[13px] outline-none transition-colors placeholder:text-muted hover:border-[#cfcfcf] focus:border-accent focus:ring-2 focus:ring-accent/40'

export function TextInput(p: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`${control} ${p.className ?? ''}`} />
}

export function SelectInput({ options, placeholder, ...p }: SelectHTMLAttributes<HTMLSelectElement> & { options: string[]; placeholder?: string }) {
  return (
    <div className="relative">
      <select {...p} className={`${control} appearance-none pr-8 ${!p.value ? 'text-muted' : ''}`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  )
}

export function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{title}</legend>
      {children}
    </fieldset>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-5 items-center rounded-[4px] border border-line bg-[#f6f6f6] px-1.5 text-[11px] font-medium text-muted">{children}</span>
}
