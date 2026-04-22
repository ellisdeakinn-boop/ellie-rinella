document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .stagger').forEach(el => {
    observer.observe(el);
  });

  // Hero circle — position over h1 using actual bounding rect
  function positionHeroCircle() {
    const circle = document.querySelector('.hero-circle');
    const title  = document.querySelector('.home-hero-title');
    if (!circle || !title) return;
    const tr  = title.getBoundingClientRect();
    const pr  = title.parentElement.getBoundingClientRect();
    const padX = tr.width  * 0.07;
    const padY = tr.height * 0.12;
    circle.style.left   = (tr.left - pr.left - padX) + 'px';
    circle.style.top    = (tr.top  - pr.top  - padY) + 'px';
    circle.style.width  = (tr.width  + padX * 2) + 'px';
    circle.style.height = (tr.height + padY * 2) + 'px';
  }

  document.fonts.ready.then(() => {
    positionHeroCircle();
    window.addEventListener('resize', positionHeroCircle);
  });

  // Sketch underline on scroll for touch devices
  if (window.matchMedia('(hover: none)').matches) {
    const underlineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('drawn');
          underlineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('.block-title, h2.section-heading').forEach(el => {
      underlineObserver.observe(el);
    });
  }

  // Footer social link hover — override inline opacity so CSS hover rules apply
  document.querySelectorAll('.footer-social-link').forEach(link => {
    const svg = link.querySelector('svg');
    const span = link.querySelector('span');
    if (!svg || !span) return;
    link.addEventListener('mouseenter', () => {
      svg.style.opacity = '0';
      span.style.opacity = '0.8';
    });
    link.addEventListener('mouseleave', () => {
      svg.style.opacity = '';
      span.style.opacity = '0';
    });
  });
});
