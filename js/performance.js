(function() {

  // ── Lazy load off-screen sections ──
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50px', threshold: 0.1 });

    document.querySelectorAll('.section').forEach(function(section) {
      observer.observe(section);
    });
  }

  // ── Reduce particles on low-end devices ──
  function isLowEndDevice() {
    // Check for low memory
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
    // Check for slow CPU
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
    return false;
  }

  if (isLowEndDevice()) {
    document.documentElement.classList.add('low-end-device');
  }

  // ── Page visibility — pause animations when tab is hidden ──
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      document.documentElement.classList.add('tab-hidden');
    } else {
      document.documentElement.classList.remove('tab-hidden');
    }
  });

  // ── Smooth page load transition ──
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';

  window.addEventListener('load', function() {
    document.body.style.opacity = '1';
  });

  // ── Smooth page exit transition ──
  document.querySelectorAll('a').forEach(function(link) {
    var href = link.getAttribute('href');
    // Only apply to internal page links
    if (href && (href.endsWith('.html') || href === 'index.html' || href === 'work.html' || href === 'contact.html') && !link.getAttribute('target')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var destination = this.getAttribute('href');
        document.body.style.opacity = '0';
        setTimeout(function() {
          window.location.href = destination;
        }, 300);
      });
    }
  });

})();
