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

  // Position a single circle over its sibling h1 (or custom target) using actual text bounds
  function positionCircle(circle) {
    const parent = circle.parentElement;
    const targetSel = circle.dataset.target;
    const title = (targetSel ? parent.querySelector(targetSel) : null) || parent.querySelector('h1');
    if (!title) return;
    const range = document.createRange();
    range.selectNodeContents(title);
    const lineRects = Array.from(range.getClientRects()).filter(r => r.width > 10);
    if (!lineRects.length) return;
    const pr     = parent.getBoundingClientRect();
    const left   = Math.min(...lineRects.map(r => r.left));
    const top    = Math.min(...lineRects.map(r => r.top));
    const right  = Math.max(...lineRects.map(r => r.right));
    const bottom = Math.max(...lineRects.map(r => r.bottom));
    const padX   = (right - left)  * 0.08;
    const padY   = (bottom - top)  * 0.14;
    circle.style.left   = (left - pr.left - padX) + 'px';
    circle.style.top    = (top  - pr.top  - padY) + 'px';
    circle.style.width  = (right - left + padX * 2) + 'px';
    circle.style.height = (bottom - top  + padY * 2) + 'px';
  }

  function positionAllCircles() {
    document.querySelectorAll('.hero-circle').forEach(positionCircle);
  }

  document.fonts.ready.then(() => {
    positionAllCircles();
    // Trigger animation only after circles are positioned
    setTimeout(() => {
      document.querySelectorAll('.hero-circle').forEach(c => c.classList.add('animate'));
    }, 700);
    window.addEventListener('resize', positionAllCircles);
  });

  // Sketch underline on scroll for touch devices - resets when out of view
  if (window.matchMedia('(hover: none)').matches) {
    const underlineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('drawn');
        } else {
          entry.target.classList.remove('drawn');
          void entry.target.offsetWidth;
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('.block-title, .work-title, .project-title, .pg-slide-name').forEach(el => {
      underlineObserver.observe(el);
    });

    // Hero circles - redraw each when its section scrolls back into view
    document.querySelectorAll('.hero-circle').forEach(circle => {
      const section = circle.closest('.home-hero, .page-hero, .ph-hero');
      if (!section) return;
      let initialLoad = true;
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (initialLoad) { initialLoad = false; return; }
            circle.classList.remove('animate');
            void circle.offsetWidth;
            circle.classList.add('animate');
          }
        });
      }, { threshold: 0.3 });
      heroObserver.observe(section);
    });
  }

  // Footer social link hover - override inline opacity so CSS hover rules apply
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
