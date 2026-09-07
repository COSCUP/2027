/**
 * i18n.js — bilingual (zh-Hant / en) text switching.
 *
 * Design note
 * -----------
 * The markup in `index.html` is written in Traditional Chinese and is the
 * single source of truth for that language: it ships in the HTML, so crawlers
 * and visitors without JavaScript get the full page. This module holds *only*
 * the English strings, snapshots the Chinese ones at boot, and swaps between
 * the two. Nothing is duplicated, so a copy edit only ever happens in one
 * place per language.
 *
 * To add a string: put the Chinese in the HTML with `data-i18n="some.key"`,
 * then add the same key to `EN` below.
 *
 * @module i18n
 */

import { LANG_STORAGE_KEY } from './config.js';

/** @typedef {'zh' | 'en'} LangCode */

/** BCP 47 tags written onto `<html lang>` for each language. */
const HTML_LANG = /** @type {const} */ ({ zh: 'zh-Hant-TW', en: 'en' });

/** Document titles per language. */
const TITLES = /** @type {const} */ ({
  zh: 'COSCUP 2027｜開源人年會 Conference for Open Source Coders, Users & Promoters',
  en: 'COSCUP 2027 | Conference for Open Source Coders, Users & Promoters',
});

/** English copy, keyed exactly like the `data-i18n` attributes in the markup. */
const EN = Object.freeze({
  'a11y.skip': 'Skip to main content',

  'nav.about': 'About',
  'nav.program': 'Program',
  'nav.support': 'Support us',
  'nav.news': 'News',
  'nav.contact': 'Contact',

  'cta.donate': 'Donate',
  'cta.donateHint': 'Support the conference',
  'cta.donateNow': 'Donate to COSCUP',
  'cta.subscribe': 'Subscribe',
  'cta.corporate': 'Corporate sponsorship',

  'hero.eyebrow': 'Save the date',
  'hero.lede': 'The largest community-run open source conference in Asia, organised by the Taiwanese open source community. Let’s build the stage together in 2027.',
  'hero.date': 'August 2027 · Dates to be announced',
  'hero.venue': 'Taipei, Taiwan · Venue to be announced',
  'hero.cfpBadge': 'Not open yet',
  'hero.cfpNote': 'The Call for Proposals and booth applications will be announced later. Subscribe to the newsletter so you don’t miss the opening.',

  'stats.since': 'Running since',
  'stats.daysUnit': 'days',
  'stats.days': 'Of talks and hallway track',
  'stats.volunteer': 'Volunteer-organised',
  'stats.floss': 'Free / libre open source',

  'about.eyebrow': 'About',
  'about.title': 'About COSCUP',
  'about.p1': 'Conference for Open Source Coders, Users and Promoters (COSCUP) is an annual conference held by the Taiwanese open source community since 2006. It is a major force of free software movement advocacy in Taiwan. The event is usually held over two days, with talks, sponsor and community booths, and Birds of a Feather sessions. The chief organiser, staff, and speakers are all volunteers.',
  'about.p2': 'COSCUP aims to provide a platform for connecting open source coders, users, and promoters, and to promote FLOSS with this annual conference. No matter if you are an open source coder, a devoted promoter, an enthusiastic user, or just a newcomer — we welcome you to be part of COSCUP!',
  'about.tag1': 'Community-driven',
  'about.tag2': 'Free to attend',
  'about.tag3': 'Cross-community',
  'about.tag4': 'Open by default',

  'program.eyebrow': 'Program',
  'program.title': 'What you’ll find at COSCUP',
  'program.lede': 'Two days, dozens of tracks, hundreds of conversations. Here is what makes up a COSCUP — details for 2027 will follow.',
  'program.talks.title': 'Talks',
  'program.talks.body': 'Tracks curated by individual open source communities, spanning kernels and languages through to data science and open source governance.',
  'program.booth.title': 'Community booths',
  'program.booth.body': 'Booths run by open source communities and sponsors — the best place to meet a new project, find your people, and collect stickers.',
  'program.bof.title': 'BoF & Hacking Corner',
  'program.bof.body': 'Birds of a Feather: no slides required, just a topic worth talking about. Or roll up your sleeves at the Hacking Corner.',
  'program.fringe.title': 'Fringe events',
  'program.fringe.body': 'Welcome party, community meetups and side events, so the conversations aren’t limited to session slots.',

  'support.eyebrow': 'Donate',
  'support.title': 'Your donation holds up the stage',
  'support.lede': 'COSCUP is organised by volunteers and free for everyone to attend. Venue, network, streaming and swag are carried by our sponsors and by every individual supporter. Your contribution turns directly into those two days next summer.',
  'support.item1': 'Keeps the conference free and open to everyone',
  'support.item2': 'Funds the venue, network, live streaming and recordings',
  'support.item3': 'Supports community booths and fringe events',

  'news.eyebrow': 'Stay tuned',
  'news.title': 'How to follow along',
  'news.lede': 'The Call for Proposals, booth applications and volunteer recruitment have not opened yet. Pick whichever channel suits you and hear about it first.',
  'news.newsletter.title': 'Subscribe to the newsletter',
  'news.newsletter.body': 'Key dates and pre-event notices, delivered to your inbox.',
  'news.blog.title': 'COSCUP blog',
  'news.blog.body': 'First-hand announcements on planning progress and calls for participation.',
  'news.social.title': 'Follow us on social',
  'news.social.body': 'Facebook, Instagram, Mastodon and X — whichever one you actually check.',

  'contact.eyebrow': 'Contact',
  'contact.title': 'Get in touch',
  'contact.attendee': 'Attendee service',
  'contact.sponsorship': 'Sponsorship',
  'contact.program': 'Program',
  'contact.marketing': 'Marketing',

  'footer.desc': 'The largest open source conference in Asia, run by the community.',
  'footer.archive': 'Past editions',
  'footer.resources': 'Resources',
  'footer.blog': 'COSCUP blog',
  'footer.newsletter': 'Newsletter',
  'footer.photos': 'Event photos',
  'footer.coc': 'Code of Conduct',
  'footer.rights': 'Organizing Committee',
  'footer.license': 'Site content released under CC BY 4.0.',
});

/**
 * Chinese strings captured from the DOM at boot, keyed by `data-i18n`.
 * @type {Map<string, string>}
 */
const zhSnapshot = new Map();

/** @type {LangCode} */
let current = 'zh';

/** @returns {NodeListOf<HTMLElement>} */
const translatables = () => document.querySelectorAll('[data-i18n]');

/** Reads the visitor's stored preference, tolerating a blocked localStorage. */
function readStoredLang() {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    return stored === 'en' || stored === 'zh' ? stored : null;
  } catch {
    return null;
  }
}

/** @param {LangCode} lang */
function storeLang(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* Private mode or blocked storage — the choice simply won't persist. */
  }
}

/** Best-effort guess for first-time visitors, from the browser's languages. */
function detectLang() {
  const prefers = navigator.languages ?? [navigator.language ?? ''];
  const chinese = prefers.some((tag) => tag.toLowerCase().startsWith('zh'));
  return chinese ? 'zh' : 'en';
}

/** Paints the whole document in `lang`. @param {LangCode} lang */
function render(lang) {
  for (const el of translatables()) {
    const key = el.dataset.i18n;
    if (!key) continue;
    const text = lang === 'en' ? EN[key] : zhSnapshot.get(key);
    // An unknown key falls back to whatever is already on screen rather than
    // blanking the element — a missing translation should never lose content.
    if (typeof text === 'string') el.textContent = text;
  }

  document.documentElement.lang = HTML_LANG[lang];
  document.documentElement.dataset.lang = lang;
  document.title = TITLES[lang];

  for (const option of document.querySelectorAll('[data-lang-option]')) {
    option.classList.toggle('is-active', option.getAttribute('data-lang-option') === lang);
  }

  current = lang;
  document.dispatchEvent(new CustomEvent('coscup:langchange', { detail: { lang } }));
}

/** @returns {LangCode} the language currently displayed */
export const getLang = () => current;

/** @param {LangCode} lang */
export function setLang(lang) {
  if (lang !== 'zh' && lang !== 'en') return;
  if (lang === current) return;
  render(lang);
  storeLang(lang);
}

/** Flips between the two supported languages. */
export function toggleLang() {
  setLang(current === 'zh' ? 'en' : 'zh');
}

/**
 * Snapshots the Chinese markup, then applies the visitor's preferred language.
 * Safe to call once, on DOM ready.
 */
export function initI18n() {
  for (const el of translatables()) {
    const key = el.dataset.i18n;
    if (key && !zhSnapshot.has(key)) zhSnapshot.set(key, el.textContent.trim());
  }

  const preferred = readStoredLang() ?? detectLang();
  if (preferred !== 'zh') render(preferred);

  const toggle = document.querySelector('[data-js="lang-toggle"]');
  toggle?.addEventListener('click', toggleLang);
}
