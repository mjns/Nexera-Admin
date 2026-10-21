import type { SVGProps } from 'react'

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...p,
})
type P = SVGProps<SVGSVGElement>
export const MenuIcon = (p: P) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
export const CloseIcon = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>
export const BoxIcon = (p: P) => <svg {...base(p)}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></svg>
export const ShareIcon = (p: P) => <svg {...base(p)}><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" /></svg>
export const FlaskIcon = (p: P) => <svg {...base(p)}><path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 006 21h12a1.7 1.7 0 001.5-2.5L14 9V3" /><path d="M7 15h10" /></svg>
export const DatabaseIcon = (p: P) => <svg {...base(p)}><ellipse cx="12" cy="5.5" rx="7" ry="2.5" /><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" /></svg>
export const GaugeIcon = (p: P) => <svg {...base(p)}><path d="M3 15a9 9 0 0118 0" /><path d="M12 15l4-5" /><circle cx="12" cy="15" r="1.2" /><path d="M3 19h18" /></svg>
export const SettingsIcon = (p: P) => <svg {...base(p)}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg>
export const ChevronDown = (p: P) => <svg {...base({ width: 16, height: 16, ...p })}><path d="M6 9l6 6 6-6" /></svg>
export const ChevronLeft = (p: P) => <svg {...base({ width: 16, height: 16, ...p })}><path d="M15 6l-6 6 6 6" /></svg>
export const ChevronRight = (p: P) => <svg {...base({ width: 16, height: 16, ...p })}><path d="M9 6l6 6-6 6" /></svg>
export const SortIcon = ({ dir, ...p }: P & { dir?: 'asc' | 'desc' | null }) => (
  <svg {...base({ width: 12, height: 12, strokeWidth: 2, ...p })}>
    <path d="M8 10l4-4 4 4" opacity={dir === 'asc' ? 1 : 0.3} />
    <path d="M8 14l4 4 4-4" opacity={dir === 'desc' ? 1 : 0.3} />
  </svg>
)
export const DownloadIcon = (p: P) => <svg {...base({ width: 16, height: 16, ...p })}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
export const FilterIcon = (p: P) => <svg {...base({ width: 16, height: 16, ...p })}><path d="M4 5h16l-6 8v5l-4 2v-7L4 5z" /></svg>
export const SearchIcon = (p: P) => <svg {...base({ width: 28, height: 28, strokeWidth: 1.25, ...p })}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>
export const EyeIcon = (p: P) => <svg {...base({ width: 16, height: 16, ...p })}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
