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
