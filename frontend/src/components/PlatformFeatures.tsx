import { useEffect, useRef } from 'react'
import { Ticket, FileText, Monitor, Zap, BarChart2 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollReveal } from '@/hooks/useScrollReveal'

gsap.registerPlugin(ScrollTrigger)

/* ─── static data ─────────────────────────────────────────────────────────── */

const VOUCHER_CODES = [
  { code: 'ARX-4F2E91', status: 'Used',   statusCls: 'text-slate-400'   },
  { code: 'ARX-B39D02', status: 'Active', statusCls: 'text-emerald-600' },
  { code: 'ARX-CC71A4', status: 'Unused', statusCls: 'text-slate-400'   },
]

const BARS = [
  { h: 'h-[40%]', cls: 'bg-navy' },
  { h: 'h-[65%]', cls: 'bg-gold' },
  { h: 'h-[55%]', cls: 'bg-navy' },
  { h: 'h-[80%]', cls: 'bg-gold' },
  { h: 'h-[70%]', cls: 'bg-navy' },
  { h: 'h-[90%]', cls: 'bg-gold' },
  { h: 'h-[75%]', cls: 'bg-navy' },
]

/* ─── card inner content (shared between grid & overlay proxy) ─────────────── */

function CardInner({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      return (
        <>
          <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center mb-3">
            <Ticket className="w-4 h-4 text-navy" />
          </div>
          <h3 className="text-navy-dark font-bold text-base mb-1">Voucher-controlled access</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-3">
            Org admins purchase voucher packages. Each candidate gets a unique ARX-code.
            No code, no exam. Zero unauthorized attempts.
          </p>
          <div className="flex flex-wrap gap-2">
            {VOUCHER_CODES.map(({ code, status, statusCls }) => (
              <div
                key={code}
                className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200"
              >
                <span className="text-slate-600 text-xs font-mono">{code}</span>
                <span className={`text-xs font-semibold ${statusCls}`}>{status}</span>
              </div>
            ))}
          </div>
        </>
      )

    case 1:
      return (
        <>
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
            <FileText className="w-4 h-4 text-gold" />
          </div>
          <h3 className="text-navy-dark font-bold text-base mb-1">Instant PDF certificates</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            PDF generated the moment a candidate passes. Unique ID on every cert.
            Employers can verify on your public link.
          </p>
        </>
      )

    case 2:
      return (
        <>
          <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center mb-3">
            <Monitor className="w-4 h-4 text-navy" />
          </div>
          <h3 className="text-navy-dark font-bold text-base mb-1">Proctored environment</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-2">
            Fullscreen lock, tab-switch detection, webcam monitoring.
            No data stored. Just live oversight.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Fullscreen', 'Tab detect', 'Webcam', 'Live view'].map(tag => (
              <span
                key={tag}
                className="text-xs font-medium text-navy bg-navy/8 border border-navy/15 rounded-full px-2.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )

    case 3:
      return (
        <>
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
            <Zap className="w-4 h-4 text-gold" />
          </div>
          <h3 className="text-navy-dark font-bold text-base mb-1">Negative marking</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Set per-exam deductions for wrong answers. Configurable penalty — keeps scoring rigorous.
          </p>
        </>
      )

    case 4:
      return (
        <>
          <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center mb-3">
            <BarChart2 className="w-4 h-4 text-navy" />
          </div>
          <h3 className="text-navy-dark font-bold text-base mb-1">Deep analytics</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-2">
            Pass rates, attempt trends, per-question accuracy. Spot weak areas fast. Export-ready.
          </p>
          <div className="flex items-end gap-1 h-6">
            {BARS.map(({ h, cls }, i) => (
              <div key={i} className={`flex-1 rounded-sm ${h} ${cls}`} />
            ))}
          </div>
        </>
      )

    default:
      return null
  }
}

const CARD_INDICES   = [0, 1, 2, 3, 4] as const
const CARD_COL_SPAN  = ['md:col-span-2', '', '', '', ''] as const

/* Card classes: relative + explicit z-0 for consistent grid stacking */
const GRID_CARD  = 'bg-white rounded-2xl border border-slate-300 shadow-sm p-5 relative z-0'
/* Proxy lives in the fixed overlay — absolute, no stacking context restriction */
const PROXY_CARD = 'bg-white rounded-2xl border border-slate-300 shadow-sm p-5 absolute origin-center will-change-transform'

/* ─── component ────────────────────────────────────────────────────────────── */

export function PlatformFeatures() {
  const reveal     = useScrollReveal()
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])
  const proxyRefs  = useRef<(HTMLDivElement | null)[]>([])

  const setCard  = (i: number) => (el: HTMLDivElement | null) => { cardRefs.current[i]  = el }
  const setProxy = (i: number) => (el: HTMLDivElement | null) => { proxyRefs.current[i] = el }

  useEffect(() => {
    const section = sectionRef.current
    const cards   = cardRefs.current.filter(Boolean)  as HTMLDivElement[]
    const proxies = proxyRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!section || cards.length === 0 || proxies.length === 0) return

    const reset = () => {
      gsap.set(proxies, { clearProps: 'all', display: 'none' })
      gsap.set(cards,   { clearProps: 'opacity' })
    }

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      let tl: gsap.core.Timeline | null = null

      const build = () => {
        tl?.scrollTrigger?.kill()
        tl?.kill()
        reset()
        void section.getBoundingClientRect()

        const sr  = section.getBoundingClientRect()
        const vpW = window.innerWidth
        const vpH = window.innerHeight

        const offsets = cards.map((card, i) => {
          const r    = card.getBoundingClientRect()
          const relX = r.left - sr.left
          const relY = r.top  - sr.top
          // Start hidden at grid position; display toggled by timeline
          gsap.set(proxies[i], { display: 'none', left: relX, top: relY, width: r.width, x: 0, y: 0, scale: 1 })
          return {
            tx: vpW / 2 - (relX + r.width  / 2),
            ty: vpH / 2 - (relY + r.height / 2),
          }
        })

        tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: 'top top',
            end: `+=${cards.length * 400}`,
            scrub: 0.8,
            onLeave:     () => { tl?.progress(1, true); reset() },
            onLeaveBack: () => { tl?.progress(0, true); reset() },
          },
        })

        // Buffer tween: pushes card .set()s off t=0 so GSAP init-render
        // (always at progress=0) never fires proxy display changes
        tl!.to({}, { duration: 0.01 })

        cards.forEach((card, i) => {
          const proxy  = proxies[i]
          const others = cards.filter((_, j) => j !== i)
          const { tx, ty } = offsets[i]

          tl!
            .set(proxy, { display: 'block', x: 0, y: 0, scale: 1 })
            .set(card,  { opacity: 0 }, '<')
            .to(proxy,  { x: tx, y: ty, scale: 1.5, ease: 'power2.inOut', duration: 1 })
            .to(others, { opacity: 0.2,              ease: 'power2.inOut', duration: 1 }, '<')
            .to(proxy,  { x: 0,  y: 0,  scale: 1,   ease: 'power2.inOut', duration: 1 })
            .to(others, { opacity: 1,                ease: 'power2.inOut', duration: 1 }, '<')
            .set(card,  { opacity: 1 })
            .set(proxy, { display: 'none' }, '<')
        })
      }

      build()

      let resizeTimer: ReturnType<typeof setTimeout>
      const onResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(build, 200)
      }
      window.addEventListener('resize', onResize)

      return () => {
        window.removeEventListener('resize', onResize)
        clearTimeout(resizeTimer)
        tl?.scrollTrigger?.kill()
        tl?.kill()
        reset()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <>
      {/* Pinned section */}
      <section ref={sectionRef} className="py-10 bg-slate-50/50" id="platformFeatures">
        <div className="max-w-[1140px] mx-auto px-6">

          {/* Header */}
          <div ref={reveal} className="rv mb-6">
            <div className="text-xs font-bold tracking-widest text-gold uppercase mb-2">
              Platform Features
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-navy-dark">
              Everything works out of the box.{' '}
              <span className="text-slate-400">No setup hell.</span>
            </h2>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {CARD_INDICES.map(i => (
              <div
                key={i}
                ref={setCard(i)}
                className={`${CARD_COL_SPAN[i]} ${GRID_CARD}`}
              >
                <CardInner idx={i} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Overlay AFTER section in DOM — later = higher stacking order, guarantees
          it paints above the GSAP-pinned section (position:fixed) at same z-level */}
      <div className="fixed inset-0 pointer-events-none z-[99999]">
        {CARD_INDICES.map(i => (
          <div key={i} ref={setProxy(i)} className={PROXY_CARD}>
            <CardInner idx={i} />
          </div>
        ))}
      </div>
    </>
  )
}
