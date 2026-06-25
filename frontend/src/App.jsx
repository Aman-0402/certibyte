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
    const heroCard = document.querySelector('.hero-cert-card')
    const heroStateEls = {
      stage: document.querySelector('[data-hero-stage]'),
      title: document.querySelector('[data-hero-title]'),
      meta: document.querySelector('[data-hero-meta]'),
      metricOne: document.querySelector('[data-hero-metric-one]'),
      labelOne: document.querySelector('[data-hero-label-one]'),
      metricTwo: document.querySelector('[data-hero-metric-two]'),
      labelTwo: document.querySelector('[data-hero-label-two]'),
      metricThree: document.querySelector('[data-hero-metric-three]'),
      labelThree: document.querySelector('[data-hero-label-three]'),
      badgeLabel: document.querySelector('[data-hero-badge-label]'),
      badgeValue: document.querySelector('[data-hero-badge-value]'),
      footnoteLabel: document.querySelector('[data-hero-footnote-label]'),
      footnoteValue: document.querySelector('[data-hero-footnote-value]'),
    }
    const verifyInput = document.getElementById('verifyId')
    const verifyButton = document.getElementById('verifyButton')
    const verifyResult = document.getElementById('verifyResult')
    const heroStates = [
      {
        stage: 'VOUCHER REDEEMED',
        title: 'AWS Cloud Practitioner',
        meta: 'Rahul Sharma · Access token accepted',
        metricOne: 'CB-9X2',
        labelOne: 'Voucher',
        metricTwo: 'READY',
        labelTwo: 'Status',
        metricThree: '1',
        labelThree: 'Attempt',
        badgeLabel: 'Identity checked',
        badgeValue: 'Candidate verified',
        footnoteLabel: 'Queue',
        footnoteValue: '14 exams ready',
      },
      {
        stage: 'EXAM IN PROGRESS',
        title: 'AWS Cloud Practitioner',
        meta: 'Rahul Sharma · Secure browser active',
        metricOne: '42m',
        labelOne: 'Remaining',
        metricTwo: 'LIVE',
        labelTwo: 'Status',
        metricThree: '0',
        labelThree: 'Flags',
        badgeLabel: 'Exam in progress',
        badgeValue: '14 candidates live',
        footnoteLabel: 'This month',
        footnoteValue: '847 certs issued',
      },
      {
        stage: 'SCORE CALCULATED',
        title: 'AWS Cloud Practitioner',
        meta: 'Rahul Sharma · Submitted 14 Jun 2025',
        metricOne: '84%',
        labelOne: 'Score',
        metricTwo: 'PASS',
        labelTwo: 'Result',
        metricThree: '38m',
        labelThree: 'Duration',
        badgeLabel: 'Evaluation complete',
        badgeValue: 'Negative marking applied',
        footnoteLabel: 'Audit trail',
        footnoteValue: 'All events sealed',
      },
      {
        stage: 'CERTIFICATE ISSUED',
        title: 'AWS Cloud Practitioner',
        meta: 'Rahul Sharma · ID CB-QN-714X99',
        metricOne: 'PDF',
        labelOne: 'Credential',
        metricTwo: 'VALID',
        labelTwo: 'Lookup',
        metricThree: '<1s',
        labelThree: 'Issued',
        badgeLabel: 'Credential live',
        badgeValue: 'Ready for employer audit',
        footnoteLabel: 'Verify ID',
        footnoteValue: 'CB-QN-714X99',
      },
    ]
    let heroStateIndex = 0
    let heroStateInterval

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

    const applyHeroState = (state) => {
      if (!heroCard || !heroStateEls.stage) return

      heroCard.classList.add('is-shifting')
      window.setTimeout(() => heroCard.classList.remove('is-shifting'), 360)

      Object.entries(state).forEach(([key, value]) => {
        const element = heroStateEls[key]
        if (element) element.textContent = value
      })
    }

    const rotateHeroState = () => {
      heroStateIndex = (heroStateIndex + 1) % heroStates.length
      applyHeroState(heroStates[heroStateIndex])
    }

    const handleVerify = () => {
      if (!verifyInput || !verifyResult) return

      const value = verifyInput.value.trim().toUpperCase()
      const isValid = value === 'CB-QN-714X99'
      const title = verifyResult.querySelector('strong')
      const body = verifyResult.querySelector('p')

      verifyResult.classList.toggle('is-valid', isValid)

      if (title) {
        title.textContent = isValid
          ? 'Credential verified'
          : 'No matching credential found'
      }

      if (body) {
        body.textContent = isValid
          ? 'Issued to Eliza Vance · Quantum Systems & Risk Algorithms'
          : 'Try sample ID CB-QN-714X99 for the live demo result.'
      }
    }

    const handleVerifyKeydown = (event) => {
      if (event.key === 'Enter') handleVerify()
    }

    window.addEventListener('scroll', handleNavScroll)
    window.addEventListener('scroll', handleCarouselScroll)
    window.addEventListener('scroll', handleFallingSectionsScroll)
    window.addEventListener('resize', handleCarouselScroll)
    window.addEventListener('resize', handleFallingSectionsScroll)
    navToggle?.addEventListener('click', handleNavToggle)
    verifyButton?.addEventListener('click', handleVerify)
    verifyInput?.addEventListener('keydown', handleVerifyKeydown)

    handleNavScroll()
    handleCarouselScroll()
    handleFallingSectionsScroll()
    applyHeroState(heroStates[0])
    heroStateInterval = window.setInterval(rotateHeroState, 2600)

    return () => {
      window.clearInterval(heroStateInterval)
      revealObserver.disconnect()
      heroExitObserver?.disconnect()
      dividerObserver.disconnect()
      window.removeEventListener('scroll', handleNavScroll)
      window.removeEventListener('scroll', handleCarouselScroll)
      window.removeEventListener('scroll', handleFallingSectionsScroll)
      window.removeEventListener('resize', handleCarouselScroll)
      window.removeEventListener('resize', handleFallingSectionsScroll)
      navToggle?.removeEventListener('click', handleNavToggle)
      verifyButton?.removeEventListener('click', handleVerify)
      verifyInput?.removeEventListener('keydown', handleVerifyKeydown)
    }
  }, [])

  return <div dangerouslySetInnerHTML={{ __html: pageMarkup }} />
}

export default App
