document.addEventListener('DOMContentLoaded', function(){
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if(t) t.scrollIntoView({behavior:'smooth'});
  }));
});
