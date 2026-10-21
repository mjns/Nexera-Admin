import type { ComponentType, SVGProps } from 'react'
import { BoxIcon, DatabaseIcon, FlaskIcon, GaugeIcon, SettingsIcon, ShareIcon } from './components/icons'

export type AppId = 'consumables' | 'allocation' | 'testenv' | 'masterdata' | 'utilization' | 'preferences'
export type AppDef = { id: AppId; name: string; description: string; icon: ComponentType<SVGProps<SVGSVGElement>>; available: boolean }

export const APPS: AppDef[] = [
  { id: 'consumables', name: 'Consumable Management', description: "The company's consumables inventory system.", icon: BoxIcon, available: false },
  { id: 'allocation', name: 'Allocation Management', description: 'Manage the distribution of tools and assets.', icon: ShareIcon, available: false },
  { id: 'testenv', name: 'Test Environment Management', description: 'Manage test environments (TEs) and their parameters.', icon: FlaskIcon, available: false },
  { id: 'masterdata', name: 'Master Data', description: 'Organizations, financial sites and cost centers.', icon: DatabaseIcon, available: false },
  { id: 'utilization', name: 'Utilization', description: 'Measure the utilization of products, tools and assets.', icon: GaugeIcon, available: true },
  { id: 'preferences', name: 'Preferences', description: 'User settings and security.', icon: SettingsIcon, available: false },
]
