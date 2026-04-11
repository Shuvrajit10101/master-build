// ============================================================
// APEX AUTOMATIONS — Eagle Particle Engine
// Task 2 REDO
//
// Samples the eagle-sketch.png (pencil drawing, dark on white)
// Dark pixels → dense, bright, large gold particles
// Mid-tones   → medium density and brightness
// Light/white → no particles
// ============================================================

class EagleParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(
      window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2,
      1, 1000
    );
    this.camera.position.z = 500;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.particles       = null;
    this.particleCount   = this.getParticleCount();
    this.targetPositions = [];
    this.targetOpacities = [];
    this.targetSizes     = [];
    this.startPositions  = [];
    this.animationStart  = 0;
    this.mouse           = { x: 99999, y: 99999 };
    this.scrollProgress  = 0;

    // One-time reveal flags
    this.titleRevealed  = false;
    this.taglineStarted = false;
    this.scrollRevealed = false;

    window.addEventListener('resize', this.onResize.bind(this));
    if (window.innerWidth > 768) {
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }
    // Touch support for mobile — particles react to finger
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    window.addEventListener('touchend', this.onTouchEnd.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
  }

  // ----------------------------------------------------------
  // Particle count scaled to device
  // ----------------------------------------------------------
  getParticleCount() {
    const w = window.innerWidth;
    if (w < 480) return 3000;
    if (w < 768) return 5000;
    return 12000;
  }

  // ----------------------------------------------------------
  // Load eagle sketch — clean line art sampling
  // Only samples actual ink lines (darkness > 80), ignores white background
  // ----------------------------------------------------------
  async loadEagleShape(imageSrc) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const sampleCanvas = document.createElement('canvas');
        const ctx = sampleCanvas.getContext('2d');

        const sampleSize = 500;
        const aspectRatio = img.width / img.height;
        let sw, sh;
        if (aspectRatio >= 1) {
          sw = sampleSize;
          sh = Math.round(sampleSize / aspectRatio);
        } else {
          sh = sampleSize;
          sw = Math.round(sampleSize * aspectRatio);
        }

        sampleCanvas.width  = sw;
        sampleCanvas.height = sh;
        ctx.drawImage(img, 0, 0, sw, sh);

        const imageData = ctx.getImageData(0, 0, sw, sh);
        const pixels = imageData.data;

        // Clean line art: black lines on white background.
        // Only sample dark pixels (the actual drawn lines).
        // Darkness > 80 means it's a drawn line, not background.
        const candidates = [];

        for (let y = 0; y < sh; y++) {
          for (let x = 0; x < sw; x++) {
            const i = (y * sw + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const brightness = (r + g + b) / 3;
            const darkness   = 255 - brightness;

            if (darkness <= 80) continue; // white/near-white background — skip

            // Darker = bolder line = higher probability
            let probability;
            if (darkness >= 200) {
              probability = 0.95; // very bold lines (beak, eye outline)
            } else if (darkness >= 150) {
              probability = 0.70; // medium lines
            } else {
              probability = 0.40; // light/thin feather strokes
            }

            if (Math.random() < probability) {
              candidates.push({
                x: x - sw / 2,
                y: -(y - sh / 2), // flip Y for Three.js
                darkness
              });
            }
          }
        }

        // Scale eagle to viewport height — smaller on mobile for text room
        let viewportScale;
        let yOffset;
        if (window.innerWidth < 480) {
          viewportScale = (window.innerHeight * 0.30) / sh;
          yOffset = 80;
        } else if (window.innerWidth < 768) {
          viewportScale = (window.innerHeight * 0.38) / sh;
          yOffset = 65;
        } else {
          viewportScale = (window.innerHeight * 0.60) / sh;
          yOffset = 35;
        }

        // Sample candidates to reach particleCount
        let selected = [];
        if (candidates.length >= this.particleCount) {
          // Shuffle and slice
          for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
          }
          selected = candidates.slice(0, this.particleCount);
        } else {
          // Use all, then pad with jittered duplicates
          selected = [...candidates];
          while (selected.length < this.particleCount) {
            const src = candidates[Math.floor(Math.random() * candidates.length)];
            selected.push({
              x:        src.x + (Math.random() - 0.5) * 1.5,
              y:        src.y + (Math.random() - 0.5) * 1.5,
              darkness: src.darkness
            });
          }
        }

        this.targetPositions = [];
        this.targetOpacities = [];
        this.targetSizes     = [];

        for (const pt of selected) {
          this.targetPositions.push({
            x: pt.x * viewportScale,
            y: pt.y * viewportScale + yOffset
          });

          // Darker lines → larger, brighter particles
          const norm = (pt.darkness - 80) / 175; // 0 to 1
          this.targetSizes.push(1.2 + norm * 1.3);        // 1.2 – 2.5
          this.targetOpacities.push(0.55 + norm * 0.45);  // 0.55 – 1.0
        }

        resolve();
      };

      img.onerror = () => {
        console.warn('EagleParticles: image failed to load —', imageSrc);
        this._fallbackShape();
        resolve();
      };

      img.src = imageSrc;
    });
  }

  // ----------------------------------------------------------
  // Fallback: Playfair "A" glyph if image fails
  // ----------------------------------------------------------
  _fallbackShape() {
    const size = 240;
    const oc   = document.createElement('canvas');
    oc.width   = size;
    oc.height  = size;
    const ctx  = oc.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.font      = 'bold 220px "Playfair Display", Georgia, serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', size / 2, size / 2);

    const imgData = ctx.getImageData(0, 0, size, size).data;
    const candidates = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const darkness = 255 - (imgData[idx] + imgData[idx+1] + imgData[idx+2]) / 3;
        if (darkness > 128) {
          candidates.push({ x: x - size / 2, y: -(y - size / 2), tier: 1 });
        }
      }
    }

    const scale  = (window.innerHeight * 0.45) / size;
    this.targetPositions = [];
    this.targetOpacities = [];
    this.targetSizes     = [];

    for (let i = 0; i < this.particleCount; i++) {
      const src = candidates[Math.floor(Math.random() * candidates.length)];
      this.targetPositions.push({ x: src.x * scale, y: src.y * scale + 30 });
      this.targetSizes.push(Math.random() * 1.0 + 1.5);
      this.targetOpacities.push(Math.random() * 0.2 + 0.75);
    }
  }

  // ----------------------------------------------------------
  // Build Three.js BufferGeometry + Points
  // ----------------------------------------------------------
  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors    = new Float32Array(this.particleCount * 3);
    const sizes     = new Float32Array(this.particleCount);

    const goldColors = [
      { r: 0.831, g: 0.659, b: 0.263 }, // #d4a843
      { r: 0.910, g: 0.784, b: 0.416 }, // #e8c86a
      { r: 0.545, g: 0.451, b: 0.208 }, // #8b7335
      { r: 0.769, g: 0.604, b: 0.235 }, // #c49a3c
      { r: 0.941, g: 0.816, b: 0.502 }, // #f0d080
    ];

    this.startPositions = [];

    for (let i = 0; i < this.particleCount; i++) {
      // Scatter start positions
      const sx = (Math.random() - 0.5) * window.innerWidth  * 1.8;
      const sy = (Math.random() - 0.5) * window.innerHeight * 1.8;

      positions[i * 3]     = sx;
      positions[i * 3 + 1] = sy;
      positions[i * 3 + 2] = 0;

      this.startPositions.push({ x: sx, y: sy });

      // Gold color modulated by target opacity (darker = richer gold)
      const color = goldColors[Math.floor(Math.random() * goldColors.length)];
      const boost = this.targetOpacities[i] || 0.5;
      colors[i * 3]     = color.r * (0.6 + boost * 0.4);
      colors[i * 3 + 1] = color.g * (0.6 + boost * 0.4);
      colors[i * 3 + 2] = color.b * (0.6 + boost * 0.4);

      sizes[i] = this.targetSizes[i] || 1.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
    geometry.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: false,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // ----------------------------------------------------------
  // Main animation loop
  // ----------------------------------------------------------
  animate(timestamp) {
    if (!this.animationStart) this.animationStart = timestamp;
    const elapsed = (timestamp - this.animationStart) / 1000; // seconds

    const positions = this.particles.geometry.attributes.position.array;

    for (let i = 0; i < this.particleCount; i++) {
      const target = this.targetPositions[i];
      const start  = this.startPositions[i];
      const idx    = i * 3;
      let x, y;

      if (elapsed < 0.3) {
        // Brief scatter drift
        x = positions[idx]     + (Math.random() - 0.5) * 0.3;
        y = positions[idx + 1] + (Math.random() - 0.5) * 0.3;

      } else if (elapsed < 3.8) {
        // Converge to eagle shape with staggered ease-out-cubic
        const convergeTime = (elapsed - 0.3) / 3.5;
        const stagger = (i / this.particleCount) * 0.25;
        const t       = Math.min(1, Math.max(0, (convergeTime - stagger) / (1 - stagger)));
        const eased   = this.easeOutCubic(t);

        x = start.x + (target.x - start.x) * eased;
        y = start.y + (target.y - start.y) * eased;

      } else {
        // Ambient breathing — gentle oscillation around target
        const breathSpeed  = 0.3 + (i % 13) * 0.05;
        const breathAmount = 1.2;
        x = target.x + Math.sin(elapsed * breathSpeed       + i * 0.08)  * breathAmount;
        y = target.y + Math.cos(elapsed * breathSpeed * 0.6 + i * 0.12) * breathAmount;
      }

      // Mouse/touch repulsion (all screen sizes, smaller radius on mobile)
      {
        const dx   = x - this.mouse.x;
        const dy   = y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = window.innerWidth < 768 ? 50 : 70;
        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * 20;
          x += (dx / dist) * force;
          y += (dy / dist) * force;
        }
      }

      // Scroll spread — particles drift outward from center as user scrolls
      if (this.scrollProgress > 0 && elapsed > 3.8) {
        const spread = this.scrollProgress * 150;
        const angle  = Math.atan2(target.y, target.x);
        x += Math.cos(angle) * spread;
        y += Math.sin(angle) * spread;
      }

      positions[idx]     = x;
      positions[idx + 1] = y;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.material.opacity = Math.max(0.05, 0.9 - this.scrollProgress * 0.85);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));

    // Timed text reveals
    if (elapsed > 3.5 && !this.titleRevealed) {
      this.titleRevealed = true;
      const el = document.getElementById('heroTitle');
      if (el) el.classList.add('visible');
    }
    if (elapsed > 4.3 && !this.taglineStarted) {
      this.taglineStarted = true;
      this.typeTagline();
    }
    if (elapsed > 6.0 && !this.scrollRevealed) {
      this.scrollRevealed = true;
      const el = document.getElementById('heroScroll');
      if (el) el.classList.add('visible');
    }
  }

  // ----------------------------------------------------------
  // Typing effect
  // ----------------------------------------------------------
  typeTagline() {
    const text   = 'Your Business, On Autopilot';
    const el     = document.getElementById('heroTagline');
    if (!el) return;

    el.classList.add('visible');
    let charIdx  = 0;
    const cursor = '<span class="typing-cursor"></span>';

    const interval = setInterval(() => {
      charIdx++;
      el.innerHTML = text.substring(0, charIdx) + cursor;
      if (charIdx >= text.length) {
        clearInterval(interval);
        setTimeout(() => { el.textContent = text; }, 2500);
      }
    }, 50);
  }

  // ----------------------------------------------------------
  // Event handlers
  // ----------------------------------------------------------
  onResize() {
    this.camera.left   =  window.innerWidth  / -2;
    this.camera.right  =  window.innerWidth  /  2;
    this.camera.top    =  window.innerHeight /  2;
    this.camera.bottom = -window.innerHeight /  2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(e) {
    this.mouse.x =   e.clientX - window.innerWidth  / 2;
    this.mouse.y = -(e.clientY - window.innerHeight / 2);
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      this.mouse.x = e.touches[0].clientX - window.innerWidth / 2;
      this.mouse.y = -(e.touches[0].clientY - window.innerHeight / 2);
    }
  }

  onTouchEnd() {
    this.mouse.x = 99999;
    this.mouse.y = 99999;
  }

  onScroll() {
    this.scrollProgress = Math.min(1, window.scrollY / window.innerHeight);
    const heroContent   = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity   = Math.max(0, 1 - this.scrollProgress * 1.5).toString();
      heroContent.style.transform = `translateY(-${this.scrollProgress * 40}px)`;
    }
  }

  // ----------------------------------------------------------
  // Entry point
  // ----------------------------------------------------------
  async init(imageSrc) {
    await this.loadEagleShape(imageSrc);
    this.createParticles();
    requestAnimationFrame(this.animate.bind(this));
  }
}
