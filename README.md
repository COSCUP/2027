# COSCUP 2027 — Landing Page

Static landing page for **COSCUP 2027**, the annual conference held by the
Taiwanese open source community since 2006.

The visual language follows the
[COSCUP 2026 key visual](https://coscup.org/2026/_ipx/s_3800x1664/banner.webp):
a flat, thick-outlined summer illustration in emerald / ocean-blue / lime with
coral, sunshine and grape accents. The information architecture follows the
[COSCUP 2024 landing page](https://coscup.org/2024/en/landing).

> **Call for Proposals is not open yet.** The primary call to action on this
> page is therefore **Donate**, not CfP. When the CfP opens, see
> [Opening the Call for Proposals](#opening-the-call-for-proposals).
>
> **Volunteer recruitment *is* open.** The `#volunteer` section is generated
> from data — see [Volunteer teams](#volunteer-teams).

---

## Stack

No build step, no dependencies. Plain HTML, CSS custom properties and native
ES modules — open `index.html` and it works.

## Project layout

```
.
├── index.html              # the page; Traditional Chinese is the source of truth
├── site.webmanifest        # PWA / install metadata
├── robots.txt              # crawler policy + sitemap pointer
├── sitemap.xml             # single-URL sitemap with hreflang alternates
└── assets/
    ├── css/                # linked in cascade order — do not reorder
    │   ├── tokens.css      # design tokens only: colour, type, space, motion
    │   ├── base.css        # reset, document defaults, a11y utilities
    │   ├── layout.css      # page shell: wrap, header, nav, footer
    │   ├── components.css  # reusable pieces: button, card, badge, pill …
    │   └── sections.css    # one block per page section
    ├── js/                 # native ES modules, loaded from main.js
    │   ├── config.js       # site data: dates, links, contacts, archive years
    │   ├── i18n.js         # zh-Hant ⇄ en switching
    │   ├── ui.js           # nav, scroll spy, reveal, parallax, back-to-top
    │   └── main.js         # entry point; boots each feature independently
    └── img/
        ├── hero-scene.svg  # hand-drawn key-visual scene (island / sea / rings)
        ├── donate-badge.svg
        ├── favicon.svg     # source for icon-192.png / icon-512.png
        ├── og-cover.svg    # source for og-cover.png
        └── og-cover.png    # 1200×630 social share card
```

## Local preview

Native ES modules need an HTTP origin — `file://` will not work.

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Conventions

### CSS

* **Tokens are the only place raw colours live.** Components reference
  semantic aliases (`--color-brand`, `--color-text-muted`), never hex values.
* Class names are BEM-ish: `.block__element--modifier`.
* Media queries sit next to the rules they modify, not in a separate file.
* The illustration style is reproduced with `--line-w` outlines and
  **hard, blur-free** offset shadows (`--shadow-sticker*`). Keep it that way —
  a soft blur immediately breaks the sticker look.
* The page ships a single light theme on purpose; the key visual is a bright
  summer illustration and a dark variant would fight it. Deep navy is used as
  a *section* background (`--color-bg-deep`), not as a colour scheme.

### JavaScript

* Every behaviour is **progressive enhancement**. With JS disabled the page is
  still complete and navigable; nothing is hidden by default that JS must
  reveal. The reveal-on-scroll styles are gated behind a `.js-reveal-enabled`
  class that only `ui.js` adds.
* DOM hooks use `data-js="…"` attributes, never CSS classes, so restyling can
  never break behaviour.
* `main.js` wraps each initialiser in `try/catch` — one broken enhancement
  cannot take the rest of the page down.
* `prefers-reduced-motion` is honoured in both CSS and JS.

### Internationalisation

`index.html` is written in Traditional Chinese and **is the source of truth for
that language**. `assets/js/i18n.js` holds *only* the English strings; at boot
it snapshots the Chinese text from the DOM, so no string is ever duplicated.

To add or change a translated string:

1. Put the Chinese text in the markup with `data-i18n="some.key"`.
2. Add the same key to the `EN` object in `assets/js/i18n.js`.

A key missing from `EN` falls back to the on-screen text rather than blanking
the element, so a forgotten translation degrades quietly.

Because switching swaps `textContent`, a translated element must not contain
markup you want to keep. Where a link sits inside a sentence, wrap only the
words in `data-i18n` and leave the `<a>` as a sibling — see `.apply__note` in
`index.html`.

**One dataset is bilingual in place:** `VOLUNTEER_TEAMS` in `config.js` carries
`{ zh, en }` pairs, because those cards are rendered by `ui.js` and re-render
on the `coscup:langchange` event rather than going through `data-i18n`.

The visitor's choice is stored in `localStorage` under
`coscup2027:lang`; first-time visitors are matched against `navigator.languages`.

### SEO

Kept in `index.html`'s `<head>` and worth re-checking on every content change:

* `<title>`, `description`, `canonical`, and `robots`
* `hreflang` alternates for `zh-Hant`, `en` and `x-default`
* Open Graph + Twitter card, pointing at `assets/img/og-cover.png` (1200×630)
* JSON-LD `@graph` with `Organization`, `WebSite` and `Event`

`Event.startDate` is deliberately `"2027-08"` — a valid ISO 8601 month. The
exact dates are not announced, and publishing a guessed day would be worse than
month precision.

## Common edits

### Changing dates, links or contacts

`assets/js/config.js` holds the structured data (links, archive years, flags).
The visible strings live in `index.html` (Chinese) and `i18n.js` (English), and
the `<head>` metadata is in `index.html`. When the dates are confirmed, update:

1. `hero.date` / `hero.venue` — in `index.html` **and** `i18n.js`
2. `SITE.startDate`, `SITE.datesConfirmed`, `SITE.venueConfirmed` in `config.js`
3. `Event.startDate` and `Event.location` in the JSON-LD block
4. `assets/img/og-cover.svg`, then re-render:
   `cd assets/img && rsvg-convert -w 1200 -h 630 og-cover.svg -o og-cover.png`

### Volunteer teams

The `#volunteer` section is rendered by `initVolunteerTeams()` in `ui.js` from
`VOLUNTEER_TEAMS` in `config.js`. Source of truth for the content:
<https://s.coscup.org/27volunteer>.

Each team has a `status`:

| `status`  | Meaning                     | Card shows                          |
| --------- | --------------------------- | ----------------------------------- |
| `open`    | a sign-up form is live      | green badge, link to `formUrl`      |
| `email`   | apply by writing to a inbox | yellow badge, `mailto:` that `email`|
| `pending` | not accepting yet           | grey badge, `mailto:` team leaders  |

**When a team's form opens**, change two lines in `config.js`:

```js
{ id: 'design', name: { zh: '設計組', en: 'Design Team' },
  status: 'open',                                   // was 'pending'
  formUrl: 'https://s.coscup.org/27volunteerdesign' // new
},
```

Nothing else needs touching — the grid, badge and link all follow.

Teams without a form fall back to `CONTACTS.teamLeaders`, which is spelled
`2026teamleaders@coscup.org`. That is the address the official recruitment
document publishes; the `2026` is intentional, not a typo to correct here.

The `<ul data-js="team-list">` in `index.html` ships a fallback card pointing at
the full recruitment document, which is what a visitor without JavaScript sees.

### Adding last year's site to the footer archive

Bump `ARCHIVE_LAST` in `assets/js/config.js`. The list renders itself.

### Opening the Call for Proposals

1. Set `SITE.cfpOpen = true` in `assets/js/config.js`.
2. Add the CfP button to `.hero__actions` in `index.html`, alongside Donate.
3. Remove the `.hero__note` "not open yet" block.
4. Add `nav.cfp` to the nav list and to `EN` in `i18n.js`.

## Regenerating images

```sh
cd assets/img
rsvg-convert -w 1200 -h 630 og-cover.svg -o og-cover.png
rsvg-convert -w 192  -h 192 favicon.svg  -o icon-192.png
rsvg-convert -w 512  -h 512 favicon.svg  -o icon-512.png
```

## Licence

Site content is released under **CC BY 4.0**. COSCUP brand assets and sponsor
marks remain the property of their respective owners.
