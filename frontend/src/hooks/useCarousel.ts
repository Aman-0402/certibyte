import { useState, useEffect, RefObject } from 'react'

export interface CarouselState {
  progress: number
  maxTranslate: number
}

export function useCarousel(
  sectionRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
): CarouselState {
  const [state, setState] = useState<CarouselState>({ progress: 0, maxTranslate: 0 })

  useEffect(() => {
    function handle() {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track || window.innerWidth <= 768) {
        setState({ progress: 0, maxTranslate: 0 })
        return
      }
      const rect = section.getBoundingClientRect()
      const scrollDistance = rect.height - window.innerHeight
      if (scrollDistance <= 0) {
        setState({ progress: 0, maxTranslate: 0 })
        return
      }
      const p = Math.min(1, Math.max(0, -rect.top / scrollDistance))
      const maxT = Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.2)
      setState({ progress: p, maxTranslate: maxT })
    }

    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle, { passive: true })
    handle()
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [sectionRef, trackRef])

  return state
}
