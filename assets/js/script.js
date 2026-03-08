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
      document.documentElement.style.overflow = '';
    };

    const openMenu = () => {
      navList.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuOverlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      const firstFocusable = navList.querySelector('a, button');
      if (firstFocusable) firstFocusable.focus();
    };

      const toggleMenu = () =>
      navList.classList.contains('active') ? closeMenu() : openMenu();

      menuToggle.addEventListener('click', toggleMenu);

      menuOverlay.addEventListener('click', e => {
        if (!navList.contains(e.target)) closeMenu();
      });

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

          // Live focus trap
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
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));
  }

  /* =====================================================
   *  INSTALLATION SECTION TOGGLE
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
   *  SCROLL EFFECTS — rAF throttled
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

  onScroll();

  /* =====================================================
   *  LAZY IMAGE FADE-IN
   * ==================================================== */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load',  () => img.classList.add('loaded'));
        img.addEventListener('error', () => img.classList.add('loaded'));
      }
    });
  }

  /* =====================================================
   *  FEATURE CARD FLIP ANIMATION
   *  — pointer-events toggled so hidden face never blocks clicks
   *  — works on desktop (3D flip) and mobile (show/hide)
   * ==================================================== */

  // Initialise: back faces must not intercept clicks at load
  document.querySelectorAll('.feature-card').forEach(card => {
    const back = card.querySelector('.feature-card-back');
    if (back) back.style.pointerEvents = 'none';
  });

    document.querySelectorAll('.toggle-details').forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const card = this.closest('.feature-card');
        if (!card) return;

        const isFlipped = card.classList.contains('flipped');
        card.classList.toggle('flipped');

        const front = card.querySelector('.feature-card-front');
        const back  = card.querySelector('.feature-card-back');
        if (front && back) {
          if (!isFlipped) {
            // Now showing back
            front.style.pointerEvents = 'none';
            back.style.pointerEvents  = 'auto';
          } else {
            // Now showing front
            front.style.pointerEvents = 'auto';
            back.style.pointerEvents  = 'none';
            back.scrollTop = 0;
          }
        }

        this.setAttribute('aria-expanded', String(!isFlipped));
      });
    });

    /* =====================================================
     *  SCROLL REVEAL
     *  — Only cards/items get .reveal, NOT parent sections.
     *    Sections being opacity:0 would hide headings too.
     *  — Includes ALL card types site-wide for consistency.
     * ==================================================== */
    const revealTargets = [
      ...document.querySelectorAll([
        '.feature-card',
        '.usecase-card',
        '.pain-card',
        '.support-card',
        '.about-card',
        '.download-card',
        '.how-step',
        '.faq-item',
        '.stat-item',
        '.roadmap-card',
        '.opportunity-card',
        '.pricing-card',
      ].join(', ')),
    ];

    revealTargets.forEach(el => el.classList.add('reveal'));

    // Set stagger index --i for grids
    const staggerGrids = [
      '.feature-grid',
      '.usecase-grid',
      '.support-grid',
      '.about-grid',
      '.how-steps',
      '.roadmap-grid',
      '.opportunity-grid',
      '.pricing-grid',
      '.stats-grid',
      '.pain-grid',
    ];
    document.querySelectorAll(staggerGrids.join(', ')).forEach(grid => {
      [...grid.children].forEach((child, i) => child.style.setProperty('--i', i));
    });

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px 0px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));

    /* =====================================================
     *  COPYRIGHT YEAR
     * ==================================================== */
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    console.log('%cShanios – Immutable by Design', 'font-size:20px;color:#ff7f50');
});
