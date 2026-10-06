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
