# CertiByt Frontend Upgrade — Design Spec

**Date:** 2026-06-25  
**Scope:** Full frontend modernization — architecture, stack, and visual polish  
**Approach:** Big Bang Rewrite (single clean pass, no incremental migration)

---

## Goals

1. Replace monolithic `App.jsx` + raw HTML injection with proper React component tree
2. Migrate stack to TypeScript + Tailwind v3 + shadcn/ui + Wouter
3. Preserve all existing scroll animations and page sections exactly
4. Improve polish, spacing, and typography while keeping light theme + navy/gold brand

## Non-Goals

- Backend / API work
- Routing beyond a single page route
- New sections or content changes
- Visual identity change (light theme, navy + warm gold stays)

---

## Stack

| Concern | Before | After |
|---------|--------|-------|
| Language | JavaScript (JSX) | TypeScript (TSX) |
| Styles | Plain CSS (`certibyte.css`) | Tailwind v3 + CSS vars |
| Components | None | shadcn/ui (Button, Input) |
| Routing | None | Wouter (single route, ready for future) |
| Markup | `certibyte.html` via `dangerouslySetInnerHTML` | TSX components |
| Linting | Oxlint | Oxlint (unchanged) |
| Bundler | Vite 8 | Vite 8 (unchanged) |
| Runtime | React 19 | React 19 (unchanged) |

**Fonts:** Plus Jakarta Sans + Playfair Display — kept, loaded via `index.html` Google Fonts link.

**Tailwind palette extension:**
```js
// tailwind.config.js
colors: {
  navy: { DEFAULT: '#1e3a8a', dark: '#0f172a', light: '#3b5fd4' },
  gold: { DEFAULT: '#b45309', light: '#d97706', subtle: 'rgba(180,83,9,0.08)' },
}
```

---

## File Structure

```
frontend/src/
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── TrustedBy.tsx
│   ├── FeaturesCarousel.tsx
│   ├── Workflow.tsx
│   ├── VerificationDemo.tsx
│   ├── OrgHub.tsx
│   ├── Testimonials.tsx
│   ├── CTA.tsx
│   └── Footer.tsx
├── hooks/
│   ├── useScrollReveal.ts
│   ├── useHeroRotation.ts
│   ├── useCarousel.ts
│   ├── useFallingSections.ts
│   └── useNavScroll.ts
├── lib/
│   └── utils.ts              ← cn() helper (shadcn standard)
├── App.tsx                   ← assembles sections, no logic
├── main.tsx
└── index.css                 ← Tailwind directives + keyframe animations
```

**Deleted:**
- `src/certibyte.html`
- `src/certibyte.css`

---

## Hooks Design

All hooks return values/state only. Zero direct DOM mutation inside hooks. Components own their DOM.

### `useScrollReveal(ref)`
- `IntersectionObserver` on `ref` (threshold 0.1, rootMargin `0px 0px -50px 0px`)
- On intersect: returns `isVisible: boolean` → component applies reveal class
- Also triggers counter animation for any `[data-counter]` elements inside ref
- Each component calls this on its own ref

### `useHeroRotation(states[])`
- Accepts array of 4 state objects as config
- Returns `{ currentState, isShifting }` 
- `setInterval` at 2600ms, cleared on unmount
- `isShifting` true for 360ms during transition → component applies shift CSS class

### `useCarousel(sectionRef, trackRef)`
- `scroll` + `resize` event listeners
- Returns `{ progress: number }` (0–1)
- Component drives `translateX` on track and progress bar `width` from progress
- Guard: ≤768px → returns `progress: 0` (mobile shows stacked layout)

### `useFallingSections(refs[])`
- `scroll` + `resize` event listeners
- Returns `styles: CSSProperties[]` — one per section
- Each style has `transform`, `opacity`, `filter`
- Guard: <992px → all styles return empty object (mobile shows normal flow)

### `useNavScroll()`
- `scroll` listener, threshold 50px
- Returns `{ scrolled: boolean }`

---

## Components

### `Navbar`
- Fixed, `backdrop-blur`, border-bottom
- `useNavScroll()` → adds shadow/bg on scroll
- Mobile toggle via `useState<boolean>`
- Links: Platform Overview, How It Works, Exam Store, Verify Certificate
- Actions: Login (ghost), Register (outline) — shadcn `Button` variants

### `Hero`
- Two-column grid (left: copy, right: card)
- Left: H1 (Playfair Display italic), subtitle, two CTAs
- Right: cert card driven by `useHeroRotation()` return value — no `data-*` DOM attributes, pure props
- Decorative SVG arcs + `✦` star as inline JSX
- `useScrollReveal()` on left column and right card independently

### `TrustedBy`
- Static logo list, `useScrollReveal()`, no logic

### `FeaturesCarousel`
- `position: sticky` wrapper, horizontal track
- `useCarousel()` → `style={{ transform: \`translateX(\${-progress * maxTranslate}px)\` }}`
- Progress bar width from `progress`
- Desktop only — mobile: normal vertical stack

### `Workflow`
- Array of step objects (title, description, icon) rendered in a loop
- `useFallingSections()` returns `styles[]` — each step renders `<section style={styles[i]}>`
- Desktop only parallax, mobile: normal flow

### `VerificationDemo`
- `useState` for `inputValue` + `result: { valid: boolean } | null`
- Valid ID constant: `CB_VALID_ID = 'CB-QN-714X99'`
- shadcn `Input` + `Button`
- No network call — pure client-side demo

### `OrgHub`
- Static preview card, scroll reveal only

### `Testimonials`
- Static `TESTIMONIALS` array → mapped to cards
- Scroll reveal

### `CTA`
- Static section, shadcn `Button` primary

### `Footer`
- Static links, logo, tagline

---

## Styling Approach

- Tailwind utility classes for all layout, spacing, color, typography
- Complex keyframe animations that Tailwind cannot express stay in `index.css`:
  - Hero card shift animation (`is-shifting`)
  - Section reveal transitions (`.rv` → `.vis`)
  - Falling section parallax transitions
- `cn()` from `lib/utils.ts` for conditional class merging
- No inline `style={{}}` props except for scroll-driven values (carousel transform, falling section styles) which are computed at runtime and cannot be expressed as static classes

---

## Migration Checklist

- [ ] Install new deps: TypeScript, Tailwind, postcss, shadcn/ui, wouter, clsx, tailwind-merge
- [ ] Configure: tsconfig.json, tailwind.config.js, postcss.config.js, components.json (shadcn)
- [ ] Init shadcn/ui with navy/gold theme
- [ ] Write all 5 hooks
- [ ] Write all 10 components
- [ ] Assemble in App.tsx
- [ ] Port keyframe animations to index.css
- [ ] Delete certibyte.html, certibyte.css
- [ ] Rename main.jsx → main.tsx, App.jsx → App.tsx
- [ ] Verify scroll animations work in dev server
- [ ] Run lint + tsc --noEmit
