import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useHeroRotation } from '@/hooks/useHeroRotation'

export function Hero() {
  const reveal = useScrollReveal()
  const { state, isShifting } = useHeroRotation()
  const sectionRef = useRef<HTMLElement>(null)
  const [cardScale, setCardScale] = useState(0.28)

  useEffect(() => {
    function handle() {
      const section = sectionRef.current
      if (!section) return
      // Scale from 0.28 → 1 over the first 55% of the hero height
      const scrolled = window.scrollY
      const threshold = section.offsetHeight * 0.55
      const progress = Math.min(1, Math.max(0, scrolled / threshold))
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCardScale(0.28 + (1 - 0.28) * eased)
    }
    window.addEventListener('scroll', handle, { passive: true })
    handle()
    return () => window.removeEventListener('scroll', handle)
  }, [])

  const metrics = [
    [state.metricOne,   state.labelOne],
    [state.metricTwo,   state.labelTwo],
    [state.metricThree, state.labelThree],
  ] as const

  return (
    <section
      ref={sectionRef}
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
          <div
            className="hero-card-scaler relative w-full max-w-[340px]"
            // eslint-disable-next-line react/forbid-dom-props
            style={{ '--card-scale': cardScale } as React.CSSProperties}
          >
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
