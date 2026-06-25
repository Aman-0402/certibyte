# CertiByt Frontend Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate CertiByt from a monolithic JSX + raw HTML injection app to a proper TypeScript + Tailwind v3 + shadcn/ui React component tree while preserving all scroll animations.

**Architecture:** Big Bang Rewrite — `certibyte.html` and `certibyte.css` are deleted; all markup moves into TSX components; all animation logic moves into 5 focused custom hooks. Falling sections (VerificationDemo, OrgHub, Testimonials, CTA) use forwarded refs so `App.tsx` can coordinate scroll-driven styles across them.

**Tech Stack:** React 19, TypeScript 5, Vite 8, Tailwind v3, shadcn/ui (Button + Input), Wouter, clsx, tailwind-merge, Oxlint

---

## File Map

**Create:**
`frontend/tsconfig.json` · `frontend/tsconfig.app.json` · `frontend/tsconfig.node.json` · `frontend/vite.config.ts` · `frontend/tailwind.config.js` · `frontend/postcss.config.js` · `frontend/src/index.css` (replace) · `frontend/src/lib/utils.ts` · `frontend/src/components/ui/button.tsx` · `frontend/src/components/ui/input.tsx` · `frontend/src/hooks/useNavScroll.ts` · `frontend/src/hooks/useScrollReveal.ts` · `frontend/src/hooks/useHeroRotation.ts` · `frontend/src/hooks/useCarousel.ts` · `frontend/src/hooks/useFallingSections.ts` · `frontend/src/components/Navbar.tsx` · `frontend/src/components/Hero.tsx` · `frontend/src/components/TrustedBy.tsx` · `frontend/src/components/FeaturesCarousel.tsx` · `frontend/src/components/Workflow.tsx` · `frontend/src/components/VerificationDemo.tsx` · `frontend/src/components/OrgHub.tsx` · `frontend/src/components/Testimonials.tsx` · `frontend/src/components/CTA.tsx` · `frontend/src/components/Footer.tsx` · `frontend/src/main.tsx` · `frontend/src/App.tsx`

**Modify:** `frontend/package.json` · `frontend/index.html`

**Delete (Task 18):** `frontend/src/certibyte.html` · `frontend/src/certibyte.css` · `frontend/src/App.jsx` · `frontend/src/main.jsx` · `frontend/vite.config.js`

---

## Task 1: Install dependencies + TypeScript config

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/tsconfig.json`, `frontend/tsconfig.app.json`, `frontend/tsconfig.node.json`

- [ ] **Step 1: Install new dependencies**

Run from `frontend/`:
```bash
npm install wouter
npm install --save-dev typescript tailwindcss@3 postcss autoprefixer clsx tailwind-merge @radix-ui/react-slot class-variance-authority lucide-react @types/node
```

Expected: packages appear in `node_modules/`, no errors.

- [ ] **Step 2: Create `frontend/tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 3: Create `frontend/tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `frontend/tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json
git commit -m "chore: install typescript, tailwind, shadcn deps"
```

---

## Task 2: Vite + Tailwind + PostCSS config

**Files:**
- Create: `frontend/vite.config.ts`, `frontend/tailwind.config.js`, `frontend/postcss.config.js`

- [ ] **Step 1: Create `frontend/vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 2: Create `frontend/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1e3a8a',
          dark: '#0f172a',
          light: '#3b5fd4',
        },
        gold: {
          DEFAULT: '#b45309',
          light: '#d97706',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Create `frontend/postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/vite.config.ts frontend/tailwind.config.js frontend/postcss.config.js
git commit -m "chore: add vite ts config, tailwind, postcss"
```

---

## Task 3: index.html + index.css

**Files:**
- Modify: `frontend/index.html`
- Replace: `frontend/src/index.css`

- [ ] **Step 1: Update `frontend/index.html`**

Add Google Fonts and update the script src to `main.tsx`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CertiByt — Professional Voucher-Based Exam & Certification Platform</title>
    <meta name="description" content="CertiByt provides academic institutions and professional organizations with a secure, voucher-controlled exam proctoring platform and automated certificate system." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Replace `frontend/src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* shadcn CSS variables — mapped to navy/gold palette */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 215 28% 17%;
    --card: 0 0% 100%;
    --card-foreground: 215 28% 17%;
    --popover: 0 0% 100%;
    --popover-foreground: 215 28% 17%;
    --primary: 222 72% 35%;
    --primary-foreground: 0 0% 100%;
    --secondary: 214 32% 91%;
    --secondary-foreground: 215 28% 17%;
    --muted: 214 32% 91%;
    --muted-foreground: 215 16% 47%;
    --accent: 33 91% 37%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 222 72% 35%;
    --radius: 0.375rem;
  }
}

@layer base {
  * {
    @apply border-border box-border;
  }
  body {
    @apply bg-background text-foreground font-sans leading-relaxed;
    overflow-x: hidden;
  }
  html {
    scroll-behavior: smooth;
  }
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   (.rv → add .vis class via useScrollReveal)
   ============================================ */

.rv {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
}
.rv.vis {
  opacity: 1;
  transform: translateY(0);
}

.rv-fade {
  opacity: 0;
  transform: none !important;
  transition: opacity 0.9s ease-out !important;
}
.rv-fade.vis { opacity: 1; }

.rv-slide-up {
  opacity: 0;
  transform: translateY(40px) !important;
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.rv-slide-up.vis {
  opacity: 1;
  transform: translateY(0) !important;
}

.rv-pop {
  opacity: 0;
  transform: scale(0.88) translateY(20px) !important;
  transition: opacity 0.65s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}
.rv-pop.vis {
  opacity: 1;
  transform: scale(1) translateY(0) !important;
}

.rv-d1 { transition-delay: 0.05s !important; }
.rv-d2 { transition-delay: 0.15s !important; }
.rv-d3 { transition-delay: 0.25s !important; }
.rv-d4 { transition-delay: 0.35s !important; }
.rv-d5 { transition-delay: 0.45s !important; }

/* ============================================
   HERO CARD SHIFT ANIMATION
   ============================================ */

.hero-cert-card {
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.hero-cert-card.is-shifting {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 28px 62px rgba(15, 23, 42, 0.17);
}

/* ============================================
   CAROUSEL STICKY CONTAINER
   ============================================ */

.carousel-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  width: 100%;
}

/* Warm radial blush in carousel card top-right */
.carousel-card::before {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(180, 83, 9, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

/* ============================================
   FALLING SECTIONS (desktop ≥992px)
   Sticky positioning + z-index per section
   ============================================ */

@media (min-width: 992px) {
  .falling-section {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    transform-origin: center center;
    will-change: transform, opacity, filter;
    transition: transform 0.1s ease-out, opacity 0.1s ease-out, filter 0.1s ease-out;
  }
  .fs-verify  { background: #ffffff; z-index: 10; box-shadow: 0 -20px 40px rgba(15,23,42,0.03); }
  .fs-org     { background: #f8fafc; z-index: 11; box-shadow: 0 -25px 50px rgba(15,23,42,0.05); }
  .fs-testi   { background: #ffffff; z-index: 12; box-shadow: 0 -30px 60px rgba(15,23,42,0.08); }
  .fs-cta     { background: #0f172a; z-index: 13; box-shadow: 0 -35px 70px rgba(15,23,42,0.12); }
}

/* Hero grid dot background */
.hero-grid-bg {
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/index.html frontend/src/index.css
git commit -m "chore: tailwind css, animation keyframes, shadcn css vars"
```

---

## Task 4: lib/utils.ts + shadcn Button + shadcn Input

**Files:**
- Create: `frontend/src/lib/utils.ts`
- Create: `frontend/src/components/ui/button.tsx`
- Create: `frontend/src/components/ui/input.tsx`

- [ ] **Step 1: Create `frontend/src/lib/utils.ts`**

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Create `frontend/src/components/ui/button.tsx`**

```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:  'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        outline:  'border border-input bg-background shadow-sm hover:bg-accent/10 hover:text-accent-foreground',
        ghost:    'hover:bg-slate-100 hover:text-slate-900',
        link:     'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm:      'h-8 rounded-md px-3 text-xs',
        lg:      'h-11 rounded-md px-8 text-base',
        icon:    'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 3: Create `frontend/src/components/ui/input.tsx`**

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/lib/utils.ts frontend/src/components/ui/button.tsx frontend/src/components/ui/input.tsx
git commit -m "feat: add cn utility, shadcn Button and Input components"
```

---

## Task 5: useNavScroll hook

**Files:**
- Create: `frontend/src/hooks/useNavScroll.ts`

- [ ] **Step 1: Create `frontend/src/hooks/useNavScroll.ts`**

```ts
import { useState, useEffect } from 'react'

export function useNavScroll(threshold = 50): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])

  return scrolled
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/hooks/useNavScroll.ts
git commit -m "feat: useNavScroll hook"
```

---

## Task 6: useScrollReveal hook

**Files:**
- Create: `frontend/src/hooks/useScrollReveal.ts`

- [ ] **Step 1: Create `frontend/src/hooks/useScrollReveal.ts`**

The hook returns a stable ref callback. Spread it onto any element that should reveal on scroll. Each element is observed individually — multiple elements per component can each receive the callback, preserving per-element stagger. The observer is created lazily and disconnected on unmount.

```ts
import { useCallback, useEffect, useRef } from 'react'

function animateCounter(el: HTMLElement) {
  if (el.dataset.animated) return
  el.dataset.animated = 'true'

  const target = parseFloat(el.dataset.target ?? '0')
  const decimals = parseInt(el.dataset.decimals ?? '0', 10)
  const prefix = el.dataset.prefix ?? ''
  const suffix = el.dataset.suffix ?? ''
  const separator = el.dataset.separator ?? ','
  const duration = parseFloat(el.dataset.duration ?? '2000')
  const startTime = performance.now()

  function update(now: number) {
    const progress = Math.min((now - startTime) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    const value = (target * ease)
      .toFixed(decimals)
      .replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    el.innerHTML = prefix + value + suffix
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

export function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('vis')
            ;(entry.target as HTMLElement)
              .querySelectorAll<HTMLElement>('.stat-num')
              .forEach(animateCounter)
            observerRef.current?.unobserve(entry.target)
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
      )
    }
    return observerRef.current
  }, [])

  useEffect(() => {
    return () => observerRef.current?.disconnect()
  }, [])

  return useCallback(
    (el: HTMLElement | null) => {
      if (el) getObserver().observe(el)
    },
    [getObserver],
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/hooks/useScrollReveal.ts
git commit -m "feat: useScrollReveal hook with counter animation"
```

---

## Task 7: useHeroRotation hook

**Files:**
- Create: `frontend/src/hooks/useHeroRotation.ts`

- [ ] **Step 1: Create `frontend/src/hooks/useHeroRotation.ts`**

```ts
import { useState, useEffect } from 'react'

export interface HeroState {
  stage: string
  title: string
  meta: string
  metricOne: string; labelOne: string
  metricTwo: string; labelTwo: string
  metricThree: string; labelThree: string
  badgeLabel: string; badgeValue: string
  footnoteLabel: string; footnoteValue: string
}

const HERO_STATES: HeroState[] = [
  {
    stage: 'VOUCHER REDEEMED',
    title: 'AWS Cloud Practitioner',
    meta: 'Rahul Sharma · Access token accepted',
    metricOne: 'CB-9X2', labelOne: 'Voucher',
    metricTwo: 'READY',  labelTwo: 'Status',
    metricThree: '1',    labelThree: 'Attempt',
    badgeLabel: 'Identity checked',    badgeValue: 'Candidate verified',
    footnoteLabel: 'Queue',            footnoteValue: '14 exams ready',
  },
  {
    stage: 'EXAM IN PROGRESS',
    title: 'AWS Cloud Practitioner',
    meta: 'Rahul Sharma · Secure browser active',
    metricOne: '42m',  labelOne: 'Remaining',
    metricTwo: 'LIVE', labelTwo: 'Status',
    metricThree: '0',  labelThree: 'Flags',
    badgeLabel: 'Exam in progress', badgeValue: '14 candidates live',
    footnoteLabel: 'This month',    footnoteValue: '847 certs issued',
  },
  {
    stage: 'SCORE CALCULATED',
    title: 'AWS Cloud Practitioner',
    meta: 'Rahul Sharma · Submitted 14 Jun 2025',
    metricOne: '84%',  labelOne: 'Score',
    metricTwo: 'PASS', labelTwo: 'Result',
    metricThree: '38m', labelThree: 'Duration',
    badgeLabel: 'Evaluation complete',      badgeValue: 'Negative marking applied',
    footnoteLabel: 'Audit trail',           footnoteValue: 'All events sealed',
  },
  {
    stage: 'CERTIFICATE ISSUED',
    title: 'AWS Cloud Practitioner',
    meta: 'Rahul Sharma · ID CB-QN-714X99',
    metricOne: 'PDF',   labelOne: 'Credential',
    metricTwo: 'VALID', labelTwo: 'Lookup',
    metricThree: '<1s', labelThree: 'Issued',
    badgeLabel: 'Credential live',  badgeValue: 'Ready for employer audit',
    footnoteLabel: 'Verify ID',     footnoteValue: 'CB-QN-714X99',
  },
]

export function useHeroRotation(interval = 2600) {
  const [index, setIndex] = useState(0)
  const [isShifting, setIsShifting] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setIsShifting(true)
      setTimeout(() => {
        setIndex((i) => (i + 1) % HERO_STATES.length)
        setIsShifting(false)
      }, 360)
    }, interval)
    return () => clearInterval(id)
  }, [interval])

  return { state: HERO_STATES[index], isShifting }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/hooks/useHeroRotation.ts
git commit -m "feat: useHeroRotation hook with 4 state cycling"
```

---

## Task 8: useCarousel hook

**Files:**
- Create: `frontend/src/hooks/useCarousel.ts`

- [ ] **Step 1: Create `frontend/src/hooks/useCarousel.ts`**

```ts
import { useState, useEffect, RefObject } from 'react'

export interface CarouselState {
  progress: number
  maxTranslate: number
}

export function useCarousel(
  sectionRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
): CarouselState {
  const [state, setState] = useState<CarouselState>({ progress: 0, maxTranslate: 0 })

  useEffect(() => {
    function handle() {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track || window.innerWidth <= 768) {
        setState({ progress: 0, maxTranslate: 0 })
        return
      }
      const rect = section.getBoundingClientRect()
      const scrollDistance = rect.height - window.innerHeight
      const p = Math.min(1, Math.max(0, -rect.top / scrollDistance))
      const maxT = Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.2)
      setState({ progress: p, maxTranslate: maxT })
    }

    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle, { passive: true })
    handle()
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [sectionRef, trackRef])

  return state
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/hooks/useCarousel.ts
git commit -m "feat: useCarousel hook"
```

---

## Task 9: useFallingSections hook

**Files:**
- Create: `frontend/src/hooks/useFallingSections.ts`

- [ ] **Step 1: Create `frontend/src/hooks/useFallingSections.ts`**

Takes an array of section refs. Computes scroll-driven `transform / opacity / filter` per section. Returns an array of `CSSProperties` objects indexed to match the input refs. The last section never transforms (it's always on top).

```ts
import { useState, useEffect, useRef, RefObject, CSSProperties } from 'react'

const EMPTY: CSSProperties = {}

export function useFallingSections(
  refs: RefObject<HTMLElement | null>[],
): CSSProperties[] {
  const refsRef = useRef(refs)
  refsRef.current = refs

  const [styles, setStyles] = useState<CSSProperties[]>(() =>
    refs.map(() => EMPTY),
  )

  useEffect(() => {
    function handle() {
      const viewportHeight = window.innerHeight
      const isDesktop = window.innerWidth >= 992
      const currentRefs = refsRef.current

      setStyles(
        currentRefs.map((ref, i) => {
          if (!ref.current || !isDesktop || i === currentRefs.length - 1)
            return EMPTY

          const next = currentRefs[i + 1]?.current
          if (!next) return EMPTY

          const nextRect = next.getBoundingClientRect()
          const enterDistance = viewportHeight - nextRect.top

          if (enterDistance > 0 && nextRect.top > 0) {
            const p = Math.min(1, Math.max(0, enterDistance / viewportHeight))
            return {
              transform: `scale(${1 - p * 0.08}) translateY(${-p * 40}px)`,
              opacity: String(1 - p * 0.4),
              filter: `brightness(${1 - p * 0.25})`,
            }
          }
          if (nextRect.top <= 0) {
            return {
              transform: 'scale(0.92) translateY(-40px)',
              opacity: '0.6',
              filter: 'brightness(0.75)',
            }
          }
          return EMPTY
        }),
      )
    }

    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle, { passive: true })
    handle()
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [])

  return styles
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/hooks/useFallingSections.ts
git commit -m "feat: useFallingSections hook"
```

---

## Task 10: Navbar component

**Files:**
- Create: `frontend/src/components/Navbar.tsx`

- [ ] **Step 1: Create `frontend/src/components/Navbar.tsx`**

```tsx
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useNavScroll } from '@/hooks/useNavScroll'

export function Navbar() {
  const scrolled = useNavScroll()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '#features', label: 'Platform Overview' },
    { href: '#workflow', label: 'How It Works' },
    { href: '#store',    label: 'Exam Store' },
    { href: '#verify',   label: 'Verify Certificate' },
  ]

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 border-b border-slate-200 backdrop-blur-md transition-all duration-300',
        scrolled ? 'bg-white/95 shadow-sm py-0' : 'bg-white/90 py-0',
      )}
    >
      <div className="max-w-[1140px] mx-auto px-6 flex items-center justify-between h-16">
        <a href="#" className="font-serif text-2xl font-bold text-navy-dark tracking-tight flex-shrink-0">
          Certi<span className="text-gold">Byt</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-sm font-medium text-slate-600 hover:text-navy-dark transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-600">Login</Button>
          <Button
            variant="outline"
            size="sm"
            className="border-navy text-navy hover:bg-navy hover:text-white"
          >
            Register
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 ml-auto"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-[2px] bg-navy-dark" />
          <span className="block w-5 h-[2px] bg-navy-dark" />
          <span className="block w-5 h-[2px] bg-navy-dark" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-slate-600 hover:text-navy-dark"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm">Login</Button>
            <Button variant="outline" size="sm" className="border-navy text-navy">Register</Button>
          </div>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Navbar.tsx
git commit -m "feat: Navbar component"
```

---

## Task 11: Hero component

**Files:**
- Create: `frontend/src/components/Hero.tsx`

- [ ] **Step 1: Create `frontend/src/components/Hero.tsx`**

```tsx
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useHeroRotation } from '@/hooks/useHeroRotation'

export function Hero() {
  const reveal = useScrollReveal()
  const { state, isShifting } = useHeroRotation()

  const metrics = [
    [state.metricOne,   state.labelOne],
    [state.metricTwo,   state.labelTwo],
    [state.metricThree, state.labelThree],
  ] as const

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-white"
      id="hero"
    >
      {/* Decorative arcs */}
      <div className="absolute right-0 top-0 pointer-events-none select-none" aria-hidden="true">
        <svg className="w-[500px] h-[500px] opacity-40" viewBox="0 0 500 500" fill="none">
          <circle cx="380" cy="200" r="220" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="380" cy="200" r="160" stroke="#e2e8f0" strokeWidth="0.75" />
          <circle cx="380" cy="200" r="100" stroke="#e2e8f0" strokeWidth="0.5" />
        </svg>
        <div className="absolute top-20 right-24 text-slate-200 text-3xl">✦</div>
      </div>

      <div className="max-w-[1140px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <h1
            ref={reveal}
            className="rv font-serif text-[2.75rem] lg:text-[3.5rem] font-bold text-navy-dark leading-[1.15] mb-6"
          >
            Rigorous assessments.<br />
            <em className="not-italic text-navy">Verifiable credentials.</em>
          </h1>

          <p
            ref={reveal}
            className="rv text-slate-500 text-lg leading-relaxed mb-8 max-w-lg"
          >
            <span className="text-gold font-bold mr-2">→</span>
            CertiByt delivers a secure assessment platform for organizations — with strict
            voucher-controlled access, live proctoring oversight, and instantaneous
            credential verification.
          </p>

          <div ref={reveal} className="rv flex flex-wrap gap-4">
            <Button size="lg" className="bg-navy hover:bg-navy-light text-white font-semibold">
              Deploy First Exam <span className="ml-1 text-base">›</span>
            </Button>
            <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:border-slate-400">
              Explore Public Store
            </Button>
          </div>
        </div>

        {/* Right — cert card */}
        <div ref={reveal} className="rv flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px]">
            {/* Grid bg */}
            <div className="absolute inset-0 rounded-2xl hero-grid-bg pointer-events-none" aria-hidden="true" />

            {/* Card */}
            <div
              className={cn(
                'hero-cert-card relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-xl',
                isShifting && 'is-shifting',
              )}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-navy rounded-md grid place-items-center flex-shrink-0">
                  <span className="text-white text-xs font-bold leading-none">C</span>
                </div>
                <strong className="text-navy-dark text-xs font-bold tracking-[0.15em]">CERTIBYT</strong>
              </div>

              <div className="text-gold text-[10px] font-bold tracking-[0.12em] uppercase mb-2">
                {state.stage}
              </div>
              <h3 className="text-navy-dark text-lg font-bold mb-1">{state.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{state.meta}</p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {metrics.map(([metric, label]) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-3 text-center">
                    <strong className="block text-navy-dark text-sm font-bold">{metric}</strong>
                    <span className="text-slate-400 text-[10px] mt-0.5 block">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span />
                <a href="#verify" className="text-navy text-sm font-medium hover:text-gold transition-colors">
                  Verify →
                </a>
              </div>
            </div>

            {/* Live badge — bottom-left */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <div>
                <small className="block text-slate-400 text-[10px]">{state.badgeLabel}</small>
                <strong className="text-navy-dark text-sm">{state.badgeValue}</strong>
              </div>
            </div>

            {/* Issue badge — top-right */}
            <div className="absolute -top-5 -right-5 bg-navy text-white rounded-xl shadow-lg px-4 py-3">
              <small className="block text-navy-light/70 text-[10px]">{state.footnoteLabel}</small>
              <strong className="text-sm">↑ {state.footnoteValue}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Hero.tsx
git commit -m "feat: Hero component with animated cert card"
```

---

## Task 12: TrustedBy component

**Files:**
- Create: `frontend/src/components/TrustedBy.tsx`

- [ ] **Step 1: Create `frontend/src/components/TrustedBy.tsx`**

```tsx
import { useScrollReveal } from '@/hooks/useScrollReveal'

const LOGOS = ['ARX PARTNERS', 'TECHCORP INC.', 'INNOTRAIN GROUP', 'SKILLLAB GLOBAL', 'CLOUDACADEMY']

const STATS = [
  { target: '500', suffix: '+',  label: 'Exams Administered' },
  { target: '100', suffix: '%',  label: 'Verifiable Certificates' },
  { target: '1',   suffix: 's',  prefix: '< ', label: 'Second Issuance Delay' },
  { target: '0',   suffix: ' KB', label: 'Applicant PII Retained' },
]

export function TrustedBy() {
  const reveal = useScrollReveal()

  return (
    <section className="py-20 bg-slate-50/60 border-y border-slate-100" id="usedBy">
      <div className="max-w-[1140px] mx-auto px-6">
        <p ref={reveal} className="rv rv-fade text-center text-sm font-semibold text-slate-400 tracking-widest uppercase mb-10">
          Trusted by leading educational and corporate partners
        </p>

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-16">
          {LOGOS.map((name, i) => (
            <span
              key={name}
              ref={reveal}
              className={`rv rv-slide-up rv-d${i + 1} text-sm font-bold text-slate-300 tracking-widest`}
            >
              {name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ target, suffix, prefix, label }, i) => (
            <div
              key={label}
              ref={reveal}
              className={`rv rv-pop rv-d${i + 1} bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center`}
            >
              <div
                className="stat-num text-3xl font-bold text-navy-dark mb-1"
                data-target={target}
                data-suffix={suffix}
                data-prefix={prefix ?? ''}
              >
                0
              </div>
              <div className="text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/TrustedBy.tsx
git commit -m "feat: TrustedBy component with animated counters"
```

---

## Task 13: FeaturesCarousel component

**Files:**
- Create: `frontend/src/components/FeaturesCarousel.tsx`

- [ ] **Step 1: Create `frontend/src/components/FeaturesCarousel.tsx`**

The section's total height is `300vh` so the sticky container stays pinned long enough for the carousel to scroll through all cards.

```tsx
import { useRef } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useCarousel } from '@/hooks/useCarousel'

const CARDS = [
  {
    num: '01',
    title: ['Voucher ', 'Access', ' Control'],
    desc: 'Generate single-use codes linked to specific candidates. Prevent sharing, unauthorized access, and multiple attempts.',
  },
  {
    num: '02',
    title: ['Cryptographic ', 'Certificates'],
    desc: 'Dynamic secure PDF generation upon passing scores. Each document contains a unique verification identifier for employers.',
  },
  {
    num: '03',
    title: ['Proctored ', 'Assessment'],
    desc: 'Browser lock enforcement, tab-switch logging, and secure candidate monitoring metrics to safeguard the evaluation process.',
  },
  {
    num: '04',
    title: ['Detailed ', 'Analytics'],
    desc: 'Score distribution graphs, drop-off questions, average completion durations, and registration metrics in real-time.',
  },
  {
    num: '05',
    title: ['Strict ', 'Scoring', ' Formula'],
    desc: 'Configure custom weightings, passing thresholds, and negative marking penalty formulas per category to meet your standards.',
  },
]

export function FeaturesCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reveal = useScrollReveal()
  const { progress, maxTranslate } = useCarousel(sectionRef, trackRef)

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: '300vh' }}
      id="features"
    >
      <div className="carousel-sticky">
        {/* Header */}
        <div className="w-full pb-6 px-6">
          <div className="max-w-[1140px] mx-auto flex justify-between items-end">
            <div ref={reveal} className="rv max-w-[600px]">
              <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">Platform Features</div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-dark mb-3">
                Designed for academic integrity &amp; simple administration
              </h2>
              <p className="text-slate-500">
                A unified suite to manage vouchers, oversee exams, and issue professional credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className="flex gap-8 px-[10%] w-max"
          style={{ transform: `translateX(${-progress * maxTranslate}px)` }}
        >
          {CARDS.map(({ num, title, desc }) => (
            <div
              key={num}
              className="carousel-card relative flex-shrink-0 w-[340px] h-[420px] rounded-[20px] bg-white border border-slate-100 shadow-sm flex flex-col justify-end p-9 overflow-hidden hover:-translate-y-2 transition-transform duration-300"
            >
              <span className="absolute top-7 right-7 text-[80px] font-bold text-slate-100 leading-none select-none">
                {num}
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy-dark mb-3 leading-snug">
                {title[0]}<em className="not-italic text-gold">{title[1]}</em>{title[2] ?? ''}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                <span className="text-gold font-bold mr-1">→</span> {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full px-[10%] mt-6">
          <div className="h-[2px] bg-slate-100 rounded-full">
            <div
              className="h-full bg-navy rounded-full transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/FeaturesCarousel.tsx
git commit -m "feat: FeaturesCarousel component with scroll-driven horizontal track"
```

---

## Task 14: Workflow component

**Files:**
- Create: `frontend/src/components/Workflow.tsx`

- [ ] **Step 1: Create `frontend/src/components/Workflow.tsx`**

```tsx
import { useScrollReveal } from '@/hooks/useScrollReveal'

const STEPS = [
  {
    num: '01',
    badge: 'Assessment setup',
    title: 'Upload & Configure',
    desc: 'Define testing questions, set evaluation rules, and configure negative marking metrics.',
    visual: (
      <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm mt-4">
        <div className="flex gap-1.5 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="text-slate-300"><span className="text-slate-500">Title: </span><span className="text-emerald-400">"Risk Policy Exam"</span></div>
        <div className="text-slate-300"><span className="text-slate-500">Pass-Mark: </span><span className="text-blue-400">75%</span></div>
      </div>
    ),
  },
  {
    num: '02',
    badge: 'Distribution',
    title: 'Allocate Vouchers',
    desc: 'Distribute secure voucher tokens to students or launch them on your corporate storefront.',
    visual: (
      <div className="space-y-2 mt-4">
        {['ARX-4F2E91', 'ARX-B39D02'].map((code) => (
          <div key={code} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 font-mono">
            Voucher {code} allocated.
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '03',
    badge: 'Proctored Session',
    title: 'Verification & Start',
    desc: 'Candidates redeem their code, lock the window focus, and complete the proctored test.',
    visual: (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4">
        <div className="text-sm font-semibold text-navy-dark mb-2">45:12 Remaining</div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-navy rounded-full" style={{ width: '65%' }} />
        </div>
      </div>
    ),
  },
  {
    num: '04',
    badge: 'Resolution',
    title: 'Instant Verification',
    desc: 'Successful scores generate encrypted PDF certifications instantly available for employer audit.',
    visual: (
      <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mt-4">
        <div className="bg-navy text-white text-xs font-semibold px-4 py-2">Credential Issued Successfully</div>
        <div className="px-4 py-3 text-sm text-slate-600">ID: CB-QN-714X99 is active and verified.</div>
      </div>
    ),
  },
]

export function Workflow() {
  const reveal = useScrollReveal()

  return (
    <section className="py-24 bg-slate-50/50" id="workflow">
      <div className="max-w-[1140px] mx-auto px-6">
        <div ref={reveal} className="rv text-center mb-16">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">Methodology</div>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-dark">
            Secure end-to-end certification process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map(({ num, badge, title, desc, visual }) => (
            <div
              key={num}
              ref={reveal}
              className="rv bg-white rounded-2xl border border-slate-100 shadow-sm p-7"
            >
              <div className="text-3xl font-bold text-slate-100 mb-2">{num}</div>
              <div className="inline-block text-xs font-bold tracking-widest text-gold uppercase bg-gold/5 border border-gold/20 rounded-full px-3 py-1 mb-3">
                {badge}
              </div>
              <h3 className="font-serif text-xl font-bold text-navy-dark mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              {visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Workflow.tsx
git commit -m "feat: Workflow component"
```

---

## Task 15: VerificationDemo component

**Files:**
- Create: `frontend/src/components/VerificationDemo.tsx`

- [ ] **Step 1: Create `frontend/src/components/VerificationDemo.tsx`**

Accepts `ref` and `style` for falling-section scroll coordination.

```tsx
import { forwardRef, CSSProperties, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const VALID_ID = 'CB-QN-714X99'

interface Props {
  style?: CSSProperties
}

export const VerificationDemo = forwardRef<HTMLElement, Props>(({ style }, ref) => {
  const reveal = useScrollReveal()
  const [inputValue, setInputValue] = useState(VALID_ID)
  const [result, setResult] = useState<{ valid: boolean } | null>({ valid: true })

  function handleVerify() {
    setResult({ valid: inputValue.trim().toUpperCase() === VALID_ID })
  }

  return (
    <section
      ref={ref}
      className="falling-section fs-verify py-24"
      style={style}
      id="verify"
    >
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy + demo */}
          <div ref={reveal} className="rv">
            <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">Verify Authenticity</div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-dark mb-4">
              Instant verification lookup services
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              Provide employers and audit organizations with real-time verification status reports.
              Authenticate certificates instantly using the unique cryptographically generated IDs.
            </p>

            {/* Stats */}
            <div className="flex gap-10 mb-10">
              <div>
                <div className="stat-num text-3xl font-bold text-navy-dark" data-target="100" data-suffix="%">0</div>
                <div className="text-sm text-slate-500 mt-1">Self-serve verification</div>
              </div>
              <div>
                <div className="stat-num text-3xl font-bold text-navy-dark" data-target="0" data-suffix=" KB">0</div>
                <div className="text-sm text-slate-500 mt-1">Applicant PII stored publicly</div>
              </div>
            </div>

            {/* Demo */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Certificate ID
              </label>
              <div className="flex gap-3 mb-4">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  className="font-mono"
                  aria-label="Certificate ID"
                />
                <Button onClick={handleVerify} className="bg-navy hover:bg-navy-light text-white flex-shrink-0">
                  Verify
                </Button>
              </div>

              {result !== null && (
                <div
                  className={cn(
                    'flex items-start gap-3 rounded-xl px-4 py-3 border text-sm',
                    result.valid
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800',
                  )}
                >
                  <span className="text-base mt-0.5">{result.valid ? '✓' : '✗'}</span>
                  <div>
                    <strong className="block font-semibold">
                      {result.valid ? 'Credential verified' : 'No matching credential found'}
                    </strong>
                    <p className="text-xs mt-0.5 opacity-80">
                      {result.valid
                        ? 'Issued to Eliza Vance · Quantum Systems & Risk Algorithms'
                        : `Try sample ID ${VALID_ID} for the live demo result.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — certificate card */}
          <div ref={reveal} className="rv hidden lg:block">
            <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-navy px-6 py-4 flex items-center justify-between">
                <span className="text-white text-sm font-bold tracking-wide">CertiByt Verification Authority</span>
                <span className="bg-emerald-400 text-navy-dark text-xs font-bold px-3 py-1 rounded-full">VALID CREDENTIAL</span>
              </div>
              <div className="bg-white px-8 py-10 text-center">
                <div className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-4">Certificate of Recognition</div>
                <h3 className="font-serif text-3xl font-bold text-navy-dark mb-2">ELIZA VANCE</h3>
                <p className="text-slate-500 text-sm mb-4">has demonstrated competency and satisfied all educational standards in</p>
                <div className="text-navy font-bold text-lg mb-8 tracking-wide">QUANTUM SYSTEMS &amp; RISK ALGORITHMS</div>
                <div className="flex justify-center gap-12 text-left border-t border-slate-100 pt-6">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Issued On</div>
                    <div className="text-sm font-semibold text-navy-dark mt-1">26 October 2024</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Verification ID</div>
                    <div className="text-sm font-semibold text-navy-dark font-mono mt-1">{VALID_ID}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})
VerificationDemo.displayName = 'VerificationDemo'
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/VerificationDemo.tsx
git commit -m "feat: VerificationDemo component with falling-section ref"
```

---

## Task 16: OrgHub component

**Files:**
- Create: `frontend/src/components/OrgHub.tsx`

- [ ] **Step 1: Create `frontend/src/components/OrgHub.tsx`**

```tsx
import { forwardRef, CSSProperties } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const ORGS = [
  { abbr: 'ARX', name: 'ARX Academy',      meta: '12 exams · 340 vouchers', pct: 80,  color: '#1e3a8a' },
  { abbr: 'TC',  name: 'TechCorp Legal',   meta: '7 exams · 180 vouchers',  pct: 55,  color: '#2563eb' },
  { abbr: 'IT',  name: 'InnoTrain Global', meta: '5 exams · 90 vouchers',   pct: 40,  color: '#0f766e' },
  { abbr: 'SL',  name: 'SkillLab Org',     meta: '9 exams · 210 vouchers',  pct: 65,  color: '#b45309' },
]

interface Props { style?: CSSProperties }

export const OrgHub = forwardRef<HTMLElement, Props>(({ style }, ref) => {
  const reveal = useScrollReveal()

  return (
    <section
      ref={ref}
      className="falling-section fs-org py-24"
      style={style}
      id="multiOrg"
    >
      <div className="max-w-[1140px] mx-auto px-6">
        <div ref={reveal} className="rv text-center mb-14">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">Multi-Tenant Console</div>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-dark mb-4">
            Centralized multi-tenant management
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Configure regional departments, distinct academy instances, or multiple corporate portals
            under a single master administrator login.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ORGS.map(({ abbr, name, meta, pct, color }) => (
            <div key={abbr} ref={reveal} className="rv bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div
                className="w-12 h-12 rounded-xl text-white font-bold text-sm flex items-center justify-center mb-4"
                style={{ backgroundColor: color }}
              >
                {abbr}
              </div>
              <div className="font-semibold text-navy-dark mb-1">{name}</div>
              <div className="text-xs text-slate-400 mb-4">{meta}</div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})
OrgHub.displayName = 'OrgHub'
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/OrgHub.tsx
git commit -m "feat: OrgHub component with falling-section ref"
```

---

## Task 17: Testimonials component

**Files:**
- Create: `frontend/src/components/Testimonials.tsx`

- [ ] **Step 1: Create `frontend/src/components/Testimonials.tsx`**

```tsx
import { forwardRef, CSSProperties } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const TESTIMONIALS = [
  {
    quote: '"Transitioning from spreadsheet coordination to CertiByt voucher distribution reduced our administrative oversight hours by half."',
    name: 'Priya M.',
    role: 'Training Head, Tech Institute',
    initial: 'P',
    color: '#1e3a8a',
  },
  {
    quote: '"The single-use voucher code system keeps credentials highly secure. Registration has never been simpler."',
    name: 'Aditya R.',
    role: 'L&D Manager, Corporate',
    initial: 'A',
    color: '#2563eb',
  },
]

interface Props { style?: CSSProperties }

export const Testimonials = forwardRef<HTMLElement, Props>(({ style }, ref) => {
  const reveal = useScrollReveal()

  return (
    <section
      ref={ref}
      className="falling-section fs-testi py-24"
      style={style}
      id="testimonials"
    >
      <div className="max-w-[1140px] mx-auto px-6">
        <div ref={reveal} className="rv text-center mb-14">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">Endorsements</div>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-dark">
            Adopted by educational administrators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {TESTIMONIALS.map(({ quote, name, role, initial, color }) => (
            <div
              key={name}
              ref={reveal}
              className="rv bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
            >
              <p className="text-slate-600 leading-relaxed italic mb-6">{quote}</p>
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full text-white font-bold text-sm flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {initial}
                </div>
                <div>
                  <div className="font-semibold text-navy-dark text-sm">{name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})
Testimonials.displayName = 'Testimonials'
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Testimonials.tsx
git commit -m "feat: Testimonials component with falling-section ref"
```

---

## Task 18: CTA component

**Files:**
- Create: `frontend/src/components/CTA.tsx`

- [ ] **Step 1: Create `frontend/src/components/CTA.tsx`**

```tsx
import { forwardRef, CSSProperties } from 'react'
import { Button } from '@/components/ui/button'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Props { style?: CSSProperties }

export const CTA = forwardRef<HTMLElement, Props>(({ style }, ref) => {
  const reveal = useScrollReveal()

  return (
    <section
      ref={ref}
      className="falling-section fs-cta py-24"
      style={style}
      id="ctaSection"
    >
      <div className="max-w-[1140px] mx-auto px-6 text-center">
        <div ref={reveal} className="rv">
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Deploy your credential program securely
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Initiate evaluation campaigns in minutes. Zero setup required for trial tiers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold-light text-white font-semibold px-8"
            >
              Create Administrator Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white hover:bg-white/5 px-8"
            >
              Contact Sales Representative
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
})
CTA.displayName = 'CTA'
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/CTA.tsx
git commit -m "feat: CTA component with falling-section ref"
```

---

## Task 19: Footer component

**Files:**
- Create: `frontend/src/components/Footer.tsx`

- [ ] **Step 1: Create `frontend/src/components/Footer.tsx`**

```tsx
const FOOTER_LINKS = [
  {
    head: 'Platform',
    links: ['Solutions Overview', 'Public Stores', 'Verify Lookup'],
  },
  {
    head: 'Resources',
    links: ['Documentation', 'API Integration', 'Fee Structure'],
  },
  {
    head: 'Compliance',
    links: ['Privacy Standards', 'Terms of Use'],
  },
]

export function Footer() {
  return (
    <footer className="bg-navy-dark text-slate-400 py-16 border-t border-white/5">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 mb-12">
          <div className="flex-shrink-0 max-w-[240px]">
            <div className="font-serif text-2xl font-bold text-white mb-3">
              Certi<span className="text-gold">Byt</span>
            </div>
            <p className="text-sm leading-relaxed">Academic security solutions and voucher validation systems.</p>
          </div>

          <div className="flex flex-wrap gap-12 flex-1 justify-end">
            {FOOTER_LINKS.map(({ head, links }) => (
              <div key={head}>
                <div className="text-xs font-bold tracking-widest text-white uppercase mb-4">{head}</div>
                <div className="flex flex-col gap-3">
                  {links.map((label) => (
                    <a key={label} href="#" className="text-sm hover:text-white transition-colors">
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm">
          <span>© 2026 CertiByt. All rights reserved.</span>
          <div className="flex gap-6">
            {['Twitter', 'LinkedIn', 'GitHub'].map((s) => (
              <a key={s} href="#" className="hover:text-white transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/Footer.tsx
git commit -m "feat: Footer component"
```

---

## Task 20: App.tsx + main.tsx

**Files:**
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/main.tsx`

- [ ] **Step 1: Create `frontend/src/main.tsx`**

Wrap with Wouter `Router` so future page routes can be added without refactoring App.

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from 'wouter'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
```

- [ ] **Step 2: Create `frontend/src/App.tsx`**

`App.tsx` creates refs for the 4 falling sections (VerificationDemo, OrgHub, Testimonials, CTA), runs `useFallingSections`, and passes computed styles down.

```tsx
import { useRef } from 'react'
import { Navbar }           from './components/Navbar'
import { Hero }             from './components/Hero'
import { TrustedBy }        from './components/TrustedBy'
import { FeaturesCarousel } from './components/FeaturesCarousel'
import { Workflow }         from './components/Workflow'
import { VerificationDemo } from './components/VerificationDemo'
import { OrgHub }           from './components/OrgHub'
import { Testimonials }     from './components/Testimonials'
import { CTA }              from './components/CTA'
import { Footer }           from './components/Footer'
import { useFallingSections } from './hooks/useFallingSections'

export default function App() {
  const verifyRef = useRef<HTMLElement>(null)
  const orgRef    = useRef<HTMLElement>(null)
  const testiRef  = useRef<HTMLElement>(null)
  const ctaRef    = useRef<HTMLElement>(null)

  const fallingStyles = useFallingSections([verifyRef, orgRef, testiRef, ctaRef])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <FeaturesCarousel />
        <Workflow />
        <VerificationDemo ref={verifyRef} style={fallingStyles[0]} />
        <OrgHub           ref={orgRef}    style={fallingStyles[1]} />
        <Testimonials     ref={testiRef}  style={fallingStyles[2]} />
        <CTA              ref={ctaRef}    style={fallingStyles[3]} />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Run dev server and verify page loads**

Run from `frontend/`:
```bash
npm run dev
```

Open `http://localhost:5173`. Expected: page loads with all sections visible. Scroll to verify animations trigger. Hero card should cycle every 2.6s. Feature carousel should scroll horizontally on desktop.

- [ ] **Step 4: Run TypeScript check**

```bash
npm run check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/main.tsx frontend/src/App.tsx
git commit -m "feat: App.tsx assembly with falling sections coordination"
```

---

## Task 21: Delete old files + final verification

**Files:**
- Delete: `frontend/src/certibyte.html`, `frontend/src/certibyte.css`, `frontend/src/App.jsx`, `frontend/src/main.jsx`, `frontend/vite.config.js`

- [ ] **Step 1: Delete old files**

```bash
git rm frontend/src/certibyte.html frontend/src/certibyte.css frontend/src/App.jsx frontend/src/main.jsx frontend/vite.config.js
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd frontend && npm run check
```

Expected: no errors.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: `frontend/dist/` generated without errors.

- [ ] **Step 5: Final visual check in dev server**

```bash
npm run dev
```

Verify:
- All 10 sections render
- Hero card cycles (2.6 s)
- Stat counters animate on scroll
- Feature carousel scrolls horizontally on desktop
- VerificationDemo: type `CB-QN-714X99` → "Credential verified"; any other text → "No matching credential"
- Falling sections stack on desktop (≥992px)
- Mobile nav toggle works
- Nav background appears on scroll

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove legacy certibyte.html, certibyte.css, App.jsx, main.jsx, vite.config.js"
```
