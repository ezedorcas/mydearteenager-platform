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

  // 3. Ultra-Smooth Bi-Directional Scroll Reveal Animations
  if ('IntersectionObserver' in window) {
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';

    window.addEventListener(
      'scroll',
      () => {
        const currentScrollY = window.scrollY;
        scrollDirection = currentScrollY < lastScrollY ? 'up' : 'down';
        lastScrollY = currentScrollY;
      },
      { passive: true }
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;

          if (entry.isIntersecting) {
            // Adapt entrance direction to match scroll motion
            if (scrollDirection === 'up') {
              el.classList.add('from-top');
            } else {
              el.classList.remove('from-top');
            }
            el.classList.add('is-visible');
          } else {
            // When an element leaves the viewport buffer, allow smooth re-reveal
            const rect = entry.boundingClientRect;
            if (rect.top > window.innerHeight + 50 || rect.bottom < -50) {
              el.classList.remove('is-visible');
            }
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px'
      }
    );

    // Target clean, non-nested content blocks to eliminate compound transform jitter
    const revealTargets = document.querySelectorAll(
      '.features-box, ' +
      '.discover-h3, .discover-box, ' +
      '.build-box, .big-box, .box-1, .box-2, ' +
      '.learning-loop-box, .curiosity-options .option, ' +
      '.watch-yourself-box, .your-growth-box, ' +
      '.lead-box, .opportunities-hub-box, .grid-box-2 > div, ' +
      '.parents-inner-box, .teen-inner-box, ' +
      '.final, .footer-inner'
    );

    revealTargets.forEach((el) => {
      el.classList.add('reveal-on-scroll');
      revealObserver.observe(el);
    });

    // Make hero section visible immediately so initial page load is seamless
    const greetingsBox = document.querySelector('.greetings-box');
    if (greetingsBox) {
      greetingsBox.classList.add('reveal-on-scroll', 'is-visible');
    }
  }

  // 4. Smooth Page Transition for CTA Buttons leading to auth.html
  const ctaLinks = document.querySelectorAll('a[href^="auth.html"]');
  ctaLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Allow standard browser tab shortcuts (Ctrl/Cmd/Shift click)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      const targetUrl = link.getAttribute('href');

      // Visual press animation on the clicked link
      link.classList.add('cta-btn-launching');

      // Trigger smooth exit transition on page body
      document.body.classList.add('page-transition-exit');

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 240);
    });
  });
});
