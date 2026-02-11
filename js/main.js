/* ============================================
   TopChampionships.com — Main JavaScript
   Navigation, Scroll Animations, FAQ Accordion
   ============================================ */

(function () {
  'use strict';

  // --- Navigation: Scroll effect ---
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- Mobile menu toggle ---
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMobile.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMobile.classList.contains('open')) {
        navMobile.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Scroll reveal animations (IntersectionObserver) ---
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollReveal();

  // --- FAQ Accordion ---
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var button = item.querySelector('.faq-question');
      if (!button) return;

      button.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close all other items
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
            var otherButton = otherItem.querySelector('.faq-question');
            if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        item.classList.toggle('open');
        button.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  initFAQ();

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var navHeight = nav ? nav.offsetHeight : 72;
      var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // Close mobile menu if open
      if (navMobile && navMobile.classList.contains('open')) {
        navMobile.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  // --- Atmosphere bars: animate on scroll ---
  function initAtmosBars() {
    var bars = document.querySelectorAll('.atmos-bar');
    if (!bars.length) return;

    if (!('IntersectionObserver' in window)) {
      return; // bars already have width set via inline style
    }

    bars.forEach(function (bar) {
      var targetWidth = bar.style.width;
      bar.style.width = '0%';

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setTimeout(function () {
                bar.style.width = targetWidth;
              }, 200);
              observer.unobserve(bar);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(bar);
    });
  }

  initAtmosBars();

  // --- Newsletter form: simple client-side feedback ---
  var ctaForm = document.querySelector('.cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = ctaForm.querySelector('.cta-input');
      var submitBtn = ctaForm.querySelector('.btn');

      if (input && input.value) {
        var originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'You&#39;re In! &#10003;';
        submitBtn.style.background = '#22c55e';
        input.value = '';
        input.disabled = true;
        submitBtn.disabled = true;

        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          input.disabled = false;
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // --- Coming Soon page: dynamic page name from URL params ---
  function initComingSoon() {
    var pageTitle = document.getElementById('comingSoonTitle');
    if (!pageTitle) return;

    var params = new URLSearchParams(window.location.search);
    var page = params.get('page');

    if (page) {
      var pageName = page
        .replace(/-/g, ' ')
        .replace(/\b\w/g, function (l) {
          return l.toUpperCase();
        });
      pageTitle.textContent = pageName;
      document.title = pageName + ' — Coming Soon | TopChampionships';
    }
  }

  initComingSoon();

  // --- Coming Soon form ---
  var comingSoonForm = document.querySelector('.coming-soon-form');
  if (comingSoonForm) {
    comingSoonForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = comingSoonForm.querySelector('.cta-input');
      var submitBtn = comingSoonForm.querySelector('.btn');

      if (input && input.value) {
        var originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'You&#39;re In! &#10003;';
        submitBtn.style.background = '#22c55e';
        input.value = '';
        input.disabled = true;
        submitBtn.disabled = true;

        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          input.disabled = false;
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // --- Hero stat counter animation ---
  function animateCounters() {
    var stats = document.querySelectorAll('.hero-stat-number');
    if (!stats.length) return;

    stats.forEach(function (stat) {
      var text = stat.textContent.trim();
      var match = text.match(/^(\d+)/);
      if (!match) return;

      var target = parseInt(match[1], 10);
      var suffix = text.replace(match[1], '');
      var duration = 1500;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        stat.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          stat.textContent = target + suffix;
        }
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              requestAnimationFrame(step);
              observer.unobserve(stat);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(stat);
    });
  }

  animateCounters();
})();
