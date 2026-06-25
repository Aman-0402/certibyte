const FOOTER_LINKS = [
  {
    head: 'Platform',
    links: ['Solutions Overview', 'Public Stores', 'Verify Lookup'],
  },
  {
    head: 'Resources',
    links: ['Documentation', 'API Integration', 'Fee Structure'],
  },
  {
    head: 'Compliance',
    links: ['Privacy Standards', 'Terms of Use'],
  },
]

export function Footer() {
  return (
    <footer className="bg-navy-dark text-slate-400 py-16 border-t border-white/5">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 mb-12">
          <div className="flex-shrink-0 max-w-[240px]">
            <div className="font-serif text-2xl font-bold text-white mb-3">
              Certi<span className="text-gold">Byt</span>
            </div>
            <p className="text-sm leading-relaxed">Academic security solutions and voucher validation systems.</p>
          </div>

          <div className="flex flex-wrap gap-12 flex-1 justify-end">
            {FOOTER_LINKS.map(({ head, links }) => (
              <div key={head}>
                <div className="text-xs font-bold tracking-widest text-white uppercase mb-4">{head}</div>
                <div className="flex flex-col gap-3">
                  {links.map((label) => (
                    <a key={label} href="#" className="text-sm hover:text-white transition-colors">
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm">
          <span>© 2026 CertiByt. All rights reserved.</span>
          <div className="flex gap-6">
            {['Twitter', 'LinkedIn', 'GitHub'].map((s) => (
              <a key={s} href="#" className="hover:text-white transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
