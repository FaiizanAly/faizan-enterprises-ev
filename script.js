/* ============================================================
   FAIZAN ENTERPRISES — JAVASCRIPT
   Premium Electric Mobility Dealership
   ============================================================ */

/* ============================================================
   1. MOBILE NAVIGATION
   ============================================================ */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
  }

  hamburger.addEventListener('click', function () {
    if (hamburger.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when pressing Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      closeMenu();
    }
  });
})();


/* ============================================================
   2. NAVBAR — SCROLL BEHAVIOUR
   ============================================================ */
(function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load in case page is already scrolled
})();


/* ============================================================
   3. HERO ENTRANCE ANIMATION
   ============================================================ */
(function initHeroAnimation() {
  // Respect reduced-motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const heroBadge    = document.querySelector('.hero-badge');
  const heroHeadline = document.querySelector('.hero-headline');
  const heroSubtext  = document.querySelector('.hero-subtext');
  const heroActions  = document.querySelector('.hero-actions');
  const heroVisual   = document.querySelector('.hero-visual');

  if (prefersReduced) {
    // Instantly show everything
    [heroBadge, heroHeadline, heroSubtext, heroActions].forEach(function (el) {
      if (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
    if (heroVisual) {
      heroVisual.classList.add('animate');
    }
    return;
  }

  // Staggered entrance
  function animateIn(el, delay) {
    if (!el) return;
    setTimeout(function () {
      el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  }

  animateIn(heroBadge, 150);
  animateIn(heroHeadline, 350);
  animateIn(heroSubtext, 550);
  animateIn(heroActions, 750);

  if (heroVisual) {
    setTimeout(function () {
      heroVisual.classList.add('animate');
    }, 900);
  }
})();


/* ============================================================
   4. SCROLL REVEAL ANIMATIONS
   ============================================================ */
(function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Make all elements visible immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Respect stagger delay set via data-delay attribute
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
})();


/* ============================================================
   5. ABOUT IMAGE FALLBACK
   ============================================================ */
(function initAboutImageFallback() {
  const aboutImg = document.getElementById('about-img');
  const aboutFallback = document.getElementById('about-fallback');

  if (!aboutImg) return;

  aboutImg.addEventListener('error', function () {
    aboutImg.style.display = 'none';
    if (aboutFallback) {
      aboutFallback.style.display = 'flex';
    }
  });

  // If image already errored before the listener was attached
  if (aboutImg.complete && !aboutImg.naturalWidth) {
    aboutImg.dispatchEvent(new Event('error'));
  }
})();


/* ============================================================
   6. ENQUIRY FORM — VALIDATION & WHATSAPP REDIRECT
   ============================================================ */
(function initEnquiryForm() {
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var WA_NUMBER = '919897497767'; // country code + number, no + or spaces

  // --- Reset the form to a completely blank state ---
  // Called on page load and after every WhatsApp redirect.
  // This prevents the browser's own session-restore / back-forward cache
  // from making the form appear pre-filled or "already submitted".
  // Nothing is read from or written to localStorage, sessionStorage, or cookies.
  function resetForm() {
    form.reset();

    // Clear all inline error messages and error highlight styling
    form.querySelectorAll('.form-error-msg').forEach(function (el) {
      el.textContent = '';
      el.classList.remove('visible');
    });
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (el) {
      el.classList.remove('error');
    });
  }

  // Always start with a blank form on every page load / refresh
  resetForm();

  // Helper: show/hide inline error
  function setError(inputEl, msgEl, show, message) {
    if (show) {
      if (inputEl) inputEl.classList.add('error');
      if (msgEl) {
        msgEl.textContent = message || 'This field is required.';
        msgEl.classList.add('visible');
      }
    } else {
      if (inputEl) inputEl.classList.remove('error');
      if (msgEl) msgEl.classList.remove('visible');
    }
  }

  // Helper: get selected radio card value
  function getRadioValue(name) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : '';
  }

  // Clear error on user interaction
  function attachClearError(inputEl, msgEl) {
    if (!inputEl) return;
    var eventName = inputEl.tagName === 'SELECT' ? 'change' : 'input';
    inputEl.addEventListener(eventName, function () {
      setError(inputEl, msgEl, false);
    });
  }

  // Get form elements
  var nameInput    = document.getElementById('f-name');
  var nameError    = document.getElementById('f-name-error');
  var waInput      = document.getElementById('f-wa');
  var waError      = document.getElementById('f-wa-error');
  var brandSelect  = document.getElementById('f-brand');
  var brandError   = document.getElementById('f-brand-error');
  var messageInput = document.getElementById('f-message');

  attachClearError(nameInput, nameError);
  attachClearError(waInput, waError);
  attachClearError(brandSelect, brandError);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name     = nameInput ? nameInput.value.trim() : '';
    var wa       = waInput ? waInput.value.trim() : '';
    var vehicle  = getRadioValue('vehicle');
    var brand    = brandSelect ? brandSelect.value : '';
    var finance  = getRadioValue('finance');
    var message  = messageInput ? messageInput.value.trim() : '';

    var valid = true;

    // Validate name
    if (!name) {
      setError(nameInput, nameError, true, 'Please enter your full name.');
      valid = false;
    } else {
      setError(nameInput, nameError, false);
    }

    // Validate WhatsApp number (10 digits)
    if (!wa) {
      setError(waInput, waError, true, 'Please enter your WhatsApp number.');
      valid = false;
    } else if (!/^\d{10}$/.test(wa)) {
      setError(waInput, waError, true, 'Please enter a valid 10-digit number.');
      valid = false;
    } else {
      setError(waInput, waError, false);
    }

    // Validate vehicle type
    var vehicleError = document.getElementById('f-vehicle-error');
    if (!vehicle) {
      if (vehicleError) {
        vehicleError.textContent = 'Please select a vehicle type.';
        vehicleError.classList.add('visible');
      }
      valid = false;
    } else {
      if (vehicleError) vehicleError.classList.remove('visible');
    }

    // Validate finance
    var financeError = document.getElementById('f-finance-error');
    if (!finance) {
      if (financeError) {
        financeError.textContent = 'Please indicate if finance is required.';
        financeError.classList.add('visible');
      }
      valid = false;
    } else {
      if (financeError) financeError.classList.remove('visible');
    }

    if (!valid) return;

    // Build WhatsApp message
    var vehicleLabel  = vehicle  || 'Not specified';
    var brandLabel    = brand    || 'Not specified';
    var financeLabel  = finance  || 'Not specified';
    var messageLabel  = message  || '(No additional message)';

    var waMessage =
      'FAIZAN ENTERPRISES \u2014 NEW ENQUIRY\n\n' +
      'Customer Details\n' +
      'Name: ' + name + '\n' +
      'WhatsApp: ' + wa + '\n\n' +
      'Vehicle Requirement\n' +
      'Vehicle: ' + vehicleLabel + '\n' +
      'Brand / Model: ' + brandLabel + '\n\n' +
      'Finance\n' +
      'Required: ' + financeLabel + '\n\n' +
      'Requirement\n' +
      messageLabel + '\n\n' +
      'FAIZAN ENTERPRISES\n' +
      'Near Railway Station, Senthal,\n' +
      'Bareilly, Uttar Pradesh \u2013 243407';

    var encoded = encodeURIComponent(waMessage);
    var waURL = 'https://wa.me/' + WA_NUMBER + '?text=' + encoded;

    // Open WhatsApp in a new tab, then immediately reset the form.
    // The form is now blank and ready for the next enquiry on any device.
    // No submission state is stored anywhere.
    window.open(waURL, '_blank', 'noopener,noreferrer');
    resetForm();
  });

  // Clear vehicle/finance radio errors on selection
  form.querySelectorAll('input[name="vehicle"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var err = document.getElementById('f-vehicle-error');
      if (err) err.classList.remove('visible');
    });
  });

  form.querySelectorAll('input[name="finance"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var err = document.getElementById('f-finance-error');
      if (err) err.classList.remove('visible');
    });
  });
})();


/* ============================================================
   7. ACTIVE NAV LINK — HIGHLIGHT ON SCROLL
   ============================================================ */
(function initActiveNavLink() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    var scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();


/* ============================================================
   8. SCOOTERS AT A GLANCE — CONTINUOUS CAROUSEL & LIGHTBOX MODAL
   ============================================================ */
(function initScooterCarouselAndModal() {
  const carousel = document.getElementById('scooter-carousel');
  const track = document.getElementById('scooter-track');
  const modal = document.getElementById('scooter-modal');
  const modalImg = document.getElementById('scooter-modal-img');
  const modalClose = document.getElementById('scooter-modal-close');
  const modalBackdrop = document.getElementById('scooter-modal-backdrop');

  if (!carousel || !track) return;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let currentTranslate = 0;
  const speed = 0.55; // pixels per frame (smooth, calm, premium pace)
  let isPaused = false;
  let isDragging = false;
  let startX = 0;
  let dragDistance = 0;
  let prevTranslate = 0;
  let animationFrameId = null;
  let lastTimestamp = 0;
  let lastFocusedElement = null;

  // Calculate half track width (width of original 8 items + gaps)
  function getHalfTrackWidth() {
    return track.scrollWidth / 2;
  }

  // Position track correctly ensuring seamless wrap
  function setPosition(x) {
    const halfWidth = getHalfTrackWidth();
    if (halfWidth <= 0) return;

    // Modulo wrap: currentTranslate is negative as it moves right-to-left
    while (x <= -halfWidth) {
      x += halfWidth;
    }
    while (x > 0) {
      x -= halfWidth;
    }

    currentTranslate = x;
    track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
  }

  // Animation loop
  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!isPaused && !isDragging && !prefersReducedMotion.matches) {
      // Normalize speed based on 60fps (~16.67ms)
      const factor = Math.min(delta / 16.67, 3);
      currentTranslate -= speed * factor;
      setPosition(currentTranslate);
    }

    if (!prefersReducedMotion.matches) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  // Start animation loop if motion is allowed
  if (!prefersReducedMotion.matches) {
    animationFrameId = requestAnimationFrame(animate);
  }

  // Listen for reduced motion change
  prefersReducedMotion.addEventListener('change', function (e) {
    if (e.matches) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      track.style.transform = 'none';
    } else {
      lastTimestamp = 0;
      animationFrameId = requestAnimationFrame(animate);
    }
  });

  // Desktop hover pause
  carousel.addEventListener('mouseenter', function () {
    isPaused = true;
  });

  carousel.addEventListener('mouseleave', function () {
    if (!isDragging) {
      isPaused = false;
    }
  });

  // Keyboard focus pause (accessibility)
  carousel.addEventListener('focusin', function () {
    isPaused = true;
  });

  carousel.addEventListener('focusout', function (e) {
    if (!carousel.contains(e.relatedTarget) && !isDragging) {
      isPaused = false;
    }
  });

  // Drag & Touch support
  function onPointerDown(e) {
    if (prefersReducedMotion.matches) return;
    // Primary mouse button or touch
    if (e.button !== undefined && e.button !== 0) return;

    isDragging = true;
    isPaused = true;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    dragDistance = 0;
    prevTranslate = currentTranslate;
    carousel.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX;
    dragDistance = Math.abs(diff);

    setPosition(prevTranslate + diff);
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = '';

    // If mouse is not hovering anymore, resume
    setTimeout(function () {
      if (!carousel.matches(':hover') && !carousel.contains(document.activeElement)) {
        isPaused = false;
      }
    }, 50);
  }

  // Touch event listeners
  carousel.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });
  window.addEventListener('touchcancel', onPointerUp, { passive: true });

  // Mouse drag event listeners
  carousel.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  // ============================================================
  // LIGHTBOX MODAL LOGIC
  // ============================================================
  function openModal(src, alt) {
    if (!modal || !modalImg) return;

    lastFocusedElement = document.activeElement;
    isPaused = true; // Pause carousel while modal is open

    modalImg.src = src;
    modalImg.alt = alt || 'Electric scooter';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Prevent body scroll behind modal
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (modalClose) {
      modalClose.focus();
    }
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (modalImg) modalImg.src = '';

    // Restore body scroll
    document.body.style.overflow = '';

    // Resume carousel if not hovered
    if (!carousel.matches(':hover')) {
      isPaused = false;
    }

    // Restore focus to last clicked element
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  // Attach click to view on photo buttons
  const photoBtns = track.querySelectorAll('.showroom-photo-btn');
  photoBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      // If user was dragging significantly, don't trigger modal click
      if (dragDistance > 6) {
        e.preventDefault();
        return;
      }

      const fullSrc = btn.getAttribute('data-full');
      const altText = btn.getAttribute('data-alt');
      if (fullSrc) {
        openModal(fullSrc, altText);
      }
    });
  });

  // Modal close handlers
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  // Keyboard navigation: Escape key closes modal
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
})();
