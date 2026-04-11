/* ============================================
   APEX AUTOMATIONS — Navigation Logic
   ============================================ */

(function () {
  'use strict';

  var hamburger = document.querySelector('.nav-hamburger');
  var overlay   = document.querySelector('.nav-overlay');
  var navLinks  = document.querySelectorAll('.nav-link');
  var body      = document.body;

  if (!hamburger || !overlay) return;

  /* ----------------------------------------
     Current Page Indicator
     Compares each link's href to the current
     page filename and marks the match.
  ---------------------------------------- */
  function setCurrentPage() {
    // Get the last segment of the path (e.g. "work.html")
    var rawPath = window.location.pathname.split('/').pop();
    // Treat empty string (root / direct file open) as index.html
    var currentPage = rawPath === '' ? 'index.html' : rawPath;

    navLinks.forEach(function (link) {
      var linkPage = link.getAttribute('href').split('/').pop();
      if (linkPage === currentPage) {
        link.classList.add('is-current');
      }
    });
  }

  /* ----------------------------------------
     Open Overlay
  ---------------------------------------- */
  function openMenu() {
    hamburger.classList.add('is-open');
    overlay.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden'; // Prevent background scroll
  }

  /* ----------------------------------------
     Close Overlay
  ---------------------------------------- */
  function closeMenu() {
    hamburger.classList.remove('is-open');
    overlay.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  /* ----------------------------------------
     Toggle
  ---------------------------------------- */
  function toggleMenu() {
    if (hamburger.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /* ----------------------------------------
     Event Listeners
  ---------------------------------------- */

  // Hamburger click
  hamburger.addEventListener('click', toggleMenu);

  // Close when a nav link is clicked (before navigation)
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* ----------------------------------------
     Initialize
  ---------------------------------------- */
  setCurrentPage();

})();
