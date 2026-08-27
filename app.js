(function () {
  'use strict';

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var storedTheme = null;
  try {
    storedTheme = window.localStorage.getItem('inshelp-theme');
  } catch (e) {}
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : prefersDark ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function paintToggle() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.innerHTML =
      theme === 'dark'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  paintToggle();
  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      try {
        window.localStorage.setItem('inshelp-theme', theme);
      } catch (e) {}
      paintToggle();
    });
  }

  /* ---------- Sticky header hide/show ---------- */
  var header = document.querySelector('.header');
  var lastY = window.scrollY;
  window.addEventListener(
    'scroll',
    function () {
      var y = window.scrollY;
      if (!header) return;
      header.classList.toggle('header--scrolled', y > 8);
      if (y > lastY && y > 160) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
      lastY = y;
    },
    { passive: true }
  );

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  var mobileClose = document.querySelector('[data-mobile-close]');
  function closePanel() {
    if (mobilePanel) mobilePanel.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', function () {
      mobilePanel.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose) mobileClose.addEventListener('click', closePanel);
  if (mobilePanel) {
    mobilePanel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closePanel);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- Contact form (mailto submit) ---------- */
  var form = document.querySelector('[data-contact-form]');
  var successNote = document.querySelector('[data-form-success]');
  if (form) {
    form.addEventListener('submit', function () {
      if (successNote) {
        successNote.classList.add('is-visible');
        successNote.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* ---------- Current year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
