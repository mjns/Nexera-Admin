import { useState } from 'react'
import type { AppId } from './apps'
import { AppBar, AppSwitcher, Header } from './components/shell'
import { DEVICES, type Device } from './data'
import { Home } from './pages/Home'
import { DesignSystem } from './pages/DesignSystem'
import { DeviceDetail } from './pages/DeviceDetail'
import { EMPTY, UtilizationSearch, type Filters } from './pages/UtilizationSearch'

type Route = { page: 'home' } | { page: 'ds' } | { page: 'search' } | { page: 'detail'; device: Device }

export default function App() {
  const [user, setUser] = useState<string | null>('Anna Kovács')
  const [route, setRoute] = useState<Route>({ page: 'home' })
  const [apps, setApps] = useState(false)
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [panel, setPanel] = useState(true)

  const toSearch = () => setRoute({ page: 'search' })
  const current: AppId | null = route.page === 'home' || route.page === 'ds' ? null : 'utilization'

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} onLogin={() => setUser('Anna Kovács')} onLogout={() => setUser(null)} onHome={() => setRoute({ page: 'home' })} />
      {route.page === 'ds' && <AppBar title="Design System" onOpenApps={() => setApps(true)} />}
      {route.page === 'home' && <AppBar title="Nexera Admin" onOpenApps={() => setApps(true)} />}
      {route.page === 'search' && <AppBar title="Utilization" className="border-[rgba(229,229,229,0)]!" onOpenApps={() => setApps(true)} />}
      {route.page === 'detail' && (
        <AppBar title="Utilization" onOpenApps={() => setApps(true)}
          crumbs={[{ label: 'Utilization', onClick: toSearch }, { label: 'Device detail' }, { label: route.device.inv }]}
          right={<button onClick={toSearch} className="text-[13px] text-body hover:text-ink">← Back to results</button>} />
      )}

      {route.page === 'ds' && <DesignSystem />}
      {route.page === 'home' && <Home onOpen={(id) => id === 'utilization' && toSearch()} />}
      {route.page === 'search' && (
        <UtilizationSearch filters={filters} setFilters={setFilters} submitted={submitted} setSubmitted={setSubmitted}
          onView={(device) => { setSubmitted(true); setRoute({ page: 'detail', device }) }} />
      )}
      {route.page === 'detail' && <DeviceDetail key={route.device.inv} device={route.device} from={filters.from} to={filters.to} panelOpen={panel} setPanelOpen={setPanel} />}

      <AppSwitcher open={apps} current={current} onClose={() => setApps(false)}
        onSelect={(id) => { setApps(false); if (id === 'utilization') toSearch() }} />

      <DemoBar onPick={(k) => {
        if (k === 'home') setRoute({ page: 'home' })
        if (k === 'ds') setRoute({ page: 'ds' })
        if (k === 'empty') { setSubmitted(false); toSearch() }
        if (k === 'results') { setSubmitted(true); toSearch() }
        if (k === 'open') { setPanel(true); setRoute({ page: 'detail', device: DEVICES[0] }) }
        if (k === 'closed') { setPanel(false); setRoute({ page: 'detail', device: DEVICES[0] }) }
        if (k === 'apps') setApps(true)
        if (k === 'auth') setUser(user ? null : 'Anna Kovács')
      }} />
    </div>
  )
}

// Small floating navigator to jump between the deliverable states.
function DemoBar({ onPick }: { onPick: (k: string) => void }) {
  const items = [['home', 'Home'], ['empty', 'Search · empty'], ['results', 'Search · results'], ['open', 'Detail · panel open'], ['closed', 'Detail · collapsed'], ['apps', 'App switcher'], ['auth', 'Toggle login'], ['ds', 'Design system']]
  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-[6px] border border-line bg-white/95 p-1 text-[11px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur">
      {items.map(([k, l]) => <button key={k} onClick={() => onPick(k)} className="rounded-[4px] px-2.5 py-1.5 text-body hover:bg-[#f2f2f2] hover:text-ink">{l}</button>)}
    </div>
  )
}
