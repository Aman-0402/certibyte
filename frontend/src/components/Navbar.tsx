import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useNavScroll } from '@/hooks/useNavScroll'

export function Navbar() {
  const scrolled = useNavScroll()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '#features', label: 'Platform Overview' },
    { href: '#workflow', label: 'How It Works' },
    { href: '#store',    label: 'Exam Store' },
    { href: '#verify',   label: 'Verify Certificate' },
  ]

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 border-b border-slate-200 backdrop-blur-md transition-all duration-300',
        scrolled ? 'bg-white/95 shadow-sm py-0' : 'bg-white/90 py-0',
      )}
    >
      <div className="max-w-[1140px] mx-auto px-6 flex items-center justify-between h-16">
        <a href="#" className="font-serif text-2xl font-bold text-navy-dark tracking-tight flex-shrink-0">
          Certi<span className="text-gold">Byt</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-sm font-medium text-slate-600 hover:text-navy-dark transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-600">Login</Button>
          <Button
            variant="outline"
            size="sm"
            className="border-navy text-navy hover:bg-navy hover:text-white"
          >
            Register
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 ml-auto"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-[2px] bg-navy-dark" />
          <span className="block w-5 h-[2px] bg-navy-dark" />
          <span className="block w-5 h-[2px] bg-navy-dark" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-slate-600 hover:text-navy-dark"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm">Login</Button>
            <Button variant="outline" size="sm" className="border-navy text-navy">Register</Button>
          </div>
        </div>
      )}
    </nav>
  )
}
