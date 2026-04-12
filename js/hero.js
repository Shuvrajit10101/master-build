document.addEventListener('DOMContentLoaded', function() {
  var eagle = new EagleParticles('hero-canvas');
  eagle.init('assets/Fierce eagle in line art (2).png');

  // Failsafe — if tagline hasn't appeared after 7 seconds, force show it
  setTimeout(function() {
    var title = document.getElementById('heroTitle');
    var tagline = document.getElementById('heroTagline');
    var scroll = document.getElementById('heroScroll');

    if (title && !title.classList.contains('visible')) {
      title.classList.add('visible');
    }

    if (tagline && tagline.innerHTML === '') {
      tagline.classList.add('visible');
      var text = 'Your Business, On Autopilot';
      var idx = 0;
      var cursor = '<span class="typing-cursor"></span>';
      var interval = setInterval(function() {
        idx++;
        tagline.innerHTML = text.substring(0, idx) + cursor;
        if (idx >= text.length) {
          clearInterval(interval);
          setTimeout(function() { tagline.innerHTML = text; }, 2500);
        }
      }, 50);
    }

    if (scroll && !scroll.classList.contains('visible')) {
      scroll.classList.add('visible');
    }
  }, 7000);
});
