/**
 * MyDear Teenager - Landing Page Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Header Navigation Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileBtn.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileBtn.classList.remove('active');
      });
    });
  }

  // 2. Mobile Footer Accordion Toggle
  const accordionBtns = document.querySelectorAll('.footer-accordion-btn');

  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        const column = btn.closest('.footer-column');
        const isActive = column.classList.contains('active');

        // Close other open accordion columns for a clean drawer feel
        document.querySelectorAll('.footer-column').forEach(col => {
          if (col !== column) {
            col.classList.remove('active');
            const otherBtn = col.querySelector('.footer-accordion-btn');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        column.classList.toggle('active', !isActive);
        btn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      }
    });
  });

  // 3. Scroll-Triggered Fade & Slide-In Reveal Animations
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    // Target elements across sections for smooth scroll entrance
    const revealTargets = document.querySelectorAll(
      '.greetings-box, .features-box, .discover-section, .build-section, .learning-loop-section, .progress-section, .opportunities-section, .parents-section, .final-section, .footer, .option, .competitions-grid, .socholarships-grid, .events-grid, .opportunity-hub-grid, .box-1, .box-2, .big-box, .parents-inner-box, .teen-inner-box'
    );

    revealTargets.forEach(el => {
      el.classList.add('reveal-on-scroll');
      revealObserver.observe(el);
    });
  }
});
