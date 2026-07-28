/**
 * animations.js
 * - Animated count-up for elements with [data-counter="1234"]
 * - Scroll-triggered reveal for elements with [data-reveal]
 * - Stagger index assignment for [data-stagger] children (used by animations.css)
 */

export function initAnimations(){
  animateCounters();
  initScrollReveal();
  assignStaggerIndexes();
}

function animateCounters(){
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.counter.replace(/,/g, ''));
    const suffix = el.dataset.counterSuffix || '';
    const duration = parseInt(el.dataset.counterDuration || '900', 10);
    const start = performance.now();
    const isInt = Number.isInteger(target);

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = target * eased;
      el.textContent = (isInt ? Math.round(value) : value.toFixed(1)).toLocaleString('ar') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){ animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => io.observe(el));
  } else {
    counters.forEach(animate);
  }
}

function initScrollReveal(){
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('anim-fade-in-up');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(el => io.observe(el));
}

function assignStaggerIndexes(){
  document.querySelectorAll('[data-stagger]').forEach(container => {
    [...container.children].forEach((child, i) => {
      child.style.setProperty('--stagger-index', i);
    });
  });
}
