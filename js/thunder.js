(function() {

  var canvas = document.createElement('canvas');
  canvas.id = 'thunder-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Create a natural lightning branch
  function buildBranch(x, y, angle, length, depth, maxDepth) {
    if (depth > maxDepth || length < 8) return [];

    var segments = [];
    var points = [{ x: x, y: y }];
    var stepSize = 6 + Math.random() * 4;
    var steps = Math.floor(length / stepSize);
    var curX = x;
    var curY = y;
    var curAngle = angle;

    for (var i = 0; i < steps; i++) {
      // Natural wander — angle drifts slightly each step
      curAngle += (Math.random() - 0.5) * 0.6;

      curX += Math.cos(curAngle) * stepSize;
      curY += Math.sin(curAngle) * stepSize;

      // Small perpendicular jitter for organic feel
      curX += (Math.random() - 0.5) * 8;
      curY += (Math.random() - 0.5) * 4;

      points.push({ x: curX, y: curY });

      // Natural branching — gets less likely deeper in the tree
      var branchChance = depth === 0 ? 0.12 : (depth === 1 ? 0.08 : 0.04);
      if (Math.random() < branchChance && i > 2) {
        var branchAngle = curAngle + (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.8);
        var branchLength = length * (0.25 + Math.random() * 0.35);
        var subBranches = buildBranch(curX, curY, branchAngle, branchLength, depth + 1, maxDepth);
        segments = segments.concat(subBranches);
      }
    }

    segments.push({ points: points, depth: depth });
    return segments;
  }

  // Generate one natural lightning strike
  function generateNaturalStrike() {
    // Start from random point along the top
    var startX = width * (0.1 + Math.random() * 0.8);
    var startY = 0;

    // Main bolt goes roughly downward with slight angle
    var mainAngle = Math.PI / 2 + (Math.random() - 0.5) * 0.5; // mostly downward
    var mainLength = height * (0.45 + Math.random() * 0.4);

    return buildBranch(startX, startY, mainAngle, mainLength, 0, 3);
  }

  // Render with natural glow layers
  function renderBolt(segments, opacity) {
    for (var s = 0; s < segments.length; s++) {
      var seg = segments[s];
      var pts = seg.points;
      var depth = seg.depth;

      if (!pts || pts.length < 2) continue;

      // Layer 1: Soft distant glow — very wide, very faint purple-blue
      drawPath(pts, 'rgba(150, 150, 220, ' + (0.12 * opacity * Math.max(0.2, 1 - depth * 0.25)) + ')',
        Math.max(2, 20 - depth * 5));

      // Layer 2: Medium atmospheric glow
      drawPath(pts, 'rgba(180, 180, 240, ' + (0.2 * opacity * Math.max(0.2, 1 - depth * 0.25)) + ')',
        Math.max(1, 11 - depth * 3));

      // Layer 3: Inner bright glow
      drawPath(pts, 'rgba(220, 220, 255, ' + (0.45 * opacity * Math.max(0.15, 1 - depth * 0.3)) + ')',
        Math.max(0.8, 5 - depth * 1.2));

      // Layer 4: White hot core
      drawPath(pts, 'rgba(255, 255, 255, ' + (0.85 * opacity * Math.max(0.1, 1 - depth * 0.2)) + ')',
        Math.max(0.5, 2.5 - depth * 0.6));
    }
  }

  function drawPath(points, color, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  // Slow, natural lightning animation cycle
  function strike() {
    var segments = generateNaturalStrike();

    // Phase 1: Fade in slowly (200ms)
    var startTime = performance.now();
    var fadeInDuration = 60;
    var holdDuration = 80;
    var fadeOutDuration = 180;
    var totalDuration = fadeInDuration + holdDuration + fadeOutDuration;

    // 30% chance of a gentle second pulse
    var doublePulse = Math.random() < 0.5;
    var secondSegments = doublePulse ? generateNaturalStrike() : null;
    var secondDelay = totalDuration + 80;
    var secondTotal = doublePulse ? secondDelay + totalDuration : totalDuration;

    function animateFrame(now) {
      var elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      // First bolt
      if (elapsed < totalDuration) {
        var opacity;
        if (elapsed < fadeInDuration) {
          opacity = elapsed / fadeInDuration;
        } else if (elapsed < fadeInDuration + holdDuration) {
          opacity = 1;
        } else {
          opacity = 1 - (elapsed - fadeInDuration - holdDuration) / fadeOutDuration;
        }
        opacity = Math.max(0, Math.min(1, opacity));
        renderBolt(segments, opacity);

        // Very subtle background flash
        if (opacity > 0.5) {
          ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.04 * opacity) + ')';
          ctx.fillRect(0, 0, width, height);
        }
      }

      // Second pulse (if active)
      if (doublePulse && elapsed >= secondDelay && elapsed < secondDelay + totalDuration) {
        var elapsed2 = elapsed - secondDelay;
        var opacity2;
        if (elapsed2 < fadeInDuration) {
          opacity2 = elapsed2 / fadeInDuration;
        } else if (elapsed2 < fadeInDuration + holdDuration) {
          opacity2 = 1;
        } else {
          opacity2 = 1 - (elapsed2 - fadeInDuration - holdDuration) / fadeOutDuration;
        }
        opacity2 = Math.max(0, Math.min(1, opacity2)) * 0.7; // second pulse dimmer
        renderBolt(secondSegments, opacity2);
      }

      if (elapsed < secondTotal) {
        requestAnimationFrame(animateFrame);
      } else {
        ctx.clearRect(0, 0, width, height);
        // Schedule next strike — natural gap 3 to 7 seconds
        var nextDelay = 1500 + Math.random() * 2500;
        setTimeout(strike, nextDelay);
      }
    }

    requestAnimationFrame(animateFrame);
  }

  // Start after initial delay
  setTimeout(strike, 1000);

})();
