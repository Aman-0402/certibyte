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
