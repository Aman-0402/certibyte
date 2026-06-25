import { useState, useEffect, useRef, RefObject, CSSProperties } from 'react'

const EMPTY: CSSProperties = {}

export function useFallingSections(
  refs: RefObject<HTMLElement | null>[],
): CSSProperties[] {
  const refsRef = useRef(refs)
  refsRef.current = refs

  const [styles, setStyles] = useState<CSSProperties[]>(() =>
    refs.map(() => EMPTY),
  )

  useEffect(() => {
    function handle() {
      const viewportHeight = window.innerHeight
      const isDesktop = window.innerWidth >= 992
      const currentRefs = refsRef.current

      setStyles(
        currentRefs.map((ref, i) => {
          if (!ref.current || !isDesktop || i === currentRefs.length - 1)
            return EMPTY

          const next = currentRefs[i + 1]?.current
          if (!next) return EMPTY

          const nextRect = next.getBoundingClientRect()
          const enterDistance = viewportHeight - nextRect.top

          if (enterDistance > 0 && nextRect.top > 0) {
            const p = Math.min(1, Math.max(0, enterDistance / viewportHeight))
            return {
              transform: `scale(${1 - p * 0.08}) translateY(${-p * 40}px)`,
              opacity: String(1 - p * 0.4),
              filter: `brightness(${1 - p * 0.25})`,
            }
          }
          if (nextRect.top <= 0) {
            return {
              transform: 'scale(0.92) translateY(-40px)',
              opacity: '0.6',
              filter: 'brightness(0.75)',
            }
          }
          return EMPTY
        }),
      )
    }

    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle, { passive: true })
    handle()
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [])

  return styles
}
