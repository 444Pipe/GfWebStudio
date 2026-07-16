(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {

    // ---------- Smooth scroll for in-page anchors ----------
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        // Close mobile menu if open
        const collapse = document.querySelector('.navbar-collapse.show');
        if (collapse) {
          const bsCollapse = bootstrap.Collapse.getInstance(collapse) || new bootstrap.Collapse(collapse, { toggle: false });
          bsCollapse.hide();
        }
      });
    });

    // ---------- Hero video: respetar prefers-reduced-motion ----------
    const heroVideo = document.querySelector('.hero-video');
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
        }, 320);
      }, 2800);
    }

    // ---------- Scroll progress bar ----------
    const progress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('site-navbar');

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progress) progress.style.width = pct + '%';
      if (navbar) navbar.classList.toggle('is-scrolled', scrollTop > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Active nav link by current path ----------
    const navLinks = document.querySelectorAll('.glass-navbar .nav-link');
    const currentPath = window.location.pathname.replace(/\/$/, '');
    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').split('#')[0].replace(/\/$/, '');
      if (href && href === currentPath) link.classList.add('is-active');
    });

    // ---------- Reveal on scroll (IntersectionObserver) ----------
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // ---------- Animated counters ----------
    const counters = document.querySelectorAll('[data-counter]');
    function animateCounter(el) {
      const target = parseFloat(el.getAttribute('data-counter')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const startTime = performance.now();
      const isInt = Number.isInteger(target);

      function tick(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
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
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = target + suffix;
      });
    }

    // ---------- FAB social menu ----------
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

    // ---------- Contact form: loading state + simple validation feedback ----------
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

    // ---------- Subtle tilt on service cards (desktop only) ----------
    if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const tiltCards = document.querySelectorAll('.service-card-premium');
      tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `translateY(-10px) perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }

    // ---------- Custom cursor ring (desktop hover pointer only) ----------
    if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const ring = document.getElementById('cursor-ring');
      if (ring) {
        let rx = 0, ry = 0, tx = 0, ty = 0, started = false;
        const lerp = (a, b, n) => a + (b - a) * n;

        document.addEventListener('mousemove', (e) => {
          tx = e.clientX; ty = e.clientY;
          // Primer movimiento: posicionar el anillo directamente sobre el cursor
          // para que no "vuele" desde la esquina superior izquierda
          if (!started) { rx = tx; ry = ty; started = true; }
          ring.classList.add('is-active');
        });
        document.addEventListener('mouseleave', () => ring.classList.remove('is-active'));

        function frame() {
          rx = lerp(rx, tx, 0.18);
          ry = lerp(ry, ty, 0.18);
          ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);

        // Grow ring over interactive elements
        const interactive = 'a, button, .btn-primary, .btn-secondary, .btn-service-cta, .btn-service-primary, .btn-submit, .btn-cta-white, .fab-main, .social, .social-item, .portfolio-card, .service-card-premium, .why-card, .testimonial-card, .contact-info-item, .nav-link, .navbar-toggler';
        document.querySelectorAll(interactive).forEach(el => {
          el.addEventListener('mouseenter', () => ring.classList.add('is-link'));
          el.addEventListener('mouseleave', () => ring.classList.remove('is-link'));
        });
      }
    }
  });
})();
