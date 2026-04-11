// ============================================================
// APEX AUTOMATIONS — Sections Scroll Animations
// Task 3: What We Do + Featured Work + CTA + Color Shift
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger);

  // ── Background Color Shift ──
  // body transitions: black → dark navy → dark purple as user scrolls
  gsap.to('body', {
    scrollTrigger: {
      trigger: '#what-we-do',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    backgroundColor: '#0c0a14',
    ease: 'none'
  });

  gsap.to('body', {
    scrollTrigger: {
      trigger: '#featured-work',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    backgroundColor: '#0e0a1e',
    ease: 'none'
  });

  gsap.to('body', {
    scrollTrigger: {
      trigger: '#cta',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    backgroundColor: '#0a0c1e',
    ease: 'none'
  });

  // ── Section Labels & Headings ──
  gsap.utils.toArray('.section-label, .section-heading').forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // ── What We Do Cards ──
  gsap.utils.toArray('.wwd-card').forEach(function (card, i) {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: i * 0.15,
      ease: 'power2.out'
    });
  });

  // ── Featured Work Items ──
  gsap.utils.toArray('.fw-item').forEach(function (item, i) {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: i * 0.15,
      ease: 'power2.out'
    });
  });

  // ── CTA Section ──
  gsap.utils.toArray('[data-animate="cta"]').forEach(function (el, i) {
    gsap.to(el, {
      scrollTrigger: {
        trigger: '#cta',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.2,
      ease: 'power2.out'
    });
  });

});
