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
