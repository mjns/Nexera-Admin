export const CATEGORIES = ['Antenna', 'Switch', 'Router', 'Digital device', 'Computer', 'Base station', 'Power unit']
export const SITES = ['Budapest', 'Vienna', 'Berlin', 'Munich', 'Prague', 'Warsaw', 'Paris', 'Lyon', 'Madrid', 'Barcelona', 'Milan', 'Rome', 'Amsterdam', 'Stockholm', 'Copenhagen']
export const GRANULARITY = ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Quarterly']

export type Device = { inv: string; serial: string; name: string; type: string; category: string; site: string; since: string; util: number; notes: string }

export const DEVICES: Device[] = [
  { inv: 'NX-INV-000123', serial: 'SN-4G7K-22931', name: 'Macro BTS North Ridge', type: 'NXB-6630', category: 'Base station', site: 'Budapest', since: '2021-03-14', util: 78, notes: 'Firmware 22.4 installed; scheduled fan replacement in Q2.' },
  { inv: 'NX-INV-000147', serial: 'SN-8RT2-10448', name: 'Core Router Lab A', type: 'NXR-9000', category: 'Router', site: 'Vienna', since: '2020-11-02', util: 64, notes: 'Shared with integration team; reserve via TE calendar.' },
  { inv: 'NX-INV-000162', serial: 'SN-2PA9-77310', name: 'Sector Antenna 3.5 GHz', type: 'NXA-M64', category: 'Antenna', site: 'Berlin', since: '2022-06-21', util: 41, notes: 'Massive MIMO panel, tilt recalibrated Jan 2026.' },
  { inv: 'NX-INV-000188', serial: 'SN-5LQ1-30027', name: 'Aggregation Switch 48P', type: 'NXS-4800', category: 'Switch', site: 'Munich', since: '2019-09-09', util: 87, notes: 'Near capacity; uplink expansion requested.' },
  { inv: 'NX-INV-000204', serial: 'SN-7HC4-51862', name: 'DC Rectifier Shelf', type: 'NXP-R48', category: 'Power unit', site: 'Prague', since: '2018-04-30', util: 52, notes: 'Battery string B replaced 2025-10.' },
  { inv: 'NX-INV-000219', serial: 'SN-1ZX8-62094', name: 'Signal Analyzer SA-2', type: 'NXD-SA26', category: 'Digital device', site: 'Warsaw', since: '2023-01-17', util: 33, notes: 'Calibration due March 2026.' },
  { inv: 'NX-INV-000231', serial: 'SN-9MB3-48821', name: 'Build Server Orion', type: 'NXC-R740', category: 'Computer', site: 'Paris', since: '2021-08-05', util: 91, notes: 'CI runners; nightly builds keep load high.' },
  { inv: 'NX-INV-000246', serial: 'SN-3DW6-11735', name: 'Small Cell Gare Part-Dieu', type: 'NXB-SC20', category: 'Base station', site: 'Lyon', since: '2022-12-01', util: 58, notes: 'Indoor coverage pilot.' },
  { inv: 'NX-INV-000258', serial: 'SN-6KF2-90413', name: 'Edge Router Madrid-2', type: 'NXR-4400', category: 'Router', site: 'Madrid', since: '2020-02-26', util: 47, notes: '—' },
  { inv: 'NX-INV-000273', serial: 'SN-4VN7-25586', name: 'Microwave Dish 18 GHz', type: 'NXA-MW18', category: 'Antenna', site: 'Barcelona', since: '2019-05-13', util: 22, notes: 'Backup link only; low traffic expected.' },
  { inv: 'NX-INV-000289', serial: 'SN-8JS5-37149', name: 'Access Switch Floor 4', type: 'NXS-2400', category: 'Switch', site: 'Amsterdam', since: '2023-07-19', util: 69, notes: 'PoE budget 80% used.' },
  { inv: 'NX-INV-000301', serial: 'SN-2QE9-84260', name: 'Test Workstation TW-11', type: 'NXC-T560', category: 'Computer', site: 'Stockholm', since: '2024-02-08', util: 38, notes: 'Assigned to RF test team.' },
]

export type CellState = 'used' | 'standby' | 'error' | 'idle'
export type Cell = { state: CellState; value: number }
export type Day = { date: string; avg: number; hours: Cell[] }

// Deterministic PRNG for stable sample data
function rng(seed: number) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647) }

export function buildDays(from = '2026-02-01', to = '2026-02-28'): Day[] {
  const r = rng(42)
  const days: Day[] = []
  const end = new Date(to + 'T00:00:00Z')
  for (let d = new Date(from + 'T00:00:00Z'); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay()
    const weekend = dow === 0 || dow === 6
    const hours: Cell[] = Array.from({ length: 24 }, (_, h) => {
      const x = r()
      if (x < 0.015) return { state: 'error', value: 0 }
      const work = h >= 8 && h <= 18
      if (work && !weekend) {
        if (x < 0.06) return { state: 'standby', value: 0 }
        const peak = 1 - Math.abs(h - 13) / 7
        return { state: 'used', value: Math.round(Math.min(99, 35 + peak * 45 + r() * 22)) }
      }
      if (weekend && work) return x < 0.35 ? { state: 'used', value: Math.round(10 + r() * 30) } : x < 0.75 ? { state: 'standby', value: 0 } : { state: 'idle', value: 0 }
      if (h >= 1 && h <= 4 && x < 0.25) return { state: 'idle', value: 0 }
      if (x < 0.12) return { state: 'used', value: Math.round(5 + r() * 20) }
      return { state: 'standby', value: 0 }
    })
    const avg = Math.round(hours.reduce((s, c) => s + c.value, 0) / 24)
    days.push({ date: d.toISOString().slice(0, 10), avg, hours })
  }
  return days
}

export function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00Z')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}
