/* ══════════════════════════════════════════════════
   IREFIS — script.js | Sparkz Agency
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Mobile menu toggle ── */
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close menu when any link is clicked
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on backdrop click (outside nav)
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Smooth active nav highlight ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-menu a[href^="#"]');
  function setActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'white'
        : '';
      link.style.background = link.getAttribute('href') === '#' + current
        ? 'rgba(255,255,255,0.12)'
        : '';
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ── Cartão 3D tilt on mouse move ── */
  const card = document.querySelector('.cartao-front');
  if (card) {
    const wrap = document.querySelector('.cartao-mockup');
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 12}deg) scale(1.03)`;
    });
    wrap.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }

  /* ── Stats counter animation ── */
  function animateCounter(el, target, suffix, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const isPlus = suffix.includes('+');
    const cleanSuffix = suffix.replace('+','');
    function update() {
      start = Math.min(start + step, target);
      if (typeof target === 'number' && Number.isInteger(target)) {
        el.textContent = (isPlus ? '+' : '') + Math.floor(start) + cleanSuffix;
      }
      if (start < target) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsBar = document.querySelector('.stats-bar');
  let statsAnimated = false;
  if (statsBar && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCounter(document.querySelectorAll('.stat-num')[0], 500, '+', 1500);
        animateCounter(document.querySelectorAll('.stat-num')[1], 8,   '',  800);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(statsBar);
  }

  /* ── Entrance animation for cards ── */
  const animTargets = document.querySelectorAll(
    '.trat-card, .socio-card, .mvv-card, .doc-card, .pillar, .cartao-ben'
  );

  if ('IntersectionObserver' in window) {
    // Pre-style: visible by default, just add a subtle entrance
    animTargets.forEach((el, i) => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    const cardObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('entered');
          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animTargets.forEach(el => cardObs.observe(el));
  }

  /* ── Hero parallax (subtle) ── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.3;
      heroBg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  /* ── Copy WhatsApp number on click (contact card) ── */
  // No action needed; all WA links go directly to WhatsApp

  console.log('%cIREFIS — Site institucional | Desenvolvido por Sparkz Agency', 
    'color:#00ACC1;font-weight:bold;font-size:13px;');
})();
