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
