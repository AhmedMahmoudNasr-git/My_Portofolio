/**
 * ============================================
 * ANIMATIONS.JS — Scroll & Canvas Animations
 * ============================================
 */

'use strict';

/* ─── Particle Canvas Background ─── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let particles = [];
  let animId;
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function getColor() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? 'rgba(236,223,204,' : 'rgba(114,125,115,';
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 2 + 0.5;
      this.vx    = (Math.random() - 0.5) * 0.4;
      this.vy    = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = getColor() + this.alpha + ')';
      ctx.fill();
    }
  }

  function connect() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = getColor() + alpha + ')';
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((W * H) / 12000), 80);
    particles = Array.from({ length: count }, () => new Particle());
    cancelAnimationFrame(animId);
    loop();
  }

  // Respect reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('resize', debounce(init, 300));
    init();
  }
})();


/* ─── Scroll-reveal via IntersectionObserver ─── */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const type  = el.dataset.animate || 'fade-up';
        const delay = el.dataset.delay   || '0';

        el.style.transitionDelay = delay + 'ms';
        el.classList.add('animated', `anim-${type}`);
        observer.unobserve(el);
      }
    });
  }, {
    threshold:  0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  elements.forEach(el => {
    el.classList.add('pre-animate');
    observer.observe(el);
  });
}
initScrollReveal();


/* ─── Animated Counters ─── */
function initCounters() {
  if (typeof portfolioData === 'undefined') return;

  const duration = 1800;

  portfolioData.statistics.forEach(stat => {
    const el = document.getElementById(stat.id);
    if (!el) return;

    // If text stat (like "MEAN Stack")
    if (stat.value === null) {
      const numEl = el.querySelector('.stat-number');
      if (numEl) numEl.textContent = stat.text;
      return;
    }

    const numEl = el.querySelector('.stat-number');
    if (!numEl) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const start     = performance.now();
        const target    = stat.value;
        const suffix    = stat.suffix || '';

        function animate(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = easeOutExpo(progress);
          const current  = Math.floor(eased * target);
          numEl.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
      });
    }, { threshold: 0.5 });

    observer.observe(el);
  });
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}


function initSkillsTabs() {
  const tabs = document.querySelectorAll('.skills-tab');
  const panes = document.querySelectorAll('.skills-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('tab-active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('tab-active');
      const target = document.getElementById(tab.dataset.target);
      if (target) {
        target.classList.add('active');
      }
    });
  });
}


/* ─── Utility: Debounce ─── */
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Export for main.js
window.portfolioAnimations = {
  initCounters,
  initSkillsTabs,
  initScrollReveal,
};
