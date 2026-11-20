/**
 * ============================================
 * MAIN.JS — Core Portfolio Logic
 * ============================================
 * Handles: Theme, Navbar, DOM Population,
 * Active Nav Detection, Contact Form,
 * Back-to-Top, Mobile Menu
 */

'use strict';

/* ═══════════════════════════════════════════
   1. THEME MANAGEMENT
═══════════════════════════════════════════ */
const ThemeManager = {
  key: 'portfolio-theme',

  init() {
    const saved  = localStorage.getItem(this.key);
    const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.apply(saved || prefer);

    const btn = document.getElementById('theme-toggle');
    const mobBtn = document.getElementById('theme-toggle-mob');
    if (btn) btn.addEventListener('click', () => this.toggle());
    if (mobBtn) mobBtn.addEventListener('click', () => this.toggle());
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);
    this.updateIcon(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  },

  updateIcon(theme) {
    // Update all theme toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const sunIcon  = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (!sunIcon || !moonIcon) return;

      if (theme === 'dark') {
        sunIcon.style.display  = 'inline-block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display  = 'none';
        moonIcon.style.display = 'inline-block';
      }

      // Trigger rotation animation
      btn.querySelector('i').classList.remove('icon-enter');
      void btn.querySelector('i').offsetWidth; // reflow
      btn.querySelector('i').classList.add('icon-enter');
    });
  },
};


/* ═══════════════════════════════════════════
   2. NAVBAR BEHAVIOR
═══════════════════════════════════════════ */
const NavbarManager = {
  navbar:    null,
  hamburger: null,
  mobileMenu: null,
  isOpen:    false,

  init() {
    this.navbar     = document.getElementById('navbar');
    this.hamburger  = document.getElementById('hamburger');
    this.mobileMenu = document.getElementById('mobile-menu');

    if (!this.navbar) return;

    // Scroll shadow
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    // Hamburger toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }

    // Close mobile menu on nav link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.navbar.contains(e.target)) {
        this.closeMenu();
      }
    });
  },

  onScroll() {
    if (window.scrollY > 20) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  },

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  },

  openMenu() {
    this.isOpen = true;
    this.hamburger.classList.add('open');
    this.hamburger.setAttribute('aria-expanded', 'true');
    if (this.mobileMenu) this.mobileMenu.classList.add('open');
  },

  closeMenu() {
    this.isOpen = false;
    this.hamburger.classList.remove('open');
    this.hamburger.setAttribute('aria-expanded', 'false');
    if (this.mobileMenu) this.mobileMenu.classList.remove('open');
  },
};


/* ═══════════════════════════════════════════
   3. ACTIVE NAV SECTION DETECTION
═══════════════════════════════════════════ */
const ActiveNavManager = {
  sections: [],
  navLinks: [],
  navbarHeight: 80,

  init() {
    this.sections = Array.from(
      document.querySelectorAll('section[id], div[id].section-block')
    );
    this.navLinks = Array.from(document.querySelectorAll('.nav-link[data-section]'));

    if (!this.sections.length) return;
    window.addEventListener('scroll', () => this.detect(), { passive: true });
    this.detect();
  },

  detect() {
    const scrollY = window.scrollY + this.navbarHeight + 50;
    let active = this.sections[0];

    this.sections.forEach(section => {
      if (section.offsetTop <= scrollY) active = section;
    });

    this.navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === active.id);
    });
  },
};


/* ═══════════════════════════════════════════
   4. BACK TO TOP BUTTON
═══════════════════════════════════════════ */
const BackToTop = {
  btn: null,

  init() {
    this.btn = document.getElementById('back-to-top');
    if (!this.btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        this.btn.classList.add('visible');
      } else {
        this.btn.classList.remove('visible');
      }
    }, { passive: true });

    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },
};


/* ═══════════════════════════════════════════
   5. TYPED TEXT ANIMATION
═══════════════════════════════════════════ */
const TypedText = {
  el:          null,
  cursor:      null,
  titles:      [],
  current:     0,
  charIndex:   0,
  isDeleting:  false,
  typeSpeed:   80,
  deleteSpeed: 45,
  pauseTime:   2200,

  init() {
    this.el = document.getElementById('hero-title');
    if (!this.el) return;

    if (typeof portfolioData === 'undefined' || !portfolioData.personal.typedTitles) return;

    this.titles = portfolioData.personal.typedTitles;
    if (!this.titles.length) return;

    // Create cursor
    this.cursor = document.createElement('span');
    this.cursor.className = 'typed-cursor';
    this.cursor.setAttribute('aria-hidden', 'true');

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.el.textContent = this.titles[0];
      return;
    }

    this.tick();
  },

  tick() {
    const word    = this.titles[this.current];
    const display = this.isDeleting
      ? word.substring(0, this.charIndex - 1)
      : word.substring(0, this.charIndex + 1);

    this.el.textContent = '';
    this.el.appendChild(document.createTextNode(display));
    this.el.appendChild(this.cursor);

    this.charIndex = this.isDeleting ? this.charIndex - 1 : this.charIndex + 1;

    let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.charIndex > word.length) {
      speed            = this.pauseTime;
      this.isDeleting  = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.current    = (this.current + 1) % this.titles.length;
    }

    setTimeout(() => this.tick(), speed);
  },
};


/* ═══════════════════════════════════════════
   6. POPULATE CONTENT FROM portfolio-data.js
═══════════════════════════════════════════ */
const ContentBuilder = {

  init() {
    if (typeof portfolioData === 'undefined') {
      console.warn('portfolio-data.js not loaded.');
      return;
    }

    this.buildPersonal();
    this.buildEducation();
    this.buildExperience();
    this.buildProgrammingSkills();
    this.buildTechSkills();
    this.buildProjects();
    this.buildServices();
    this.buildContactInfo();
    this.buildFooter();
    this.buildStats();
  },

  buildPersonal() {
    const { personal } = portfolioData;

    // Name
    const nameEl = document.getElementById('hero-name');
    if (nameEl) nameEl.textContent = personal.name;

    // Initials logo
    const logoEl = document.getElementById('logo-initials');
    if (logoEl) logoEl.textContent = personal.initials;

    // Profile images
    document.querySelectorAll('[data-profile-img]').forEach(img => {
      const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='450'%3E%3Crect width='400' height='450' fill='%23D0DDD0'/%3E%3Ccircle cx='200' cy='160' r='80' fill='%23AAB99A'/%3E%3Cellipse cx='200' cy='360' rx='130' ry='100' fill='%23AAB99A'/%3E%3Ctext x='50%25' y='92%25' text-anchor='middle' font-family='Inter,sans-serif' font-size='14' fill='%23727D73'%3EAdd Profile Photo%3C/text%3E%3C/svg%3E";
      img.src = personal.profileImage || fallback;
      img.alt = personal.name + ' — Profile Photo';
      img.addEventListener('error', () => {
        img.onerror = null;
        img.src = fallback;
      }, { once: true });
    });

    document.querySelectorAll('[data-about-img]').forEach(img => {
      const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='540'%3E%3Crect width='480' height='540' fill='%23D0DDD0'/%3E%3Ccircle cx='240' cy='180' r='90' fill='%23AAB99A'/%3E%3Cellipse cx='240' cy='420' rx='150' ry='110' fill='%23AAB99A'/%3E%3Ctext x='50%25' y='92%25' text-anchor='middle' font-family='Inter,sans-serif' font-size='14' fill='%23727D73'%3EAdd About Photo%3C/text%3E%3C/svg%3E";
      img.src = personal.aboutImage || fallback;
      img.alt = personal.name + ' — About Photo';
      img.addEventListener('error', () => {
        img.onerror = null;
        img.src = fallback;
      }, { once: true });
    });

    // About text
    const aboutEl = document.getElementById('about-text');
    if (aboutEl) aboutEl.innerHTML = `<p>${personal.aboutText.replace(/\n\n/g, '</p><p>')}</p>`;

    // CV links
    document.querySelectorAll('[data-cv-link]').forEach(a => {
      a.href = personal.cv;
    });

    // Contact section info
    const emailDisplay = document.getElementById('personal-email');
    const phoneDisplay = document.getElementById('personal-phone');
    const locDisplay   = document.getElementById('personal-location');
    if (emailDisplay) emailDisplay.textContent = personal.email;
    if (phoneDisplay) phoneDisplay.textContent  = personal.phone;
    if (locDisplay)   locDisplay.textContent    = personal.location;

    // Page title
    document.title = `${personal.name} — ${personal.title.split('|')[0].trim()}`;
  },

  buildStats() {
    if (!portfolioData.statistics) return;
    portfolioData.statistics.forEach(stat => {
      const el = document.getElementById(stat.id);
      if (!el) return;
      const numEl = el.querySelector('.stat-number');
      if (!numEl) return;
      if (stat.value === null) {
        numEl.textContent = stat.text;
      } else {
        numEl.textContent = '0' + (stat.suffix || '');
      }
      const labelEl = el.querySelector('.stat-label');
      if (labelEl) labelEl.textContent = stat.label;
    });
  },

  buildEducation() {
    const container = document.getElementById('education-cards');
    if (!container || !portfolioData.education) return;

    container.innerHTML = portfolioData.education.map(edu => `
      <article class="edu-card" data-animate="fade-up">
        <div class="edu-card__icon">
          <img src="assets/images/mansoura-university.jpeg" alt="Mansoura University logo" class="edu-card__logo" loading="lazy">
        </div>
        <div class="edu-card__body">
          <div class="edu-card__header">
            <h3 class="edu-card__degree">${edu.field}</h3>
            <span class="edu-card__year">${edu.year}</span>
          </div>
          <p class="edu-card__institution"><i class="fas fa-university" aria-hidden="true"></i> ${edu.institution}</p>
          <div class="edu-card__meta">
            <span class="edu-badge edu-badge--degree"><i class="fas fa-award" aria-hidden="true"></i> ${edu.degree}</span>
            <span class="edu-badge edu-badge--grade"><i class="fas fa-star" aria-hidden="true"></i> Grade : ${edu.grade}</span>
            <span class="edu-badge edu-badge--status"><i class="fas fa-check-circle" aria-hidden="true"></i> ${edu.status}</span>
          </div>
          <p class="edu-card__desc">${edu.description}</p>
        </div>
      </article>
    `).join('');
  },

  buildExperience() {
    const container = document.getElementById('experience-timeline');
    if (!container || !portfolioData.experience) return;

    // Newest first (data already sorted, but ensure it)
    const sorted = [...portfolioData.experience];

    container.innerHTML = sorted.map((exp, i) => `
      <div class="timeline-item ${i % 2 === 0 ? 'timeline-left' : 'timeline-right'}" data-animate="${i % 2 === 0 ? 'fade-right' : 'fade-left'}" data-delay="${i * 120}">
        <div class="timeline-dot" aria-hidden="true"></div>
        <article class="exp-card">
          <div class="exp-card__header">
            <div>
              <h3 class="exp-card__title">${exp.title}</h3>
              ${exp.company ? `<p class="exp-card__company"><i class="fas fa-building" aria-hidden="true"></i> ${exp.company}</p>` : ``}
            </div>
            <div class="exp-card__meta">
              <span class="exp-badge exp-badge--type">${exp.type}</span>
              <span class="exp-badge exp-badge--date"><i class="fas fa-calendar" aria-hidden="true"></i> ${exp.duration}</span>
              ${exp.current ? '<span class="exp-badge exp-badge--current">Current</span>' : ''}
            </div>
          </div>
          <ul class="exp-card__list">
            ${exp.responsibilities.map(r => `<li><i class="fas fa-chevron-right" aria-hidden="true"></i>${r}</li>`).join('')}
          </ul>
          <div class="exp-card__tech">
            ${exp.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('')}
          </div>
        </article>
      </div>
    `).join('');
  },

  buildProgrammingSkills() {
    const container = document.getElementById('programming-skills');
    if (!container || !portfolioData.programmingSkills) return;
    container.innerHTML = portfolioData.programmingSkills.map((skill, i) => `
      <div class="prog-skill" data-animate="fade-up" data-delay="${i * 80}">
        <span class="prog-skill__name"><i class="${skill.icon}" aria-hidden="true"></i> ${skill.name}</span>
      </div>
    `).join('');
  },

  buildTechSkills() {
    const container = document.getElementById('tech-skills');
    if (!container || !portfolioData.techSkills) return;
    container.innerHTML = portfolioData.techSkills.map((skill, i) => `
      <span class="tech-skill-badge" data-animate="scale-in" data-delay="${i * 60}">
        <i class="${skill.icon}" aria-hidden="true"></i> ${skill.name}
      </span>
    `).join('');
  },

  buildProjects() {
    const container = document.getElementById('projects-grid');
    if (!container || !portfolioData.projects) return;
    const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%23D6D6D1'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='Inter,sans-serif' font-size='24' fill='%2366665F'%3EProject Preview%3C/text%3E%3C/svg%3E";

    container.innerHTML = portfolioData.projects.map((proj, i) => `
      <article class="project-card" data-animate="fade-up" data-delay="${i * 80}">
        <div class="project-img-wrapper">
          <img src="${proj.image || fallbackImage}"
               alt="${proj.name} screenshot"
               loading="lazy">
        </div>
        <div class="project-card__body">
          <h3 class="project-card__title">${proj.name}</h3>
          <p class="project-card__desc">${proj.description}</p>
          <div class="project-card__tech">
            ${proj.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('')}
          </div>
          <div class="project-card__actions">
            ${proj.liveUrl && proj.liveUrl !== '#' ? `<a href="${proj.liveUrl}" class="btn-project btn-project--live" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt" aria-hidden="true"></i> Live Demo</a>` : ''}
            ${proj.githubUrl && proj.githubUrl !== '#' ? `<a href="${proj.githubUrl}" class="btn-project btn-project--github" target="_blank" rel="noopener noreferrer"><i class="fab fa-github" aria-hidden="true"></i> GitHub</a>` : ''}
            ${(proj.liveUrl === '#' || !proj.liveUrl) && (proj.githubUrl === '#' || !proj.githubUrl) ? `<a href="#" class="btn-project btn-project--live"><i class="fas fa-eye" aria-hidden="true"></i> View Project</a>` : ''}
          </div>
        </div>
      </article>
    `).join('');
    container.querySelectorAll('.project-img-wrapper img').forEach((img, i) => {
      img.addEventListener('error', () => {
        img.onerror = null;
        const name = encodeURIComponent(portfolioData.projects[i]?.name || 'Project');
        img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%23D6D6D1'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='Inter,sans-serif' font-size='24' fill='%2366665F'%3E${name}%3C/text%3E%3C/svg%3E`;
      }, { once: true });
    });
  },


  buildServices() {
    const container = document.getElementById('services-grid');
    if (!container || !portfolioData.services) return;

    container.innerHTML = portfolioData.services.map((svc, i) => `
      <article class="service-card" data-animate="fade-up" data-delay="${i * 60}">
        <div class="service-card__icon">
          <i class="${svc.icon}" aria-hidden="true"></i>
        </div>
        <h3 class="service-card__name">${svc.name}</h3>
        <p class="service-card__desc">${svc.description}</p>
      </article>
    `).join('');
  },

  buildContactInfo() {
    if (!portfolioData.personal && !portfolioData.socialLinks) return;
    const { personal, socialLinks, contact } = portfolioData;
    const info = contact || personal;

    // Email
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink) {
      emailLink.href        = `mailto:${info.email}`;
      emailLink.textContent = 'Send Email';
    }

    // Phone
    const phoneLink = document.getElementById('contact-phone-link');
    if (phoneLink) {
      phoneLink.href        = `tel:${info.phone}`;
      phoneLink.textContent = 'Call Ahmed';
    }

    // Location
    const locEl = document.getElementById('contact-location-text');
    if (locEl) locEl.textContent = info.location;

    // LinkedIn
    const liLink = document.getElementById('contact-linkedin-link');
    if (liLink && socialLinks.linkedin) {
      liLink.href        = socialLinks.linkedin;
      liLink.textContent = 'Visit LinkedIn';
    }

    // GitHub
    const ghLink = document.getElementById('contact-github-link');
    if (ghLink && socialLinks.github) {
      ghLink.href        = socialLinks.github;
      ghLink.textContent = 'Visit GitHub';
    }
  },

  buildFooter() {
    if (!portfolioData.personal || !portfolioData.socialLinks) return;
    const { personal, socialLinks } = portfolioData;

    const footerName  = document.getElementById('footer-name');
    const footerTitle = document.getElementById('footer-title');
    const footerLogo  = document.getElementById('footer-logo');
    const copyright   = document.getElementById('footer-copyright');

    if (footerName)  footerName.textContent  = personal.name;
    if (footerTitle) footerTitle.textContent  = personal.title.split('|')[0].trim();
    if (footerLogo)  footerLogo.textContent   = personal.initials;
    if (copyright)   copyright.textContent    = `© ${new Date().getFullYear()} ${personal.name}. All rights reserved.`;


  },
};


/* ═══════════════════════════════════════════
   7. CONTACT FORM
═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   8. SMOOTH SCROLL FOR CTA BUTTONS
═══════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH   = document.getElementById('navbar')?.offsetHeight || 70;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ═══════════════════════════════════════════
   9. INIT ON DOM READY
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Core
  ThemeManager.init();
  NavbarManager.init();
  BackToTop.init();
  ActiveNavManager.init();
  initSmoothScroll();
  TypedText.init();

  // Content
  ContentBuilder.init();

  // After content is built, run animations
  if (window.portfolioAnimations) {
    portfolioAnimations.initSkillsTabs();
    portfolioAnimations.initCounters();
    portfolioAnimations.initScrollReveal();
  }

  // Activate first skills tab
  const firstTab = document.querySelector('.skills-tab');
  if (firstTab) firstTab.click();

  // Trigger scroll-reveal on already-visible elements
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 100);
});
