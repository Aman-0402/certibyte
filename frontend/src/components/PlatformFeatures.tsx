import { useEffect, useRef } from 'react'
import { Ticket, FileText, Monitor, Zap, BarChart2 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollReveal } from '@/hooks/useScrollReveal'

gsap.registerPlugin(ScrollTrigger)

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

const CARD_BASE =
  'bg-white rounded-2xl border border-slate-300 shadow-sm p-5 relative z-0'

export function PlatformFeatures() {
  const reveal     = useScrollReveal()
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const cards   = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!section || cards.length === 0) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      let tl: gsap.core.Timeline | null = null

      const build = () => {
        // Tear down previous before measuring
        tl?.scrollTrigger?.kill()
        tl?.kill()
        gsap.set(cards, { clearProps: 'transform,zIndex' })
        void section.getBoundingClientRect() // flush layout

        // Positions relative to section — stable regardless of scroll position.
        // When GSAP pins (section fixed at top:0 left:0), these become exact
        // viewport coords, so the translate math is correct.
        const sr  = section.getBoundingClientRect()
        const vpW = window.innerWidth
        const vpH = window.innerHeight

        // Pre-compute offsets so build() can be called at any scroll position
        const offsets = cards.map(card => {
          const r  = card.getBoundingClientRect()
          const cx = r.left - sr.left + r.width  / 2  // card center X within section
          const cy = r.top  - sr.top  + r.height / 2  // card center Y within section
          return {
            tx: vpW / 2 - cx,  // translate to viewport horizontal center
            ty: vpH / 2 - cy,  // translate to viewport vertical center
          }
        })

        tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: 'top top',
            // 400px of scroll per card: 2 tweens + 2 sets per card
            end: `+=${cards.length * 400}`,
            scrub: 0.8,
          },
        })

        cards.forEach((card, i) => {
          const { tx, ty } = offsets[i]
          const others = cards.filter((_, j) => j !== i)

          tl!
            // Raise active card above siblings (all others are z-0)
            .set(card, { zIndex: 100 })
            // Fly to center + simultaneously dim surrounding cards
            .to(card,   { x: tx, y: ty, scale: 1.5, ease: 'power2.inOut', duration: 1 })
            .to(others, { opacity: 0.2,              ease: 'power2.inOut', duration: 1 }, '<')
            // Return to origin + restore others simultaneously
            .to(card,   { x: 0,  y: 0,  scale: 1,   ease: 'power2.inOut', duration: 1 })
            .to(others, { opacity: 1,                ease: 'power2.inOut', duration: 1 }, '<')
            // Drop z-index after card is back in place
            .set(card, { clearProps: 'zIndex' })
        })
      }

      build()

      // Rebuild on resize (grid may reflow, offsets change)
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
        gsap.set(cards, { clearProps: 'all' })
      }
    })

    return () => mm.revert()
  }, [])

  const setRef = (i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el
  }

  return (
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

        {/* Bento grid — relative+z-0 ensures active card's z-100 stacks correctly within this context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 relative z-0">

          {/* Voucher — wide */}
          <div ref={setRef(0)} className={`md:col-span-2 ${CARD_BASE}`}>
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
          </div>

          {/* PDF Certificates */}
          <div ref={setRef(1)} className={CARD_BASE}>
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
              <FileText className="w-4 h-4 text-gold" />
            </div>
            <h3 className="text-navy-dark font-bold text-base mb-1">Instant PDF certificates</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              PDF generated the moment a candidate passes. Unique ID on every cert.
              Employers can verify on your public link.
            </p>
          </div>

          {/* Proctored */}
          <div ref={setRef(2)} className={CARD_BASE}>
            <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center mb-3">
              <Monitor className="w-4 h-4 text-navy" />
            </div>
            <h3 className="text-navy-dark font-bold text-base mb-1">Proctored environment</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-2">
              Fullscreen lock, tab-switch detection, webcam monitoring.
              No data stored. Just live oversight.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Fullscreen', 'Tab detect', 'Webcam', 'Live view'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-navy bg-navy/8 border border-navy/15 rounded-full px-2.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Negative marking */}
          <div ref={setRef(3)} className={CARD_BASE}>
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4 text-gold" />
            </div>
            <h3 className="text-navy-dark font-bold text-base mb-1">Negative marking</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Set per-exam deductions for wrong answers. Configurable penalty — keeps scoring rigorous.
            </p>
          </div>

          {/* Deep analytics */}
          <div ref={setRef(4)} className={CARD_BASE}>
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
          </div>

        </div>
      </div>
    </section>
  )
}
