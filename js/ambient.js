(function() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -9999, y: -9999, active: false };

  // Particle count: enough to be visible, not enough to overpower the eagle
  const PARTICLE_COUNT = window.innerWidth < 768 ? 280 : 700;
  const SCATTER_RADIUS = 120;
  const SCATTER_FORCE = 8;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 3, // spread across scrollable area
        baseX: 0, // will be set after creation
        baseY: 0,
        vx: 0,
        vy: 0,
        size: Math.random() * 2.2 + 1.0,       // 1.0 - 3.2px
        baseOpacity: Math.random() * 0.3 + 0.22, // 0.22 - 0.52
        opacity: 0,
        driftSpeedX: (Math.random() - 0.5) * 0.4,
        driftSpeedY: (Math.random() - 0.5) * 0.3 - 0.05,
        // Gold color variation
        colorType: Math.floor(Math.random() * 3)
      });
    }
    // Set base positions (home position they drift back to after scatter)
    for (const p of particles) {
      p.baseX = p.x;
      p.baseY = p.y;
    }
  }

  function getColor(type, opacity) {
    // Calculate scroll progress across total page height
    var scrollY = window.scrollY || 0;
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var progress = Math.min(1, scrollY / maxScroll);

    // Color transition: Gold (top) → Purple (middle) → Blue (bottom)
    var r, g, b;

    if (progress < 0.5) {
      // Gold → Purple (0% to 50% scroll)
      var t = progress / 0.5;
      // Gold: 212, 168, 67 → Purple: 124, 58, 237
      r = Math.round(212 + (124 - 212) * t);
      g = Math.round(168 + (58 - 168) * t);
      b = Math.round(67 + (237 - 67) * t);
    } else {
      // Purple → Blue (50% to 100% scroll)
      var t = (progress - 0.5) / 0.5;
      // Purple: 124, 58, 237 → Blue: 37, 99, 235
      r = Math.round(124 + (37 - 124) * t);
      g = Math.round(58 + (99 - 58) * t);
      b = Math.round(237 + (235 - 237) * t);
    }

    // Add variation per particle type so not all are identical
    switch(type) {
      case 0:
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
      case 1:
        // Slightly lighter version
        return 'rgba(' + Math.min(255, r + 30) + ', ' + Math.min(255, g + 30) + ', ' + Math.min(255, b + 20) + ', ' + opacity + ')';
      case 2:
        // Slightly dimmer version
        return 'rgba(' + Math.round(r * 0.7) + ', ' + Math.round(g * 0.7) + ', ' + Math.round(b * 0.7) + ', ' + opacity + ')';
      default:
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const scrollY = window.scrollY || 0;

    for (const p of particles) {
      // Natural slow drift
      p.x += p.driftSpeedX;
      p.y += p.driftSpeedY;

      // Calculate screen position (account for scroll)
      const screenY = p.y - scrollY;

      // Only process particles visible on screen (with buffer)
      if (screenY < -50 || screenY > height + 50) {
        // Wrap particles that drift off screen
        if (p.y < scrollY - 100) p.y += height * 3;
        if (p.y > scrollY + height + 100) p.y -= height * 3;
        continue;
      }

      // Wrap horizontally
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      // Mouse/touch scatter interaction
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = screenY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < SCATTER_RADIUS && dist > 0) {
          // Push particles away from cursor
          const force = (1 - dist / SCATTER_RADIUS) * SCATTER_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Apply velocity with friction (particles slow down after scatter)
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92; // friction — particles decelerate smoothly
      p.vy *= 0.92;

      // Gently drift back toward base position over time
      const returnForce = 0.003;
      p.x += (p.baseX - p.x) * returnForce;
      p.y += (p.baseY - p.y) * returnForce;

      // Subtle opacity shimmer
      p.opacity = p.baseOpacity + Math.sin(Date.now() * 0.001 + p.baseX) * 0.05;

      // Draw the particle
      ctx.beginPath();
      ctx.arc(p.x, screenY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = getColor(p.colorType, Math.max(0, p.opacity));
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  // Mouse events (desktop)
  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }

  function onMouseLeave() {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }

  // Touch events (mobile)
  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }

  function onTouchEnd() {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }

  // Event listeners
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd);

  resize();
  createParticles();
  animate();
})();
