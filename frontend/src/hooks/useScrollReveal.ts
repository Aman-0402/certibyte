import { useCallback, useEffect, useRef } from 'react'

function animateCounter(el: HTMLElement) {
  if (el.dataset.animated) return
  el.dataset.animated = 'true'

  const target = parseFloat(el.dataset.target ?? '0')
  const decimals = parseInt(el.dataset.decimals ?? '0', 10)
  const prefix = el.dataset.prefix ?? ''
  const suffix = el.dataset.suffix ?? ''
  const separator = el.dataset.separator ?? ','
  const duration = parseFloat(el.dataset.duration ?? '2000')
  const startTime = performance.now()

  function update(now: number) {
    const progress = Math.min((now - startTime) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    const value = (target * ease)
      .toFixed(decimals)
      .replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    el.innerHTML = prefix + value + suffix
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

export function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('vis')
            ;(entry.target as HTMLElement)
              .querySelectorAll<HTMLElement>('.stat-num')
              .forEach(animateCounter)
            observerRef.current?.unobserve(entry.target)
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
      )
    }
    return observerRef.current
  }, [])

  useEffect(() => {
    return () => observerRef.current?.disconnect()
  }, [])

  return useCallback(
    (el: HTMLElement | null) => {
      if (el) getObserver().observe(el)
    },
    [getObserver],
  )
}
