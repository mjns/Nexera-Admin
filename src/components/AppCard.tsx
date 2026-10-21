import type { AppDef } from '../apps'
import { Tag } from './ui'

export function AppCard({ app, onOpen }: { app: AppDef; onOpen: () => void }) {
  const Icon = app.icon
  const on = app.available
  return (
    <button
      disabled={!on}
      onClick={onOpen}
      className={`group relative flex h-[208px] flex-col overflow-hidden rounded-[6px] border border-line bg-white p-6 text-left transition-all duration-200 ${on ? 'hover:-translate-y-0.5 hover:border-[#d6d6d6] hover:shadow-[0_4px_16px_rgba(17,17,17,0.05)]' : 'cursor-not-allowed'}`}
    >
      <span className={`absolute inset-x-0 top-0 h-[3px] bg-accent transition-opacity ${on ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`} />
      <div className={`flex flex-1 flex-col ${on ? '' : 'opacity-45'}`}>
        <div className="flex items-start justify-between">
          <span className={`grid h-10 w-10 place-items-center rounded-[6px] ${on ? 'bg-accent-soft text-ink' : 'bg-[#f4f4f4] text-body'}`}><Icon width={22} height={22} /></span>
          {!on && <Tag>Coming soon</Tag>}
        </div>
        <h3 className="mt-5 text-[16px] font-semibold text-ink">{app.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-muted">{app.description}</p>
        <span className={`mt-auto pt-4 text-[13px] font-medium ${on ? 'text-ink' : 'text-muted'}`}>
          Open <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </button>
  )
}
