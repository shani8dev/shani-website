document.addEventListener('DOMContentLoaded', () => {
  // Enhanced mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  const menuOverlay = document.createElement('div');
  menuOverlay.className = 'menu-overlay';
  document.body.appendChild(menuOverlay);

  const toggleMenu = () => {
    const isOpen = navList.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuOverlay.style.display = isOpen ? 'block' : 'none';
  };

  menuToggle.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', toggleMenu);

  // Smooth scroll with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#!') return;
      
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      const headerHeight = document.querySelector('.header').offsetHeight;
      const offsetTop = target.offsetTop - headerHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      if (navList.classList.contains('active')) toggleMenu();
    });
  });

  // Intersection Observer for active navigation
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = { threshold: 0.4 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Dynamic year
  const yearElem = document.querySelector('#copyright-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
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

  // Toggle "Learn More" in feature cards
  document.querySelectorAll('.toggle-details').forEach(button => {
    button.addEventListener('click', () => {
      const details = button.nextElementSibling;
      details.classList.toggle('hidden');
      button.textContent = details.classList.contains('hidden')
        ? 'Learn More'
        : 'Show Less';
    });
  });

  // Toggle the hidden Installation section from the hero's "How to Install?" button
  const installSection = document.getElementById('installation');
  const installToggleBtn = document.querySelector('.toggle-install');

  if (installSection && installToggleBtn) {
    installToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = installSection.classList.contains('hidden');
      
      // If it's hidden, unhide it, scroll to it, change text to "Hide Installation"
      if (isHidden) {
        installSection.classList.remove('hidden');
        installToggleBtn.setAttribute('aria-expanded', true);
        installToggleBtn.innerHTML = '<i class="fas fa-tools"></i> Hide Installation';

        // Now scroll to it
        const headerHeight = document.querySelector('.header').offsetHeight;
        const offsetTop = installSection.offsetTop - headerHeight;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      } else {
        // If it's visible, hide it, revert text to "How to Install?"
        installSection.classList.add('hidden');
        installToggleBtn.setAttribute('aria-expanded', false);
        installToggleBtn.innerHTML = '<i class="fas fa-tools"></i> How to Install?';
      }
    });
  }
});

