import { Ticket, FileText, Monitor, Zap, BarChart2 } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const VOUCHER_CODES = [
  { code: 'ARX-4F2E91', status: 'Used',   color: 'text-slate-400' },
  { code: 'ARX-B39D02', status: 'Active', color: 'text-teal-400'  },
  { code: 'ARX-CC71A4', status: 'Unused', color: 'text-slate-500' },
]

const BAR_HEIGHTS = [40, 65, 55, 80, 70, 90, 75]

export function PlatformFeatures() {
  const reveal = useScrollReveal()

  return (
    <section className="py-24 bg-[#0d1523]" id="platformFeatures">
      <div className="max-w-[1140px] mx-auto px-6">

        {/* Header */}
        <div ref={reveal} className="rv mb-12">
          <div className="text-xs font-bold tracking-widest text-teal-400 uppercase mb-4">
            Platform Features
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white">
            Everything works out of the box.{' '}
            <span className="text-slate-500">No setup hell.</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Voucher — wide */}
          <div
            ref={reveal}
            className="rv md:col-span-2 bg-[#131c2e] rounded-2xl p-8 border border-white/5"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center mb-6">
              <Ticket className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Voucher-controlled access</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Org admins purchase voucher packages. Each candidate gets a unique ARX-code.
              No code, no exam. Zero unauthorized attempts.
            </p>
            <div className="flex flex-wrap gap-3">
              {VOUCHER_CODES.map(({ code, status, color }) => (
                <div
                  key={code}
                  className="flex items-center gap-3 bg-[#0d1523] rounded-lg px-4 py-2.5 border border-white/5"
                >
                  <span className="text-slate-300 text-sm font-mono">{code}</span>
                  <span className={`text-xs font-semibold ${color}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Certificates */}
          <div ref={reveal} className="rv bg-[#131c2e] rounded-2xl p-8 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-6">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Instant PDF certificates</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              PDF generated the moment a candidate passes. Unique ID on every cert.
              Employers can verify on your public link.
            </p>
          </div>

          {/* Proctored */}
          <div ref={reveal} className="rv bg-[#131c2e] rounded-2xl p-8 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center mb-6">
              <Monitor className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Proctored environment</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Fullscreen lock, tab-switch detection, webcam monitoring.
              No data stored. Just live oversight.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Fullscreen', 'Tab detect', 'Webcam', 'Live view'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Negative marking */}
          <div ref={reveal} className="rv bg-[#131c2e] rounded-2xl p-8 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center mb-6">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Negative marking</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Set per-exam deductions for wrong answers. Configurable penalty — keeps scoring rigorous.
            </p>
          </div>

          {/* Deep analytics */}
          <div ref={reveal} className="rv bg-[#131c2e] rounded-2xl p-8 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center mb-6">
              <BarChart2 className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Deep analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Pass rates, attempt trends, per-question accuracy. Spot weak areas fast. Export-ready.
            </p>
            <div className="flex items-end gap-1.5 h-10">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-violet-500/60"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
