/**
 * config.js — single source of truth for site-wide data.
 *
 * Anything an organiser might realistically need to change between now and
 * the event (dates, external links, the archive list) lives here rather than
 * being scattered through the markup.
 *
 * @module config
 */

/** @typedef {{ href: string, label: string }} LinkItem */

export const SITE = Object.freeze({
  year: 2027,
  /** ISO 8601 at month precision — the exact dates are not announced yet. */
  startDate: '2027-08',
  datesConfirmed: false,
  venueConfirmed: false,
  /** Call for Proposals has not opened; the page shows Donate instead. */
  cfpOpen: false,
});

export const LINKS = Object.freeze({
  donate: 'https://s.coscup.org/individualsupporter',
  newsletter: 'https://secretary.coscup.org/subscribe/coscup',
  blog: 'https://blog.coscup.org/',
  photos: 'https://www.flickr.com/photos/coscup/',
  codeOfConduct: 'https://hackmd.io/@coscup/cococo-zh',
});

export const CONTACTS = Object.freeze({
  attendee: 'attendee@coscup.org',
  sponsorship: 'sponsorship@coscup.org',
  program: 'program@coscup.org',
  marketing: 'marketing@coscup.org',
});

/**
 * Every COSCUP edition that has a public archive site.
 * Bump `ARCHIVE_LAST` once the following year's site goes live.
 */
const ARCHIVE_FIRST = 2006;
const ARCHIVE_LAST = 2026;

/** @type {ReadonlyArray<number>} */
export const ARCHIVE_YEARS = Object.freeze(
  Array.from({ length: ARCHIVE_LAST - ARCHIVE_FIRST + 1 }, (_, i) => ARCHIVE_FIRST + i),
);

/**
 * @param {number} year
 * @returns {string} canonical URL of that year's archived site
 */
export const archiveUrl = (year) => `https://coscup.org/${year}/`;

/** Sections that the scroll-spy highlights in the main nav, in document order. */
export const NAV_SECTIONS = Object.freeze(['about', 'program', 'support', 'news', 'contact']);

/** localStorage key for the visitor's language choice. */
export const LANG_STORAGE_KEY = 'coscup2027:lang';
