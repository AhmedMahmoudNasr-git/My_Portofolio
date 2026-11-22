const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const animations = read('js/animations.js');
const main = read('js/main.js');
const styles = read('css/style.css');
const responsive = read('css/responsive.css');
const html = read('index.html');

test('scroll reveals animate downward and stagger each visible card', () => {
  const start = animations.indexOf('function initScrollReveal() {');
  const end = animations.indexOf('function initCounters()', start);
  assert.ok(start >= 0 && end > start, 'scroll reveal function should exist');

  class FakeClassList extends Set {
    add(...tokens) { tokens.forEach(token => super.add(token)); return this; }
  }
  const cards = Array.from({ length: 4 }, (_, i) => ({
    dataset: { animate: 'fade-up', delay: String(i * 320) },
    style: {},
    classList: new FakeClassList(),
  }));
  let revealCallback;
  class FakeIntersectionObserver {
    constructor(callback) { revealCallback = callback; }
    observe() {}
    unobserve() {}
  }
  const context = {
    document: { querySelectorAll: () => cards },
    window: { matchMedia: () => ({ matches: false }) },
    IntersectionObserver: FakeIntersectionObserver,
  };
  vm.runInNewContext(`${animations.slice(start, end)}; globalThis.runReveal = initScrollReveal;`, context);
  context.runReveal();
  assert.ok(cards.every(card => card.classList.has('pre-animate')));
  revealCallback({ forEach: callback => cards.forEach(target => callback({ target, isIntersecting: true })) });

  assert.deepEqual(cards.map(card => card.style.transitionDelay), ['0ms', '320ms', '640ms', '960ms']);
  assert.ok(cards.every(card => card.classList.has('animated') && card.classList.has('anim-fade-up')));
});

test('styles keep the downward reveal active on mobile and honor reduced motion', () => {
  assert.match(styles, /transition: opacity 1\.2s ease, transform 1\.2s/);
  assert.match(styles, /\.pre-animate\.animated \{ opacity: 1; transform: none; \}/);
  assert.match(responsive, /#home \[data-animate\]\.pre-animate \{ transform: translateY\(48px\) !important; \}/);
  assert.match(responsive, /\[data-animate\]\.pre-animate \{ opacity: 1 !important; transform: none !important; \}/);
  assert.doesNotMatch(responsive, /\.timeline-item\[data-animate\] \{ transform: none;/);
});

test('project, service, education, experience, and contact cards have staggered starts', () => {
  assert.match(main, /class="service-card" data-animate="fade-up" data-delay="\$\{i \* 90\}"/);
  assert.match(main, /timeline-item \$\{isLeft \? 'timeline-left' : 'timeline-right'\}.*data-delay="\$\{i \* 320\}"/);
  assert.match(main, /class="edu-card" data-animate="fade-up" data-delay="\$\{i \* 320\}"/);
  assert.match(main, /data-delay="\$\{i \* 320\}"/);
  assert.match(html, /class="contact-card" data-animate="fade-up" data-delay="1600"/);
});
