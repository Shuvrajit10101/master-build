(function() {

  // ── Disable right-click context menu ──
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  // ── Disable keyboard shortcuts for view source / inspect ──
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
    // Ctrl+S (Save Page)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+C (Element Inspector)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
  });

  // ── Disable drag on images and canvases ──
  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'CANVAS') {
      e.preventDefault();
    }
  });

  // ── Disable text selection on non-form elements ──
  // Allow selection on inputs, textareas, and select elements
  document.addEventListener('selectstart', function(e) {
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      return true;
    }
    // Allow selection on elements with contenteditable
    if (e.target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    return false;
  });

  // ── Console warning message ──
  if (typeof console !== 'undefined') {
    console.log(
      '%c⚠ STOP',
      'color: #d4a843; font-size: 48px; font-weight: bold; text-shadow: 2px 2px 0 #000;'
    );
    console.log(
      '%cThis browser feature is intended for developers. If someone told you to copy-paste something here, it is a scam.',
      'color: #a0a0a0; font-size: 16px;'
    );
    console.log(
      '%c© Apex Automations — apexautomations.com',
      'color: #d4a843; font-size: 12px;'
    );
  }

  // ── Add rel="noopener noreferrer" to all external links ──
  var links = document.querySelectorAll('a[target="_blank"]');
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute('rel', 'noopener noreferrer');
  }

  // ── Detect DevTools open (basic) ──
  var devToolsOpen = false;
  var threshold = 160;
  setInterval(function() {
    var widthDiff = window.outerWidth - window.innerWidth > threshold;
    var heightDiff = window.outerHeight - window.innerHeight > threshold;
    if (widthDiff || heightDiff) {
      if (!devToolsOpen) {
        devToolsOpen = true;
      }
    } else {
      devToolsOpen = false;
    }
  }, 1000);

})();
