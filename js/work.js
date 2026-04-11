// ============================================================
// APEX AUTOMATIONS — Work Page Animations
// Task 4: Portfolio + Services + Packages
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger);

  // ── Work Hero ──
  gsap.from('.work-hero', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power2.out'
  });

  // ── Section Labels & Headings ──
  gsap.utils.toArray('#services .section-label, #services .section-heading, #packages .section-label, #packages .section-heading').forEach(function (el) {
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

  // ── Portfolio Cards ──
  gsap.utils.toArray('[data-animate="portfolio"]').forEach(function (card, i) {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.2,
      ease: 'power2.out'
    });
  });

  // ── Service Cards ──
  gsap.utils.toArray('[data-animate="service"]').forEach(function (card, i) {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out'
    });
  });

  // ── Package Cards ──
  gsap.utils.toArray('[data-animate="package"]').forEach(function (card, i) {
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

});
