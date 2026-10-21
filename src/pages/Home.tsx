import { APPS, type AppId } from '../apps'
import { AppCard } from '../components/AppCard'

export function Home({ onOpen }: { onOpen: (id: AppId) => void }) {
  return (
    <main className="mx-auto max-w-[1120px] px-8 pb-24 pt-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Internal workspace</p>
      <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.01em] text-ink">Welcome to Nexera Admin</h1>
      <p className="mt-3 max-w-[600px] text-[14px] leading-6 text-body">
        This is Nexera's internal workspace for managing the work we perform and the equipment we own — from consumables and
        tool allocation to test environments and device utilization across all our sites. Choose an app below to get started.
      </p>
      <div className="mt-12 grid grid-cols-3 gap-6">
        {APPS.map((a) => <AppCard key={a.id} app={a} onOpen={() => onOpen(a.id)} />)}
      </div>
    </main>
  )
}
