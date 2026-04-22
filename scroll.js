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
