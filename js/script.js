/**
 * VLSI Technology Insights - Master JavaScript
 * Lightweight, accessible interactions for static blog website
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNav();
  initBackToTop();
  initReadingProgressBar();
  initSmoothScrollOffsets();
});

/**
 * Mobile Navigation Drawer & Hamburger Toggle
 */
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('is-open', !isExpanded);
  });

  // Close menu when clicking on any navigation link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    });
  });

  // Close menu on click outside
  document.addEventListener('click', (event) => {
    if (
      navMenu.classList.contains('is-open') &&
      !navMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    }
  });

  // Close menu with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      menuToggle.focus();
    }
  });
}

/**
 * Automatically set active nav link based on current page URL
 */
function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.toLowerCase();

  navLinks.forEach((link) => {
    const href = link.getAttribute('href').toLowerCase();

    // Remove existing hardcoded active if another matches specifically
    const isHome = (currentPath.endsWith('/') || currentPath.endsWith('index.html')) && (href === 'index.html' || href === './');
    const isExactMatch = currentPath.endsWith(href) && href !== 'index.html' && href !== './';
    const isArticlePage = currentPath.includes('nmos-cmos') && href === 'blogs.html';

    if (isHome || isExactMatch || isArticlePage) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

/**
 * Floating Back To Top button behavior
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Reading progress indicator for technical articles
 */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const scrollPercent = (window.scrollY / docHeight) * 100;
      progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    }
  }, { passive: true });
}

/**
 * Smooth scroll with sticky navbar offset compensation
 */
function initSmoothScrollOffsets() {
  const jumpLinks = document.querySelectorAll('a[href^="#"]');
  const navHeight = 80;

  jumpLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without abrupt jump
        history.pushState(null, null, targetId);
      }
    });
  });
}
