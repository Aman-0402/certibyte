# CertiByt — Agent Guide

## Project

React 19 + Vite 8 frontend for a voucher-based exam and certification platform. No backend in this repo — pure static frontend.

## Stack

- React 19 (JSX, no TypeScript)
- Vite 8
- Plain CSS (no Tailwind, no CSS-in-JS)
- Oxlint

## Repo Layout

```
certibyte/
├── AGENTS.md
├── README.md
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx          # React entry point
        ├── App.jsx           # Single component — all logic lives here
        ├── certibyte.html    # Raw page markup (imported as ?raw string)
        ├── certibyte.css     # All styles
        └── index.css         # Minimal root reset
```

## Architecture Notes

`App.jsx` imports `certibyte.html` as a raw string, strips `<script>` tags, and injects it via `dangerouslySetInnerHTML`. All browser interactions (scroll handlers, IntersectionObserver, carousel, hero state rotation, verification demo) run inside a single `useEffect` in `App.jsx`. Cleanup is returned from the effect.

No component split yet. `certibyte.html` owns all markup; `App.jsx` owns all behavior; `certibyte.css` owns all styles.

## Commands

Run from `frontend/`:

```bash
npm install
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # Production build → frontend/dist
npm run lint     # Oxlint
npm run preview  # Serve dist locally
```

## Key Behaviors

| Feature | Where |
|---------|-------|
| Hero lifecycle rotation (4 states, 2.6 s interval) | `App.jsx` `rotateHeroState` |
| Scroll-triggered reveal (`.rv` → `.vis`) | `App.jsx` `revealObserver` |
| Animated stat counters (`.stat-num`) | `App.jsx` `animateCounter` |
| Horizontal feature carousel (desktop only) | `App.jsx` `handleCarouselScroll` |
| Stacked falling-section parallax | `App.jsx` `handleFallingSectionsScroll` |
| Certificate verification demo | `App.jsx` `handleVerify` — valid ID: `CB-QN-714X99` |
| Mobile nav toggle | `App.jsx` `handleNavToggle` |

## Conventions

- CSS lives in `certibyte.css`. No inline `style` props.
- All DOM queries happen inside `useEffect` after markup mounts via `dangerouslySetInnerHTML`.
- No routing — single page.
- No state management library — `useMemo` for markup extraction, `useEffect` for side effects.
- Shell: PowerShell (Windows 11).

## Future Refactor (not done yet)

Split into dedicated components: `Navbar`, `Hero`, `FeatureCarousel`, `VerificationDemo`, `Workflow`, `Footer`. Not in scope unless explicitly requested.
