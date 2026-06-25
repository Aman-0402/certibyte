import { useRef } from 'react'
import { Navbar }           from './components/Navbar'
import { Hero }             from './components/Hero'
import { TrustedBy }        from './components/TrustedBy'
import { FeaturesCarousel } from './components/FeaturesCarousel'
import { PlatformFeatures } from './components/PlatformFeatures'
import { Workflow }         from './components/Workflow'
import { VerificationDemo } from './components/VerificationDemo'
import { OrgHub }           from './components/OrgHub'
import { Testimonials }     from './components/Testimonials'
import { CTA }              from './components/CTA'
import { Footer }           from './components/Footer'
import { useFallingSections } from './hooks/useFallingSections'

export default function App() {
  const verifyRef = useRef<HTMLElement>(null)
  const orgRef    = useRef<HTMLElement>(null)
  const testiRef  = useRef<HTMLElement>(null)
  const ctaRef    = useRef<HTMLElement>(null)

  const fallingStyles = useFallingSections([verifyRef, orgRef, testiRef, ctaRef])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <FeaturesCarousel />
        <PlatformFeatures />
        <Workflow />
        <VerificationDemo ref={verifyRef} style={fallingStyles[0]} />
        <OrgHub           ref={orgRef}    style={fallingStyles[1]} />
        <Testimonials     ref={testiRef}  style={fallingStyles[2]} />
        <CTA              ref={ctaRef}    style={fallingStyles[3]} />
      </main>
      <Footer />
    </>
  )
}
