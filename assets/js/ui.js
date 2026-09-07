/**
 * ui.js — progressive-enhancement behaviours for the landing page.
 *
 * Every function here is optional: with JavaScript disabled the page stays
 * fully readable and navigable. Each initialiser is independent and returns
 * early when its markup hook is absent.
 *
 * @module ui
 */

import { ARCHIVE_YEARS, NAV_SECTIONS, SITE, archiveUrl } from './config.js';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs `fn` at most once per animation frame.
 * @template {(...args: any[]) => void} F
 * @param {F} fn
 * @returns {(...args: Parameters<F>) => void}
 */
function rafThrottle(fn) {
  let queued = false;
  return (...args) => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn(...args);
    });
  };
}

/* -------------------------------------------------------------------------
   Header
   ------------------------------------------------------------------------- */

/** Adds `.is-stuck` to the sticky header once the page has scrolled. */
export function initHeaderState() {
  const header = document.querySelector('[data-js="header"]');
  if (!header) return;

  const update = rafThrottle(() => {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  });

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* -------------------------------------------------------------------------
   Mobile navigation
   ------------------------------------------------------------------------- */

/** Wires the burger button, Escape key, outside clicks and link taps. */
export function initMobileNav() {
  const toggle = document.querySelector('[data-js="nav-toggle"]');
  const nav = document.querySelector('[data-js="nav"]');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    setOpen(false);
  });

  // Leaving the mobile breakpoint must not strand the panel in an open state.
  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/* -------------------------------------------------------------------------
   Scroll spy
   ------------------------------------------------------------------------- */

/** Marks the nav link whose section is currently in view. */
export function initScrollSpy() {
  const links = new Map();
  for (const id of NAV_SECTIONS) {
    const link = document.querySelector(`.site-nav__link[href="#${id}"]`);
    const section = document.getElementById(id);
    if (link && section) links.set(section, link);
  }
  if (links.size === 0) return;

  let active = null;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const link = links.get(entry.target);
        if (!link || link === active) continue;
        active?.classList.remove('is-current');
        link.classList.add('is-current');
        active = link;
      }
    },
    // A band across the upper-middle of the viewport: a section counts as
    // "current" while its content sits where the reader is actually looking.
    { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
  );

  for (const section of links.keys()) observer.observe(section);
}

/* -------------------------------------------------------------------------
   Reveal on scroll
   ------------------------------------------------------------------------- */

/**
 * Fades elements in as they enter the viewport.
 * The hiding styles are gated behind `.js-reveal-enabled` on <html>, so the
 * content is never invisible when this never runs.
 */
export function initReveal() {
  const targets = document.querySelectorAll('[data-js="reveal"]');
  if (targets.length === 0) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-reveal-enabled');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  targets.forEach((el, index) => {
    // A short stagger keeps grids from popping in as one solid block.
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(el);
  });
}

/* -------------------------------------------------------------------------
   Back to top
   ------------------------------------------------------------------------- */

/** Shows the floating button past one viewport of scrolling. */
export function initBackToTop() {
  const button = document.querySelector('[data-js="to-top"]');
  if (!button) return;

  const update = rafThrottle(() => {
    const show = window.scrollY > window.innerHeight * 0.9;
    button.hidden = !show;
    button.classList.toggle('is-visible', show);
  });

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  });

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* -------------------------------------------------------------------------
   Parallax
   ------------------------------------------------------------------------- */

/**
 * Drifts `[data-js="parallax"]` elements against the scroll position.
 * `data-parallax-depth` is the multiplier; negative values move the other way.
 */
export function initParallax() {
  const layers = [...document.querySelectorAll('[data-js="parallax"]')];
  if (layers.length === 0 || prefersReducedMotion()) return;

  const update = rafThrottle(() => {
    const y = window.scrollY;
    for (const layer of layers) {
      const depth = Number.parseFloat(layer.dataset.parallaxDepth ?? '0.1');
      layer.style.transform = `translate3d(0, ${(y * depth).toFixed(2)}px, 0)`;
    }
  });

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* -------------------------------------------------------------------------
   Footer archive list
   ------------------------------------------------------------------------- */

/**
 * Renders the past-editions list from `config.js` instead of hand-maintained
 * markup — adding next year's site is then a one-line change.
 */
export function initYearList() {
  const list = document.querySelector('[data-js="year-list"]');
  if (!list) return;

  const fragment = document.createDocumentFragment();

  for (const year of ARCHIVE_YEARS) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = archiveUrl(year);
    link.textContent = String(year);
    link.rel = 'noopener noreferrer';
    item.append(link);
    fragment.append(item);
  }

  // The current edition closes the list and is marked as the current page.
  const currentItem = document.createElement('li');
  const currentLink = document.createElement('a');
  currentLink.href = './';
  currentLink.textContent = String(SITE.year);
  currentLink.setAttribute('aria-current', 'page');
  currentItem.append(currentLink);
  fragment.append(currentItem);

  list.replaceChildren(fragment);
}
