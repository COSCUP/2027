/**
 * main.js — application entry point.
 *
 * Loaded as `<script type="module">`, so it is deferred by default and runs
 * after the document has been parsed. Its only job is to start each feature;
 * all behaviour lives in the focused modules it imports.
 *
 * @module main
 */

import { initI18n } from './i18n.js';
import {
  initBackToTop,
  initHeaderState,
  initMobileNav,
  initParallax,
  initReveal,
  initScrollSpy,
  initVolunteerTeams,
  initYearList,
} from './ui.js';

/** Everything that should run once the DOM is ready, in start-up order. */
const bootSequence = [
  initYearList,        // build DOM first, so later features can observe it
  initVolunteerTeams,  // ditto — renders from config, re-renders on language change
  initI18n,            // snapshot + translate before anything is measured
  initHeaderState,
  initMobileNav,
  initScrollSpy,
  initReveal,
  initBackToTop,
  initParallax,
];

function boot() {
  for (const init of bootSequence) {
    try {
      init();
    } catch (error) {
      // One broken enhancement must never take the rest of the page with it.
      console.error(`[COSCUP 2027] ${init.name} failed to initialise:`, error);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
