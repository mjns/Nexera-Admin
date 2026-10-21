# Nexera Admin

Internal admin interface for Nexera: a suite of apps (Consumable Management, Allocation Management, Test Environment Management, Master Data, Utilization, Preferences) under one shared shell.

The first version covers the **Home page** and the **Utilization** app (device search and device detail with a daily line chart and an hourly heatmap). It uses sample data from `src/data.ts`; there is no backend yet.

The UI and design system were generated in [Figma Make](https://www.figma.com/make/xf5jEO8qOGVc72RFEYLLmb/Admin-Web-Application-Design) and imported here as the starting point.

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4. Font: Inter.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check and production build
```

## Live preview

Every push to `main` is built and published to GitHub Pages: https://mjns.github.io/Nexera-Admin/

Opening `index.html` directly from disk shows a blank page; use `npm run dev` or the Pages link.

## Structure

- `src/index.css` – design tokens (colors, font) as Tailwind theme variables
- `src/components/` – shell (Header, AppBar, App switcher) and reusable components
- `src/pages/` – Home, UtilizationSearch, DeviceDetail, DesignSystem (living style guide)
- `src/apps.tsx` – the list of apps shown on Home and in the switcher
- `src/data.ts` – sample devices, sites, categories and generated hourly utilization

The floating bar at the bottom of the page (`DemoBar` in `src/App.tsx`) is a demo helper from Figma Make for jumping between screens; remove it once real routing is in place.
