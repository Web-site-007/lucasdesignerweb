(function() {
  'use strict';

  // ============================================
  // THEME
  // ============================================
  var html = document.documentElement;
  var themeBtn = document.getElementById('themeToggle');
  var storedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    themeBtn.textContent = theme === 'dark' ? '\u263E' : '\u2600';
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    var focusableInMenu = navMenu.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');

    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      var isOpen = navMenu.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen && focusableInMenu.length) {
        focusableInMenu[0].focus();
      }
    });

    navMenu.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
        return;
      }
      if (e.key !== 'Tab' || !navMenu.classList.contains('open')) return;
      var first = focusableInMenu[0];
      var last = focusableInMenu[focusableInMenu.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    navMenu.querySelectorAll('.navbar__link').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      });
    });
  }

  // ============================================
  // NAVBAR SCROLL + ACTIVE LINK (throttled)
  // ============================================
  var navbar = document.querySelector('.navbar');
  var sections = document.querySelectorAll('section[id]');
  var scrollTicking = false;

  window.addEventListener('scroll', function() {
    if (!scrollTicking) {
      window.requestAnimationFrame(function() {
        if (navbar) {
          navbar.style.boxShadow = window.scrollY > 100 ? 'var(--shadow-md)' : 'none';
        }
        var scrollY = window.scrollY + 100;
        sections.forEach(function(section) {
          var top = section.offsetTop;
          var height = section.offsetHeight;
          var id = section.getAttribute('id');
          var link = document.querySelector('.navbar__link[href="#' + id + '"]');
          if (link) {
            if (scrollY >= top && scrollY < top + height) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          }
        });
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // ============================================
  // SCROLL TO TOP
  // ============================================
  var scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', function() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // INTERSECTION OBSERVER — ANIMATIONS
  // ============================================
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (prefersReducedMotion) {
    animatedElements.forEach(function(el) {
      el.classList.add('visible');
    });
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    var question = item.querySelector('.faq-item__question');
    if (!question) return;
    question.addEventListener('click', function() {
      var isActive = item.classList.contains('active');
      faqItems.forEach(function(i) {
        i.classList.remove('active');
        var q = i.querySelector('.faq-item__question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ============================================
  // CONTACT FORM — Vercel API
  // ============================================
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  var formError = document.getElementById('formError');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Honeypot check
      var honeypot = contactForm.querySelector('[name="botcheck"]');
      if (honeypot && honeypot.checked) {
        return;
      }

      var name = contactForm.querySelector('[name="name"]').value.trim();
      var email = contactForm.querySelector('[name="email"]').value.trim();
      var message = contactForm.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        alert('Preencha todos os campos obrigatórios.');
        return;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
      }

      var submitBtn = contactForm.querySelector('.form-submit');
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }

      var payload = {
        name: name,
        email: email,
        phone: contactForm.querySelector('[name="phone"]') ? contactForm.querySelector('[name="phone"]').value.trim() : '',
        service: contactForm.querySelector('[name="service"]') ? contactForm.querySelector('[name="service"]').value : '',
        message: message
      };

      fetch('https://lucasdesignerweb-api.vercel.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.success) {
          contactForm.style.display = 'none';
          if (formSuccess) formSuccess.classList.add('show');
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function() {
        contactForm.style.display = 'none';
        if (formError) formError.classList.add('show');
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 120;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
