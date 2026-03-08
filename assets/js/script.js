document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
   *  UTILITY — shared sticky offset calculation
   * ==================================================== */
  const getStickyOffset = () => {
    const header   = document.querySelector('.header');
    const blessing = document.querySelector('.top-blessing');
    return (header?.offsetHeight || 0) + (blessing?.offsetHeight || 0) + 10;
  };

  /* =====================================================
   *  MOBILE MENU
   * ==================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navList    = document.querySelector('.nav-list');

  if (menuToggle && navList) {
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);

    const closeMenu = () => {
      navList.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuOverlay.style.display = 'none';
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      navList.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuOverlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
      const firstFocusable = navList.querySelector('a, button');
      if (firstFocusable) firstFocusable.focus();
    };

      const toggleMenu = () =>
      navList.classList.contains('active') ? closeMenu() : openMenu();

      menuToggle.addEventListener('click', toggleMenu);
      menuOverlay.addEventListener('click', closeMenu);

      // Close on any internal nav-link click
      navList.addEventListener('click', e => {
        if (e.target.closest('.nav-link')) closeMenu();
      });

        // Close on Escape, return focus to toggle
        document.addEventListener('keydown', e => {
          if (e.key === 'Escape' && navList.classList.contains('active')) {
            closeMenu();
            menuToggle.focus();
          }
        });

        // Live focus trap (handles dynamically shown/hidden items)
        const getFocusables = () =>
        [...navList.querySelectorAll('a, button')].filter(
          el => !el.hasAttribute('disabled') && el.offsetParent !== null
        );

        navList.addEventListener('keydown', e => {
          if (e.key !== 'Tab' || !navList.classList.contains('active')) return;
          const focusables = getFocusables();
          if (!focusables.length) return;
          const first = focusables[0];
          const last  = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        });
  }

  /* =====================================================
   *  SMOOTH SCROLL WITH HEADER OFFSET
   *  Uses getBoundingClientRect for accuracy after
   *  dynamic content (install section) opens/closes.
   * ==================================================== */
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - getStickyOffset(),
                    behavior: 'smooth',
    });
  });

  /* =====================================================
   *  ACTIVE NAV LINK (INTERSECTION OBSERVER)
   * ==================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length && navLinks.length) {
    let lastActiveId = null;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (lastActiveId === id) return;
        lastActiveId = id;

        navLinks.forEach(link =>
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
        );
      });
    }, {
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0,
    });

    sections.forEach(s => observer.observe(s));
  }

  /* =====================================================
   *  INSTALLATION SECTION TOGGLE
   *
   *  Drives visibility through inline style (authoritative).
   *  class="hidden" kept only as a state marker.
   * ==================================================== */
  const installSection       = document.getElementById('installation');
  const installToggles       = document.querySelectorAll('.toggle-install');
  const installButtonSection = document.querySelector('.show-installation-guide');

  if (installSection && installToggles.length) {
    installSection.style.display = 'none';
    installSection.classList.add('hidden');

    installToggles.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        const isHidden = installSection.style.display === 'none';

        if (isHidden) {
          installSection.style.display = '';
          installSection.classList.remove('hidden');
          if (installButtonSection) installButtonSection.classList.add('hidden');

          installToggles.forEach(btn => {
            btn.setAttribute('aria-expanded', 'true');
            btn.innerHTML = '<i class="fas fa-times"></i> Close Guide';
          });

          window.scrollTo({
            top: installSection.getBoundingClientRect().top + window.scrollY - getStickyOffset(),
                          behavior: 'smooth',
          });
        } else {
          installSection.style.display = 'none';
          installSection.classList.add('hidden');
          if (installButtonSection) installButtonSection.classList.remove('hidden');

          installToggles.forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<i class="fas fa-tools"></i> Installation Guide';
          });
        }
      });
    });
  }

  /* =====================================================
   *  SCROLL EFFECTS — rAF throttled (replaces setTimeout)
   *  • body.scrolled triggers the FAB group via CSS
   *  • header shadow deepens on scroll
   * ==================================================== */
  const header = document.querySelector('.header');
  let rafPending = false;

  const onScroll = () => {
    rafPending = false;
    const y = window.scrollY;

    document.body.classList.toggle('scrolled', y > 300);

    if (header) {
      header.style.boxShadow = y > 50
      ? '0 4px 12px rgba(0,0,0,.18)'
      : '0 2px 8px rgba(0,0,0,.1)';
    }
  };

  window.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll(); // run once on load

  /* =====================================================
   *  LAZY IMAGE FADE-IN
   * ==================================================== */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load',  () => img.classList.add('loaded'));
        img.addEventListener('error', () => img.classList.add('loaded')); // prevent stuck fade
      }
    });
  }

  /* =====================================================
   *  FEATURE CARD FLIP ANIMATION
   * ==================================================== */
  document.querySelectorAll('.toggle-details').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const card = this.closest('.feature-card');
      if (!card) return;

      const isFlipped = card.classList.contains('flipped');
      card.classList.toggle('flipped');
      this.setAttribute('aria-expanded', String(!isFlipped));

      // Reset back-face scroll when closing
      if (isFlipped) {
        const back = card.querySelector('.feature-card-back');
        if (back) back.scrollTop = 0;
      }
    });
  });


  /* =====================================================
   *  SCROLL REVEAL
   *  Adds .reveal to sections and grid cards,
   *  then uses IntersectionObserver to add .visible
   * ==================================================== */
  const revealTargets = [
    ...document.querySelectorAll('.section'),
                          ...document.querySelectorAll('.feature-card, .usecase-card, .pain-card, .support-card, .about-card, .download-card, .how-step, .faq-item, .stat-item'),
  ];

  revealTargets.forEach(el => el.classList.add('reveal'));

  // Stagger siblings inside grids
  document.querySelectorAll('.feature-grid, .usecase-grid, .support-grid, .about-grid, .how-steps').forEach(grid => {
    [...grid.children].forEach((child, i) => child.style.setProperty('--i', i));
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* =====================================================
   *  COPYRIGHT YEAR
   * ==================================================== */
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  console.log('%cShanios – Immutable by Design', 'font-size:20px;color:#ff7f50');
});
