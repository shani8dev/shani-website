document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     MOBILE MENU
  ===================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (menuToggle && navList) {
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);

    const toggleMenu = () => {
      const isOpen = navList.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuOverlay.style.display = isOpen ? 'block' : 'none';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navList.classList.contains('active')) toggleMenu();
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navList.classList.contains('active')) {
        toggleMenu();
      }
    });

    // Focus trap
    const focusables = navList.querySelectorAll('a, button');
    if (focusables.length) {
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      navList.addEventListener('keydown', e => {
        if (e.key !== 'Tab' || !navList.classList.contains('active')) return;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }
  }


  // Back to Top
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  });

  /* =====================================================
     SMOOTH SCROLL WITH HEADER OFFSET
  ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const header = document.querySelector('.header');
      const blessing = document.querySelector('.top-blessing');

      const offset =
        (header?.offsetHeight || 0) +
        (blessing?.offsetHeight || 0);

      window.scrollTo({
        top: target.offsetTop - offset - 10,
        behavior: 'smooth'
      });
    });
  });

  /* =====================================================
     ACTIVE NAV LINK (INTERSECTION OBSERVER)
  ===================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      });
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));
  }


/* =====================================================
   INSTALLATION SECTION TOGGLE (FIXED)
===================================================== */
const installSection = document.getElementById('installation');
const installToggles = document.querySelectorAll('.toggle-install');

if (installSection && installToggles.length) {
  installToggles.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();

      const isOpen = !installSection.classList.toggle('hidden');

      installToggles.forEach(btn => {
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.innerHTML = isOpen
          ? '<i class="fas fa-times"></i> Close Guide'
          : '<i class="fas fa-tools"></i> Installation Guide';
      });

      if (isOpen) {
        const header = document.querySelector('.header');
        const blessing = document.querySelector('.top-blessing');

        const offset =
          (header?.offsetHeight || 0) +
          (blessing?.offsetHeight || 0);

        window.scrollTo({
          top: installSection.offsetTop - offset - 10,
          behavior: 'smooth'
        });
      }
    });
  });
}


  /* =====================================================
     SCROLL EFFECTS (HEADER SHADOW + BACK TO TOP)
  ===================================================== */
  const header = document.querySelector('.header');
  let scrollTimeout;

  const onScroll = () => {
    document.body.classList.toggle('scrolled', window.scrollY > 300);

    if (header) {
      header.style.boxShadow =
        window.scrollY > 50
          ? '0 4px 12px rgba(0,0,0,.15)'
          : '0 2px 8px rgba(0,0,0,.1)';
    }
  };

  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(onScroll, 50);
  });

  onScroll();

  /* =====================================================
     LAZY IMAGE FADE-IN
  ===================================================== */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.complete
        ? img.classList.add('loaded')
        : img.addEventListener('load', () => img.classList.add('loaded'));
    });
  }

/* ======================================================
  Flip Animation
  ======================================================= */

document.querySelectorAll('.toggle-details').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    
    const card = this.closest('.feature-card');
    const isFlipped = card.classList.contains('flipped');
    
    card.classList.toggle('flipped');
    // Text is already set in HTML
    this.setAttribute('aria-expanded', String(!isFlipped));
    
    // Reset scroll position when flipping back to front
    if (!card.classList.contains('flipped')) {
      const back = card.querySelector('.feature-card-back');
      if (back) back.scrollTop = 0;
    }
  });
});

  /* =====================================================
     COPYRIGHT YEAR
  ===================================================== */
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();

  console.log('%cShanios – Immutable by Design', 'font-size:20px;color:#ff7f50');
});

