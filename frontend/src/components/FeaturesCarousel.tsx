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
