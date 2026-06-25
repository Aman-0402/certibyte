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
