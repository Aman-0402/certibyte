import { forwardRef, CSSProperties, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const VALID_ID = 'CB-QN-714X99'

interface Props {
  style?: CSSProperties
}

export const VerificationDemo = forwardRef<HTMLElement, Props>(({ style }, ref) => {
  const reveal = useScrollReveal()
  const [inputValue, setInputValue] = useState(VALID_ID)
  const [result, setResult] = useState<{ valid: boolean } | null>({ valid: true })

  function handleVerify() {
    setResult({ valid: inputValue.trim().toUpperCase() === VALID_ID })
  }

  return (
    <section
      ref={ref}
      className="falling-section fs-verify py-24"
      style={style}
      id="verify"
    >
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy + demo */}
          <div ref={reveal} className="rv">
            <div className="text-xs font-bold tracking-widest text-gold uppercase mb-3">Verify Authenticity</div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-dark mb-4">
              Instant verification lookup services
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              Provide employers and audit organizations with real-time verification status reports.
              Authenticate certificates instantly using the unique cryptographically generated IDs.
            </p>

            {/* Stats */}
            <div className="flex gap-10 mb-10">
              <div>
                <div className="stat-num text-3xl font-bold text-navy-dark" data-target="100" data-suffix="%">0</div>
                <div className="text-sm text-slate-500 mt-1">Self-serve verification</div>
              </div>
              <div>
                <div className="stat-num text-3xl font-bold text-navy-dark" data-target="0" data-suffix=" KB">0</div>
                <div className="text-sm text-slate-500 mt-1">Applicant PII stored publicly</div>
              </div>
            </div>

            {/* Demo */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Certificate ID
              </label>
              <div className="flex gap-3 mb-4">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  className="font-mono"
                  aria-label="Certificate ID"
                />
                <Button onClick={handleVerify} className="bg-navy hover:bg-navy-light text-white flex-shrink-0">
                  Verify
                </Button>
              </div>

              {result !== null && (
                <div
                  className={cn(
                    'flex items-start gap-3 rounded-xl px-4 py-3 border text-sm',
                    result.valid
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800',
                  )}
                >
                  <span className="text-base mt-0.5">{result.valid ? '✓' : '✗'}</span>
                  <div>
                    <strong className="block font-semibold">
                      {result.valid ? 'Credential verified' : 'No matching credential found'}
                    </strong>
                    <p className="text-xs mt-0.5 opacity-80">
                      {result.valid
                        ? 'Issued to Eliza Vance · Quantum Systems & Risk Algorithms'
                        : `Try sample ID ${VALID_ID} for the live demo result.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — certificate card */}
          <div ref={reveal} className="rv hidden lg:block">
            <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-navy px-6 py-4 flex items-center justify-between">
                <span className="text-white text-sm font-bold tracking-wide">CertiByt Verification Authority</span>
                <span className="bg-emerald-400 text-navy-dark text-xs font-bold px-3 py-1 rounded-full">VALID CREDENTIAL</span>
              </div>
              <div className="bg-white px-8 py-10 text-center">
                <div className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-4">Certificate of Recognition</div>
                <h3 className="font-serif text-3xl font-bold text-navy-dark mb-2">ELIZA VANCE</h3>
                <p className="text-slate-500 text-sm mb-4">has demonstrated competency and satisfied all educational standards in</p>
                <div className="text-navy font-bold text-lg mb-8 tracking-wide">QUANTUM SYSTEMS &amp; RISK ALGORITHMS</div>
                <div className="flex justify-center gap-12 text-left border-t border-slate-100 pt-6">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Issued On</div>
                    <div className="text-sm font-semibold text-navy-dark mt-1">26 October 2024</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Verification ID</div>
                    <div className="text-sm font-semibold text-navy-dark font-mono mt-1">{VALID_ID}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})
VerificationDemo.displayName = 'VerificationDemo'
