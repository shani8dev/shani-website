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

    // Backdrop — purely visual, no pointer events so links are never blocked
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-overlay';
    backdrop.style.pointerEvents = 'none';
    document.body.appendChild(backdrop);

    const closeMenu = () => {
      navList.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      backdrop.style.display = 'none';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };

    const openMenu = () => {
      navList.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      backdrop.style.display = 'block';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      const firstFocusable = navList.querySelector('a, button');
      if (firstFocusable) firstFocusable.focus();
    };

      const toggleMenu = () =>
      navList.classList.contains('active') ? closeMenu() : openMenu();

      menuToggle.addEventListener('click', e => {
        e.stopPropagation();
        toggleMenu();
      });

      // Close when tapping outside nav panel — direct document listener, no overlay needed
      const outsideTap = e => {
        if (!navList.classList.contains('active')) return;
        if (navList.contains(e.target) || menuToggle.contains(e.target)) return;
        closeMenu();
      };
      document.addEventListener('touchstart', outsideTap, { passive: true });
      document.addEventListener('click', outsideTap);

      // Close on any nav-link tap
      navList.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => closeMenu());
        link.addEventListener('touchend', () => closeMenu());
      });

      // Close on Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navList.classList.contains('active')) {
          closeMenu();
          menuToggle.focus();
        }
      });

      // Focus trap
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
            btn.innerHTML = '<i class="fas fa-xmark"></i> Close Guide';
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
            btn.innerHTML = '<i class="fas fa-screwdriver-wrench"></i> Installation Guide';
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
        const allBtns = card.querySelectorAll('.toggle-details');

        if (front && back) {
          if (!isFlipped) {
            // Now showing back
            front.style.pointerEvents = 'none';
            back.style.pointerEvents  = 'auto';
            allBtns.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
          } else {
            // Now showing front
            front.style.pointerEvents = 'auto';
            back.style.pointerEvents  = 'none';
            back.scrollTop = 0;
            allBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
          }
        }
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
     *  HOW-STEPS TOGGLE — "Show step-by-step details"
     * ==================================================== */
    const howStepsToggle  = document.querySelector('.how-steps-toggle');
    const howStepsContent = document.getElementById('how-steps-content');

    if (howStepsToggle && howStepsContent) {
      howStepsToggle.addEventListener('click', () => {
        const isOpen = howStepsToggle.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          // Close
          howStepsContent.hidden = true;
          howStepsToggle.setAttribute('aria-expanded', 'false');
          howStepsToggle.querySelector('.how-steps-toggle-label').textContent = 'Show step-by-step details';
        } else {
          // Open — reveal content
          howStepsContent.hidden = false;
          howStepsToggle.setAttribute('aria-expanded', 'true');
          howStepsToggle.querySelector('.how-steps-toggle-label').textContent = 'Hide step-by-step details';

          // Cards inside were hidden from the observer — mark them visible now
          howStepsContent.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            el.classList.add('visible');
          });

          // Smooth scroll to content
          requestAnimationFrame(() => {
            window.scrollTo({
              top: howStepsContent.getBoundingClientRect().top + window.scrollY - getStickyOffset() - 16,
                            behavior: 'smooth',
            });
          });
        }
      });
    }

    /* =====================================================
     *  FEATURES SHOW-ALL TOGGLE
     *  Replaces the fragile inline onclick on the button.
     * ==================================================== */
    const featuresBtn   = document.getElementById('features-show-all');
    const featuresExtra = document.getElementById('features-extra');

    if (featuresBtn && featuresExtra) {
      // Ensure we start in a known state
      featuresExtra.style.display = 'none';
      featuresExtra.setAttribute('aria-hidden', 'true');

      featuresBtn.addEventListener('click', () => {
        const isHidden = featuresExtra.style.display === 'none';

        if (isHidden) {
          featuresExtra.style.display = '';
          featuresExtra.removeAttribute('aria-hidden');
          featuresBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show fewer features';

          // Cards were invisible while parent was display:none — mark visible now
          featuresExtra.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            el.classList.add('visible');
          });
        } else {
          featuresExtra.style.display = 'none';
          featuresExtra.setAttribute('aria-hidden', 'true');
          featuresBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Show all features (6 more groups)';
        }
      });

      // Remove the old inline onclick to avoid double-firing
      featuresBtn.removeAttribute('onclick');
    }

    /* =====================================================
     *  COPYRIGHT YEAR
     * ==================================================== */
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    console.log('%cShanios – Immutable by Design', 'font-size:20px;color:#ff7f50');

  /* =====================================================
   *  NAV DROPDOWN ("More" menu)
   * ==================================================== */
  const moreBtn = document.querySelector('.nav-more-btn');
  const dropdownMenu = document.querySelector('.nav-dropdown-menu');

  if (moreBtn && dropdownMenu) {
    const closeDropdown = () => {
      dropdownMenu.classList.remove('open');
      moreBtn.setAttribute('aria-expanded', 'false');
    };

    const openDropdown = () => {
      dropdownMenu.classList.add('open');
      moreBtn.setAttribute('aria-expanded', 'true');
    };

    moreBtn.addEventListener('click', e => {
      e.stopPropagation();
      dropdownMenu.classList.contains('open') ? closeDropdown() : openDropdown();
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!moreBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close when any dropdown link is clicked
    dropdownMenu.querySelectorAll('.nav-dropdown-item').forEach(item => {
      item.addEventListener('click', () => closeDropdown());
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDropdown();
    });
  }



});
