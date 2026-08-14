(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', function () {

    // ---------- Navegación móvil ----------
    const burger = document.getElementById('nav-burger');
    const navMenu = document.getElementById('navMenu');

    if (burger && navMenu) {
      const setNav = (open) => {
        navMenu.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        document.body.style.overflow = open && window.innerWidth < 992 ? 'hidden' : '';
      };

      burger.addEventListener('click', () => setNav(!navMenu.classList.contains('is-open')));

      navMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => setNav(false));
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
          setNav(false);
          burger.focus();
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth >= 992 && navMenu.classList.contains('is-open')) setNav(false);
      });
    }

    // ---------- Smooth scroll para anclas internas ----------
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });

    // ---------- Video del hero: respetar prefers-reduced-motion ----------
    const heroVideo = document.querySelector('.hero__video-card video');
    if (heroVideo && prefersReducedMotion) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
    }

    // ---------- Hero: palabra rotativa ----------
    const rotateEl = document.getElementById('hero-rotate');
    if (rotateEl && !prefersReducedMotion) {
      const words = ['sitios web', 'aplicaciones', 'tiendas online', 'sistemas a medida'];
      let idx = 0;
      setInterval(() => {
        rotateEl.classList.add('is-out');
        setTimeout(() => {
          idx = (idx + 1) % words.length;
          rotateEl.textContent = words[idx];
          rotateEl.classList.remove('is-out');
        }, 300);
      }, 2800);
    }

    // ---------- Barra de progreso + navbar al hacer scroll ----------
    const progress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('site-navbar');

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progress) progress.style.width = pct + '%';
      if (navbar) navbar.classList.toggle('is-scrolled', scrollTop > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Enlace activo según la ruta ----------
    const currentPath = window.location.pathname.replace(/\/$/, '');
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = (link.getAttribute('href') || '').split('#')[0].replace(/\/$/, '');
      const hasHash = (link.getAttribute('href') || '').includes('#');
      if (href && href === currentPath && !hasHash) link.classList.add('is-active');
    });

    // ---------- Reveal al hacer scroll ----------
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // ---------- Contadores animados ----------
    const counters = document.querySelectorAll('[data-counter]');
    function animateCounter(el) {
      const target = parseFloat(el.getAttribute('data-counter')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500;
      const startTime = performance.now();
      const isInt = Number.isInteger(target);

      function tick(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = target * eased;
        el.textContent = (isInt ? Math.round(value) : value.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = (isInt ? target : target.toFixed(1)) + suffix;
      }
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(c => cio.observe(c));
    } else {
      counters.forEach(el => {
        const target = parseFloat(el.getAttribute('data-counter')) || 0;
        el.textContent = target + (el.getAttribute('data-suffix') || '');
      });
    }

    // ---------- FAB de redes ----------
    const fabMain = document.getElementById('fab-main');
    const fabSocialList = document.getElementById('fab-social-list');
    const fabIcon = document.getElementById('fab-icon');

    if (fabMain && fabSocialList) {
      const setOpen = (open) => {
        fabSocialList.classList.toggle('active', open);
        fabMain.classList.toggle('active', open);
        fabMain.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (fabIcon) {
          fabIcon.classList.toggle('bi-chat-dots-fill', !open);
          fabIcon.classList.toggle('bi-x-lg', open);
        }
      };

      fabMain.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(!fabSocialList.classList.contains('active'));
      });

      document.addEventListener('click', (event) => {
        if (!fabMain.contains(event.target) && !fabSocialList.contains(event.target)) {
          if (fabSocialList.classList.contains('active')) setOpen(false);
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fabSocialList.classList.contains('active')) setOpen(false);
      });
    }

    // ---------- Formulario de contacto ----------
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        let valid = true;
        form.querySelectorAll('input, textarea').forEach(field => {
          if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('is-invalid');
            valid = false;
          } else {
            field.classList.remove('is-invalid');
          }
        });
        if (!valid) {
          e.preventDefault();
          const firstInvalid = form.querySelector('.is-invalid');
          if (firstInvalid) firstInvalid.focus();
          return;
        }
        const btn = form.querySelector('.btn-submit');
        if (btn) btn.classList.add('is-loading');
      });

      form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => field.classList.remove('is-invalid'));
      });
    }

    // ---------- Cursor personalizado (solo escritorio) ----------
    if (!prefersReducedMotion && isFinePointer) {
      const ring = document.getElementById('cursor-ring');
      if (ring) {
        let rx = 0, ry = 0, tx = 0, ty = 0, started = false;
        const lerp = (a, b, n) => a + (b - a) * n;

        document.addEventListener('mousemove', (e) => {
          tx = e.clientX; ty = e.clientY;
          if (!started) { rx = tx; ry = ty; started = true; }
          ring.classList.add('is-active');
        });
        document.addEventListener('mouseleave', () => ring.classList.remove('is-active'));

        (function frame() {
          rx = lerp(rx, tx, 0.2);
          ry = lerp(ry, ty, 0.2);
          ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
          requestAnimationFrame(frame);
        })();

        const interactive = 'a, button, input, textarea, .svc-card, .work-card, .tst-card, .area, .pillar, .contact-item';
        document.querySelectorAll(interactive).forEach(el => {
          el.addEventListener('mouseenter', () => ring.classList.add('is-link'));
          el.addEventListener('mouseleave', () => ring.classList.remove('is-link'));
        });
      }
    }
  });
})();
