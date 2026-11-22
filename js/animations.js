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

  // Older browsers and embedded previews may not provide IntersectionObserver.
  if (typeof IntersectionObserver === 'undefined') {
    elements.forEach(el => el.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const type  = el.dataset.animate || 'fade-up';
        const delay = parseInt(el.dataset.delay, 10) || 0;

        el.style.transitionDelay = delay + 'ms';
        el.classList.add('animated', `anim-${type}`);
        observer.unobserve(el);

        const cleanupDelay = (el.className && String(el.className).includes('service-card')) ? (delay + 500) : (delay + 1300);
        if (typeof setTimeout !== 'undefined') {
          setTimeout(() => {
            el.classList.remove('pre-animate');
            el.style.transitionDelay = '';
          }, cleanupDelay);
        }
      }
    });
  }, {
    threshold:  0.08,
    rootMargin: '0px 0px -25px 0px',
  });

  elements.forEach(el => {
    el.classList.add('pre-animate');
    observer.observe(el);
  });
}
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

/* ─── Reference-style custom cursor ─── */
function initCustomCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.getElementById('cursor');
  const cursorBlur = document.getElementById('cursor-blur');
  if (!cursor || !cursorBlur) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let blurX = mouseX;
  let blurY = mouseY;

  document.addEventListener('mousemove', event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    cursor.classList.add('cursor-visible');
    cursorBlur.classList.add('cursor-visible');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-visible');
    cursorBlur.classList.remove('cursor-visible');
  });

  document.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-visible');
    cursorBlur.classList.add('cursor-visible');
  });

  function animateCursor() {
    blurX += (mouseX - blurX) * 0.15;
    blurY += (mouseY - blurY) * 0.15;
    cursorBlur.style.left = (blurX - 30) + 'px';
    cursorBlur.style.top = (blurY - 30) + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = 'a, button, .project-card, .service-card, .stat-card, .edu-card, .exp-card, .contact-card';
  document.querySelectorAll(hoverTargets).forEach(element => {
    element.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}

/* ─── Mouse tilt and magnetic buttons ─── */
function initMouseEffects() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.project-card, .service-card, .edu-card, .stat-card, .exp-card').forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('mousemove', event => {
      if (card.classList.contains('pre-animate') && !card.classList.contains('animated')) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / 16).toFixed(2);
      const rotateY = ((rect.width / 2 - x) / 16).toFixed(2);
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale3d(1.015,1.015,1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.hero-cta .btn, .about-cta, .nav-actions .cv-btn').forEach(button => {
    button.classList.add('magnetic-btn');

    button.addEventListener('mousemove', event => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}

/* ─── Section title underline reveal ─── */
function initTitleReveal() {
  const titles = document.querySelectorAll('.section-title');
  if (!titles.length) return;

  if (typeof IntersectionObserver === 'undefined') {
    titles.forEach(title => title.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  titles.forEach(title => observer.observe(title));
}

// Export for main.js
window.portfolioAnimations = {
  initCounters,
  initSkillsTabs,
  initScrollReveal,
  initCustomCursor,
  initMouseEffects,
  initTitleReveal,
};
