import { useEffect, useMemo } from 'react'
import certibyteMarkup from './certibyte.html?raw'
import './certibyte.css'

function formatCounterValue(value, decimals, separator) {
  return value
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

function animateCounter(element) {
  if (element.dataset.animated) return

  element.dataset.animated = 'true'

  const target = parseFloat(element.dataset.target || '0')
  const decimals = parseInt(element.dataset.decimals || '0', 10)
  const prefix = element.dataset.prefix || ''
  const suffix = element.dataset.suffix || ''
  const separator = element.dataset.separator || ','
  const duration = parseFloat(element.dataset.duration || '2000')
  const startTime = performance.now()

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    const currentValue = target * easeProgress

    element.innerHTML =
      prefix + formatCounterValue(currentValue, decimals, separator) + suffix

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  requestAnimationFrame(updateCounter)
}

function App() {
  const pageMarkup = useMemo(() => {
    const bodyMatch = certibyteMarkup.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    const bodyMarkup = bodyMatch ? bodyMatch[1] : certibyteMarkup

    return bodyMarkup.replace(/<script[\s\S]*?<\/script>/gi, '')
  }, [])

  useEffect(() => {
    const nav = document.getElementById('nav')
    const navToggle = document.getElementById('navToggle')
    const navLinks = document.querySelector('.nav-links')
    const heroSection = document.getElementById('hero')
    const usedBySection = document.getElementById('usedBy')
    const carouselSection = document.getElementById('features')
    const carouselTrack = document.getElementById('carouselTrack')
    const carouselProgressBar = document.getElementById('carouselProgressBar')
    const fallingSections = document.querySelectorAll('.falling-section')

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add('vis')
          entry.target
            .querySelectorAll('.stat-num')
            .forEach((numEl) => animateCounter(numEl))
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    )

    document.querySelectorAll('.rv').forEach((element) => {
      revealObserver.observe(element)
    })

    const heroExitObserver =
      heroSection && usedBySection
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                heroSection.classList.toggle('exiting', entry.isIntersecting)
              })
            },
            { threshold: 0.08 },
          )
        : null

    if (heroExitObserver) {
      heroExitObserver.observe(usedBySection)
    }

    const dividerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('vis')
        })
      },
      { threshold: 0.3 },
    )

    document.querySelectorAll('.section-divider').forEach((divider) => {
      dividerObserver.observe(divider)
    })

    const handleNavScroll = () => {
      if (!nav) return
      nav.classList.toggle('scrolled', window.scrollY > 50)
    }

    const handleNavToggle = () => {
      navLinks?.classList.toggle('mobile-open')
    }

    const handleCarouselScroll = () => {
      if (!carouselSection || !carouselTrack || !carouselProgressBar) return

      if (window.innerWidth <= 768) {
        carouselTrack.style.transform = ''
        carouselProgressBar.style.width = ''
        return
      }

      const rect = carouselSection.getBoundingClientRect()
      const scrollDistance = rect.height - window.innerHeight
      const progress = Math.min(1, Math.max(0, -rect.top / scrollDistance))
      const trackWidth = carouselTrack.scrollWidth
      const viewportWidth = window.innerWidth
      const maxTranslate = Math.max(
        0,
        trackWidth - viewportWidth + viewportWidth * 0.2,
      )

      carouselTrack.style.transform = `translateX(${
        -progress * maxTranslate
      }px)`
      carouselProgressBar.style.width = `${progress * 100}%`
    }

    const handleFallingSectionsScroll = () => {
      const viewportHeight = window.innerHeight
      const isDesktopMode = window.innerWidth >= 992

      fallingSections.forEach((section, index) => {
        if (!isDesktopMode) {
          section.style.transform = ''
          section.style.opacity = ''
          section.style.filter = ''
          return
        }

        if (index === fallingSections.length - 1) return

        const nextSection = fallingSections[index + 1]
        const nextRect = nextSection.getBoundingClientRect()
        const enterDistance = viewportHeight - nextRect.top

        if (enterDistance > 0 && nextRect.top > 0) {
          const progress = Math.min(
            1,
            Math.max(0, enterDistance / viewportHeight),
          )
          const scale = 1 - progress * 0.08
          const opacity = 1 - progress * 0.4
          const translateY = -progress * 40

          section.style.transform = `scale(${scale}) translateY(${translateY}px)`
          section.style.opacity = opacity.toString()
          section.style.filter = `brightness(${1 - progress * 0.25})`
        } else if (nextRect.top <= 0) {
          section.style.transform = 'scale(0.92) translateY(-40px)'
          section.style.opacity = '0.6'
          section.style.filter = 'brightness(0.75)'
        } else {
          section.style.transform = ''
          section.style.opacity = ''
          section.style.filter = ''
        }
      })
    }

    window.addEventListener('scroll', handleNavScroll)
    window.addEventListener('scroll', handleCarouselScroll)
    window.addEventListener('scroll', handleFallingSectionsScroll)
    window.addEventListener('resize', handleCarouselScroll)
    window.addEventListener('resize', handleFallingSectionsScroll)
    navToggle?.addEventListener('click', handleNavToggle)

    handleNavScroll()
    handleCarouselScroll()
    handleFallingSectionsScroll()

    return () => {
      revealObserver.disconnect()
      heroExitObserver?.disconnect()
      dividerObserver.disconnect()
      window.removeEventListener('scroll', handleNavScroll)
      window.removeEventListener('scroll', handleCarouselScroll)
      window.removeEventListener('scroll', handleFallingSectionsScroll)
      window.removeEventListener('resize', handleCarouselScroll)
      window.removeEventListener('resize', handleFallingSectionsScroll)
      navToggle?.removeEventListener('click', handleNavToggle)
    }
  }, [])

  return <div dangerouslySetInnerHTML={{ __html: pageMarkup }} />
}

export default App
