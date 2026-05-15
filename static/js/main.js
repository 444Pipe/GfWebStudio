document.addEventListener('DOMContentLoaded', function(){
  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if(href && href.length > 1) {
        const t = document.querySelector(href);
        if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });

  // Navbar scrolled state
  const nav = document.querySelector('.glass-navbar');
  const setScrolled = () => {
    if(!nav) return;
    if(window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  setScrolled();
  window.addEventListener('scroll', setScrolled, {passive:true});

  // Reveal on scroll
  const reveals = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if(en.isIntersecting){
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length && 'IntersectionObserver' in window){
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if(!en.isIntersecting) return;
        const el = en.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
          if(p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, {threshold:0.4});
    counters.forEach(c => cio.observe(c));
  }

  // FAB Toggle
  const fabMain = document.getElementById('fab-main');
  const fabSocialList = document.getElementById('fab-social-list');
  if (fabMain && fabSocialList) {
    const icon = fabMain.querySelector('i');
    fabMain.addEventListener('click', function(e) {
      e.stopPropagation();
      const open = fabSocialList.classList.toggle('active');
      fabMain.classList.toggle('active', open);
      if(icon){
        icon.classList.toggle('bi-plus-lg', !open);
        icon.classList.toggle('bi-x-lg', open);
      }
    });
    document.addEventListener('click', function(event) {
      if (!fabMain.contains(event.target) && !fabSocialList.contains(event.target)) {
        fabSocialList.classList.remove('active');
        fabMain.classList.remove('active');
        if(icon){
          icon.classList.add('bi-plus-lg');
          icon.classList.remove('bi-x-lg');
        }
      }
    });
  }
});
