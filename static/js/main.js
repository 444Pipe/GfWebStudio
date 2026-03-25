document.addEventListener('DOMContentLoaded', function(){
  // Smooth scroll
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if(href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const t = document.querySelector(href);
        if(t) t.scrollIntoView({behavior:'smooth'});
      }
    });
  });

  // FAB Toggle
  const fabMain = document.getElementById('fab-main');
  const fabSocialList = document.getElementById('fab-social-list');
  const fabIcon = document.getElementById('fab-icon');

  if (fabMain && fabSocialList) {
    fabMain.addEventListener('click', function(e) {
      e.stopPropagation();
      fabSocialList.classList.toggle('active');
      fabMain.classList.toggle('active');
      if (fabSocialList.classList.contains('active')) {
        fabIcon.classList.replace('bi-plus-lg', 'bi-x-lg');
      } else {
        fabIcon.classList.replace('bi-x-lg', 'bi-plus-lg');
      }
    });

    // Close FAB when clicking outside
    document.addEventListener('click', function(event) {
      if (!fabMain.contains(event.target) && !fabSocialList.contains(event.target)) {
        fabSocialList.classList.remove('active');
        if (fabIcon.classList.contains('bi-x-lg')) {
          fabIcon.classList.replace('bi-x-lg', 'bi-plus-lg');
        }
      }
    });
  }
});
