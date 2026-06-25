import { Ticket, FileText, Monitor, Zap, BarChart2 } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const VOUCHER_CODES = [
  { code: 'ARX-4F2E91', status: 'Used',   statusCls: 'text-slate-400'  },
  { code: 'ARX-B39D02', status: 'Active', statusCls: 'text-emerald-600' },
  { code: 'ARX-CC71A4', status: 'Unused', statusCls: 'text-slate-400'  },
]

const BAR_HEIGHTS = [40, 65, 55, 80, 70, 90, 75]

const CARD_BASE = 'bg-white rounded-2xl border border-slate-100 shadow-sm p-8'

export function PlatformFeatures() {
  const reveal = useScrollReveal()

  return (
    <section className="py-24 bg-slate-50/50" id="platformFeatures">
      <div className="max-w-[1140px] mx-auto px-6">

        {/* Header */}
        <div ref={reveal} className="rv mb-12">
          <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">
            Platform Features
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-dark">
            Everything works out of the box.{' '}
            <span className="text-slate-400">No setup hell.</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Voucher — wide */}
          <div ref={reveal} className={`rv md:col-span-2 ${CARD_BASE}`}>
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center mb-6">
              <Ticket className="w-5 h-5 text-navy" />
            </div>
            <h3 className="text-navy-dark font-bold text-lg mb-2">Voucher-controlled access</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Org admins purchase voucher packages. Each candidate gets a unique ARX-code.
              No code, no exam. Zero unauthorized attempts.
            </p>
            <div className="flex flex-wrap gap-3">
              {VOUCHER_CODES.map(({ code, status, statusCls }) => (
                <div
                  key={code}
                  className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-200"
                >
                  <span className="text-slate-600 text-sm font-mono">{code}</span>
                  <span className={`text-xs font-semibold ${statusCls}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Certificates */}
          <div ref={reveal} className={`rv ${CARD_BASE}`}>
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
              <FileText className="w-5 h-5 text-gold" />
            </div>
            <h3 className="text-navy-dark font-bold text-lg mb-2">Instant PDF certificates</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              PDF generated the moment a candidate passes. Unique ID on every cert.
              Employers can verify on your public link.
            </p>
          </div>

          {/* Proctored */}
          <div ref={reveal} className={`rv ${CARD_BASE}`}>
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center mb-6">
              <Monitor className="w-5 h-5 text-navy" />
            </div>
            <h3 className="text-navy-dark font-bold text-lg mb-2">Proctored environment</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Fullscreen lock, tab-switch detection, webcam monitoring.
              No data stored. Just live oversight.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Fullscreen', 'Tab detect', 'Webcam', 'Live view'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-navy bg-navy/8 border border-navy/15 rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Negative marking */}
          <div ref={reveal} className={`rv ${CARD_BASE}`}>
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
              <Zap className="w-5 h-5 text-gold" />
            </div>
            <h3 className="text-navy-dark font-bold text-lg mb-2">Negative marking</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Set per-exam deductions for wrong answers. Configurable penalty — keeps scoring rigorous.
            </p>
          </div>

          {/* Deep analytics */}
          <div ref={reveal} className={`rv ${CARD_BASE}`}>
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center mb-6">
              <BarChart2 className="w-5 h-5 text-navy" />
            </div>
            <h3 className="text-navy-dark font-bold text-lg mb-2">Deep analytics</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Pass rates, attempt trends, per-question accuracy. Spot weak areas fast. Export-ready.
            </p>
            <div className="flex items-end gap-1.5 h-10">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ height: `${h}%`, backgroundColor: i % 2 === 0 ? '#1e3a8a' : '#b45309' }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
