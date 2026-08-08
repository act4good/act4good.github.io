# Project Context

## Project Overview

This project is a **multilingual static website** for a nonprofit organization
built on top of the [Eleventy Excellent](https://github.com/madrilene/eleventy-excellent)
starter (v4.7.x). The site communicates social impact, transparency and trust.

Target languages: **Italian** (default) and **English**.
Language is auto-detected from browser settings (`navigator.language` / `Accept-Language`)
with a manual language switcher in the header.

---

# Technology Stack

| Tool | Role |
|---|---|
| Eleventy 3.x | Static site generator |
| Nunjucks (`.njk`) | Template engine for layouts, partials, pages |
| WebC (`.webc`) | Reusable UI components |
| Tailwind CSS v3 | Utility classes + design tokens |
| PostCSS + cssnano | CSS build pipeline (runs before Eleventy) |
| Node ≥ 24.x | Runtime requirement |
| ES Modules | `"type": "module"` throughout — use `import`/`export`, never `require()` |

**Allowed content formats:**
* Nunjucks (`.njk`) — layouts, partials, pages with template logic
* Markdown (`.md`) — pure content pages
* WebC (`.webc`) — reusable UI components

---

# Actual Project Structure

```
src/

├── _config/                  # Eleventy configuration modules
│   ├── collections.js        # Custom collections (allPosts, tagList, showInSitemap)
│   ├── events.js             # Before-build hooks (CSS + JS pipeline)
│   ├── filters.js            # Template filters (dates, slugify, striptags, etc.)
│   ├── plugins.js            # Eleventy plugins (webc, rss, syntax highlight, image, etc.)
│   ├── shortcodes.js         # Shortcodes (image, svg)
│   ├── events/
│   │   ├── build-css.js      # PostCSS + Tailwind + autoprefixer + cssnano
│   │   └── build-js.js       # JS bundler (esbuild)
│   └── setup/
│       ├── create-colors.js  # Generate color palette from design tokens
│       └── generate-favicons.js
│
├── _data/                    # Global data — JS (ES modules), JSON, YAML
│   ├── meta.js               # Site metadata: URL, siteName, lang, locale, author, OG
│   ├── navigation.js         # Nav arrays: top[] and bottom[]; items use key+urls for i18n
│   ├── helpers.js            # Utility functions (getLinkActiveState, random, etc.)
│   ├── personal.yaml         # Org-specific data
│   ├── designTokens/         # Design tokens → Tailwind utilities
│   │   ├── colors.json
│   │   ├── fonts.json
│   │   ├── spacing.json
│   │   ├── textSizes.json
│   │   └── ...
│   │
│   # ── MULTILINGUAL ADDITIONS ──────────────────────────
│   ├── languages.js          # Supported languages config array
│   └── translations/
│       ├── it.js             # Italian UI strings
│       └── en.js             # English UI strings
│
├── _includes/
│   ├── head/                 # <head> partials (Nunjucks)
│   │   ├── meta-info.njk     # SEO, OpenGraph, canonical, hreflang
│   │   ├── schema.njk        # JSON-LD structured data
│   │   ├── css-inline.njk    # Inlines compiled CSS
│   │   ├── js-inline.njk     # Inlines critical JS
│   │   ├── js-defer.njk      # Deferred scripts
│   │   └── preloads.njk
│   ├── partials/             # Shared page fragments (Nunjucks)
│   │   ├── header.njk
│   │   ├── footer.njk
│   │   ├── main-nav.njk
│   │   └── ...
│   ├── webc/                 # Reusable WebC components (.webc)
│   │   ├── custom-card.webc
│   │   ├── custom-svg.webc
│   │   └── ...
│   ├── css/                  # Per-page/component CSS (inlined)
│   ├── scripts/              # Per-page/component JS (inlined)
│   └── schemas/              # JSON-LD schema partials
│
├── _layouts/                 # Page layouts — NOT inside _includes/
│   ├── base.njk              # Root layout: <html>, <head>, <body>
│   ├── page.njk              # Generic content page
│   ├── post.njk              # Blog post layout
│   └── tags.njk              # Tag archive layout
│
├── assets/
│   ├── css/                  # CSS entry points (processed by build-css.js)
│   ├── scripts/              # JS source files
│   ├── fonts/
│   ├── images/
│   │   └── projects/         # Screenshots for Featured Projects section
│   ├── og-images/
│   └── svg/
│
├── common/                   # Site-wide generated files
│   ├── sitemap.njk
│   ├── robots.njk
│   ├── feed-atom.njk
│   ├── 404.md
│   └── ...
│
├── content/                  # ── MULTILINGUAL CONTENT ──────────────────────
│   ├── it/
│   │   ├── it.json           # Data cascade: lang=it, permalink=/it/{{slug}}/
│   │   ├── index.md          # Italian homepage content
│   │   └── about.md
│   └── en/
│       ├── en.json           # Data cascade: lang=en, permalink=/en/{{slug}}/
│       ├── index.md
│       └── about.md
│
├── pages/                    # Utility/structural pages (language-neutral)
│
└── posts/                    # Blog posts
    ├── posts.json
    └── 2024/
```

---

# Templates

## Layouts (`src/_layouts/`)

Live in `src/_layouts/` — **not** inside `_includes/`. Aliases registered in `eleventy.config.js`:

```js
eleventyConfig.addLayoutAlias('base', 'base.njk');
eleventyConfig.addLayoutAlias('page', 'page.njk');
eleventyConfig.addLayoutAlias('post', 'post.njk');
```

Use the alias in front matter:
```yaml
---
layout: page
title: About
---
```

Examples: `base.njk`, `page.njk`, `post.njk`, `tags.njk`

## Reusable UI Components (`src/_includes/webc/`)

WebC components (`.webc`) — colocate HTML, CSS, and JS in a single file.

Examples: `custom-card.webc`, `custom-svg.webc`

## Shared Partials (`src/_includes/partials/`)

Nunjucks (`.njk`) fragments included into layouts.

Examples: `header.njk`, `footer.njk`, `main-nav.njk`

## Head Fragments (`src/_includes/head/`)

Included into `base.njk` for SEO, OG, schema, CSS/JS injection.

Examples: `meta-info.njk`, `schema.njk`, `css-inline.njk`

---

# Internationalization

## Strategy

- Content organized by language under `src/content/{lang}/`
- Each language folder has a directory data file (`{lang}.json`) that sets
  `lang`, `locale`, and the `permalink` prefix for all pages in that folder
- UI strings (nav labels, buttons, stats) live in `src/_data/translations/{lang}.js`
- Language is auto-detected client-side from `navigator.language`
- A manual language switcher is present in the header

## Navigation i18n

Each item in `navigation.js` uses a `key` instead of a hardcoded `text`.
Items with language-specific URL slugs also carry a `urls` map; language-neutral
items (blog, footer links) keep a single `url`.

```js
// top item with language-specific URLs
{ key: 'projects', urls: { it: '/it/progetti/', en: '/en/projects/' } }

// language-neutral item
{ key: 'blog', url: '/blog/' }
```

In `main-nav.njk` and `footer.njk` the label and URL are resolved at render time:

```njk
{% set t = translations[lang or meta.lang] %}
{{ t.nav[item.key] }}                                        {# translated label #}
{{ item.urls[lang or meta.lang] if item.urls else item.url }} {# correct URL     #}
```

All `nav.*` keys (including `privacy`, `accessibility`, `legal`) must be present
in every translation file.

## Language Config (`src/_data/languages.js`)

```js
export default [
  { code: 'it', label: 'Italiano', default: true },
  { code: 'en', label: 'English',  default: false }
];
```

## Directory Data File (`src/content/it/it.json`)

```json
{
  "lang": "it",
  "locale": "it_IT",
  "permalink": "/it/{{ page.fileSlug }}/"
}
```

## Translation Files (`src/_data/translations/it.js`)

Only reusable UI text. Page-specific content stays in Markdown/Nunjucks files.

```js
export default {
  nav:    { home: 'Home', about: 'Chi siamo', projects: 'Progetti' },
  common: { donate: 'Dona ora', learnMore: 'Scopri di più' },
  impact: {
    volunteers: 'Volontari', projects: 'Progetti',
    helped: 'Persone aiutate', countries: 'Paesi'
  }
};
```

## Adding a New Language

1. Add entry to `src/_data/languages.js`
2. Create `src/content/{lang}/` with `{lang}.json` data file
3. Add `src/_data/translations/{lang}.js`
4. Translate content pages

---

# Deployment

## GitHub Pages + GitHub Actions

Workflow file: `.github/workflows/deploy.yml`

Steps:
1. Checkout repository
2. Setup Node 24
3. `npm ci`
4. `npm run build` (set `URL` env var to production domain)
5. Deploy `dist/` to `gh-pages` branch via `peaceiris/actions-gh-pages`

A `CNAME` file with the custom domain is committed to the repository or generated by Eleventy.

## Netlify

Configuration: `netlify.toml` (already present in the template).
Set `URL` in Netlify environment variables. Build command: `npm run build`. Publish dir: `dist`.

## Vercel

Configuration: `vercel.json` (already present in the template).
Set `URL` in Vercel environment variables. Framework preset: Other.

## GoDaddy Domain

For a **subdomain** (`www.example.com`): add a `CNAME` record pointing to the
deployment target (`{username}.github.io`, Netlify hostname, or Vercel hostname).

For an **apex domain** (`example.com`) on GitHub Pages: add four `A` records
pointing to GitHub Pages IPs:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

---

# Build Commands

```bash
npm start           # dev server with live reload (localhost:8080)
npm run build       # production build → dist/
npm run clean       # wipe dist/ + compiled CSS/JS
npm run favicons    # generate favicons from src/assets/svg/misc/logo.svg
npm run colors      # regenerate color palette from design tokens
npm run test:a11y   # accessibility test with pa11y-ci
```

Output folder: `dist/`

---

# Pages
1. Home
2. Projects
3. join us
4. blog


# Homepage Sections

Each language's `index.md` or `index.njk` must contain:

## 1 — How it Works

Four-step process with icons:
- 💡 Le nonprofit pubblicano idee / Nonprofits publish ideas
- 👩‍💻 I developer si uniscono / Developers join
- 🚀 Si costruisce insieme / Build together
- ❤️ Le comunità ne beneficiano / Communities benefit

## 2 — Why Join (3-column cards)

- Make an impact / Fai la differenza
- Grow your skills / Cresci professionalmente
- Meet amazing people / Incontra persone straordinarie

## 3 — Featured Projects (card grid with screenshots)

Use `custom-card.webc` or a dedicated WebC component.
Screenshots: `src/assets/images/projects/`.
Projects: Emergency app · Food sharing platform · Education portal · Accessibility tools

## 4 — Impact (stats row)

Stored in `translations.impact.*`:
- 250+ Volunteers / Volontari
- 45 Projects / Progetti
- 120k People helped / Persone aiutate
- 18 Countries / Paesi

---

# Quality Requirements

The website must support:

* SEO: meta title, description, canonical, hreflang (via `head/meta-info.njk`)
* OpenGraph metadata: default image + per-page override
* Sitemap: `src/common/sitemap.njk`
* robots.txt: `src/common/robots.njk`
* Accessibility WCAG AA — tested with pa11y (`npm run test:a11y`)
* Responsive design: fluid type and spacing via design tokens
* Optimized images: `@11ty/eleventy-img` (WebP + JPEG, lazy loaded)
* Fast loading: CSS/JS inlined and minified, no render-blocking resources

---

# Design Philosophy

Prefer:

* Simplicity and explicit structures over magic conventions
* WebC for reusable components (colocated HTML + CSS + JS in one file)
* Nunjucks for layouts, partials, and pages with template logic
* Markdown for pure content
* Tailwind for utilities; design tokens for consistency
* Progressive enhancement — works without JavaScript
* Minimal additions beyond the starter's existing dependencies

Avoid:

* unnecessary frameworks
* duplicated markup
* hidden magic behavior

---

# Content Editing Guide

→ See `docs/HOW-ELEVENTY-WORKS.md` for a full guide on adding pages,
  sections, components, and content for editors and developers.

→ See `docs/DEPLOY.md` for step-by-step deployment instructions
  (GitHub Pages, GitHub Actions, GoDaddy domain, HTTPS).

