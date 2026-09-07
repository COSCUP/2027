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
  volunteer: 'https://s.coscup.org/27volunteer',
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
  /**
   * Catch-all for volunteer applications to teams whose form is not open yet.
   * Spelled `2026teamleaders@` in the official recruitment document — that is
   * the live address, not a typo to "fix" here.
   */
  teamLeaders: '2026teamleaders@coscup.org',
});

/* -------------------------------------------------------------------------
   Volunteer recruitment
   Source: https://s.coscup.org/27volunteer

   This dataset is bilingual in place, unlike the rest of the site's copy
   (see README), because the cards are rendered by `ui.js` and each team's
   state changes independently as its form opens.

   To open a team: switch `status` to 'open' and add its `formUrl`.
   ------------------------------------------------------------------------- */

/**
 * How a team is currently accepting applications.
 * - `open`    a sign-up form is live      -> needs `formUrl`
 * - `email`   apply by writing to a inbox -> needs `email`
 * - `pending` not accepting yet; applicants use the team-leaders inbox
 * @typedef {'open' | 'email' | 'pending'} TeamStatus
 */

/**
 * @typedef {object} VolunteerTeam
 * @property {string} id
 * @property {{ zh: string, en: string }} name
 * @property {{ zh: string, en: string }} [desc]
 * @property {TeamStatus} status
 * @property {string} [formUrl]
 * @property {string} [infoUrl]
 * @property {string} [email]
 */

/** @type {ReadonlyArray<VolunteerTeam>} */
export const VOLUNTEER_TEAMS = Object.freeze([
  {
    id: 'program',
    name: { zh: '議程組', en: 'Program Team' },
    desc: {
      zh: '搭起「講者」與「與會者」之間的橋樑，與各大開源社群攜手打造多元的議程內容。',
      en: 'Bridges speakers and attendees, curating a diverse program together with open source communities.',
    },
    status: 'open',
    formUrl: 'https://s.coscup.org/27volunteerprogram',
    infoUrl: 'https://hackmd.io/FRHLQGgiTYCpHUSpIlaAug',
  },
  {
    id: 'engagement',
    name: { zh: '交流組', en: 'Engagement Team' },
    status: 'pending',
  },
  {
    id: 'pr',
    name: { zh: '公關組', en: 'Public Relations' },
    status: 'email',
    email: '2026teamleaders@coscup.org',
  },
  {
    id: 'secretary',
    name: { zh: '行政組', en: 'Secretary Team' },
    status: 'pending',
  },
  {
    id: 'it',
    name: { zh: '資訊組', en: 'IT Team' },
    status: 'pending',
  },
  {
    id: 'service',
    name: { zh: '場務組', en: 'Service Team' },
    status: 'pending',
  },
  {
    id: 'sponsorship',
    name: { zh: '贊助組', en: 'Sponsorship' },
    desc: {
      zh: '與贊助商及合作夥伴維繫關係，一同為 COSCUP 搭設開源舞臺的鷹架。',
      en: 'Builds and keeps the relationships with sponsors and partners that hold up the COSCUP stage.',
    },
    status: 'email',
    email: 'sponsorship@coscup.org',
  },
  {
    id: 'documentary',
    name: { zh: '紀錄組', en: 'Documentary' },
    status: 'pending',
  },
  {
    id: 'production',
    name: { zh: '製播組', en: 'Production' },
    status: 'pending',
  },
  {
    id: 'design',
    name: { zh: '設計組', en: 'Design Team' },
    status: 'pending',
  },
]);

/** Badge and action labels for each `TeamStatus`, per language. */
export const TEAM_STATUS_LABELS = Object.freeze({
  open:    { badge: { zh: '報名中', en: 'Open' },
             action: { zh: '前往報名表單', en: 'Sign-up form' } },
  email:   { badge: { zh: '來信申請', en: 'By email' },
             action: { zh: '寄出申請信', en: 'Apply by email' } },
  pending: { badge: { zh: '尚未開放', en: 'Not open yet' },
             action: { zh: '先來信報名', en: 'Write to us' } },
});

/** Label for the secondary "read the full intro" link on a team card. */
export const TEAM_INFO_LABEL = Object.freeze({ zh: '招募說明', en: 'Details' });

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
export const NAV_SECTIONS = Object.freeze([
  'about', 'program', 'volunteer', 'support', 'news', 'contact',
]);

/** localStorage key for the visitor's language choice. */
export const LANG_STORAGE_KEY = 'coscup2027:lang';
