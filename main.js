// Intersection Observer for Reveal Elements
const rvElements = document.querySelectorAll('.rv');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');

      // Trigger counter animation for all stat counters inside this entry
      const numEls = entry.target.querySelectorAll('.stat-num');
      numEls.forEach(numEl => animateCounter(numEl));
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

rvElements.forEach(el => observer.observe(el));

// ── Hero Exit Animation ──────────────────────────────────────
// As the used-by section scrolls into view, apply .exiting on the hero
// so the left-col content gracefully recedes (opacity + translate up)
const heroSection  = document.getElementById('hero');
const usedBySection = document.getElementById('usedBy');

if (heroSection && usedBySection) {
  const heroExitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Section 2 entering — start hero exit
        heroSection.classList.add('exiting');
      } else {
        // Section 2 leaving (scroll back up) — restore hero
        heroSection.classList.remove('exiting');
      }
    });
  }, {
    threshold: 0.08
  });
  heroExitObserver.observe(usedBySection);
}

// ── Section Divider Lines ─────────────────────────────────────
const dividers = document.querySelectorAll('.section-divider');
const dividerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('vis');
  });
}, { threshold: 0.3 });
dividers.forEach(d => dividerObserver.observe(d));



// Format function matching the CountUp React component spec
function formatCounterValue(val, decimals, separator) {
  return val
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

// Counter Animation
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = "true";
  
  const target = parseFloat(el.dataset.target || '0');
  const decimals = parseInt(el.dataset.decimals || '0');
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const separator = el.dataset.separator || ',';
  const duration = parseFloat(el.dataset.duration || '2000'); // defaults to 2 seconds
  
  const start = 0;
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic function
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = start + (target - start) * easeProgress;
    
    // Format and update content
    el.innerHTML = prefix + formatCounterValue(currentVal, decimals, separator) + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  requestAnimationFrame(updateCounter);
}

// Nav Header Scroll Effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile navbar toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.background = '#ffffff';
    navLinks.style.padding = '20px';
    navLinks.style.borderBottom = '1px solid #e4e7eb';
    navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
  });
}





// Horizontal Scroll Carousel Animation
const carouselSection = document.getElementById('features');
const carouselTrack = document.getElementById('carouselTrack');
const carouselProgressBar = document.getElementById('carouselProgressBar');

if (carouselSection && carouselTrack && carouselProgressBar) {
  let isDesktopMode = window.innerWidth > 768;
  
  function handleCarouselScroll() {
    if (!isDesktopMode) {
      carouselTrack.style.transform = '';
      return;
    }
    
    const rect = carouselSection.getBoundingClientRect();
    const sectionHeight = rect.height;
    const stickyHeight = window.innerHeight;
    
    // Calculate scroll progress inside the tall carousel container [0, 1]
    const scrollDistance = sectionHeight - stickyHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / scrollDistance));
    
    // Calculate horizontal translation limit
    const trackWidth = carouselTrack.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    // Center alignment and offset
    const maxTranslate = Math.max(0, trackWidth - viewportWidth + (viewportWidth * 0.20));
    
    // Smooth translation
    carouselTrack.style.transform = `translateX(${-progress * maxTranslate}px)`;
    
    // Update progress bar width
    carouselProgressBar.style.width = `${progress * 100}%`;
  }
  
  window.addEventListener('scroll', handleCarouselScroll);
  window.addEventListener('resize', () => {
    isDesktopMode = window.innerWidth > 768;
    handleCarouselScroll();
  });
  
  // Run initially
  handleCarouselScroll();
}

// 3D Stacking falling sections animation (scaling down in -Z axis on scroll)
const fallingSections = document.querySelectorAll('.falling-section');

function handleFallingSectionsScroll() {
  const H = window.innerHeight;
  const isDesktopMode = window.innerWidth >= 992;
  
  fallingSections.forEach((section, index) => {
    // If not in desktop mode, reset styles
    if (!isDesktopMode) {
      section.style.transform = '';
      section.style.opacity = '';
      section.style.filter = '';
      return;
    }
    
    // We only animate sections that have a NEXT section to overlap them
    if (index === fallingSections.length - 1) return;
    
    const nextSection = fallingSections[index + 1];
    const nextRect = nextSection.getBoundingClientRect();
    
    // Calculate how far the next section has entered the viewport
    // nextRect.top goes from H (just entering) to 0 (fully covers the current section)
    const enterDistance = H - nextRect.top;
    
    if (enterDistance > 0 && nextRect.top > 0) {
      // Overlap progress from 0 (not overlapped) to 1 (fully overlapped)
      const progress = Math.min(1, Math.max(0, enterDistance / H));
      
      // Map progress to scale down (going in -Z axis)
      const scale = 1 - (progress * 0.08); // shrink to 0.92
      const opacity = 1 - (progress * 0.4); // fade to 0.6
      const translateY = -progress * 40; // slide up slightly
      
      section.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      section.style.opacity = opacity.toString();
      section.style.filter = `brightness(${1 - progress * 0.25})`; // darken slightly
    } else if (nextRect.top <= 0) {
      // Fully covered: set to minimum state
      section.style.transform = 'scale(0.92) translateY(-40px)';
      section.style.opacity = '0.6';
      section.style.filter = 'brightness(0.75)';
    } else {
      // Not covered yet: set to default state
      section.style.transform = '';
      section.style.opacity = '';
      section.style.filter = '';
    }
  });
}

window.addEventListener('scroll', handleFallingSectionsScroll);
window.addEventListener('resize', handleFallingSectionsScroll);

// Run initially
handleFallingSectionsScroll();



