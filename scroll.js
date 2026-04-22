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

    // Measure actual text bounds (not the full-width block box)
    const range = document.createRange();
    range.selectNodeContents(title);
    const lineRects = Array.from(range.getClientRects()).filter(r => r.width > 10);
    if (!lineRects.length) return;

    const pr     = title.parentElement.getBoundingClientRect();
    const left   = Math.min(...lineRects.map(r => r.left));
    const top    = Math.min(...lineRects.map(r => r.top));
    const right  = Math.max(...lineRects.map(r => r.right));
    const bottom = Math.max(...lineRects.map(r => r.bottom));

    const padX = (right - left) * 0.08;
    const padY = (bottom - top) * 0.14;

    circle.style.left   = (left - pr.left - padX) + 'px';
    circle.style.top    = (top  - pr.top  - padY) + 'px';
    circle.style.width  = (right - left + padX * 2) + 'px';
    circle.style.height = (bottom - top  + padY * 2) + 'px';
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
