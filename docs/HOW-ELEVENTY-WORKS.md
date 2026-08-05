# How Eleventy Works — Developer & Editor Guide

A practical reference for adding pages, sections, components, translations, and blog posts to this site.

---

## Table of Contents

1. [How Eleventy processes your files](#1-how-eleventy-processes-your-files)
2. [Project structure explained](#2-project-structure-explained)
3. [How to add a new page](#3-how-to-add-a-new-page)
4. [How to add a new section to an existing page](#4-how-to-add-a-new-section-to-an-existing-page)
5. [How to create a new WebC component](#5-how-to-create-a-new-webc-component)
6. [How to edit navigation](#6-how-to-edit-navigation)
7. [How to add or edit translations](#7-how-to-add-or-edit-translations)
8. [How to add a new language](#8-how-to-add-a-new-language)
9. [How to write and publish blog posts](#9-how-to-write-and-publish-blog-posts)
10. [How design tokens work](#10-how-design-tokens-work)
11. [How the CSS pipeline works](#11-how-the-css-pipeline-works)
12. [Common front matter fields reference](#12-common-front-matter-fields-reference)

---

## 1. How Eleventy processes your files

When you run `npm start` or `npm run build`, the following happens in order:

1. **CSS build** — PostCSS reads `src/assets/css/*.css`, runs Tailwind CSS, autoprefixer, and cssnano, and writes compiled output used by the templates.
2. **JS build** — esbuild bundles scripts from `src/assets/scripts/`.
3. **Eleventy** — processes all `.md`, `.njk`, and `.webc` files under `src/`, applying layouts, data, filters, and shortcodes, then writes the final HTML to `dist/`.

Output folder: `dist/`
Dev server URL: `http://localhost:8080`

### Data cascade

Every page in Eleventy has access to data from multiple sources, merged in this order (highest priority first):

1. Front matter in the file itself
2. Directory data files (e.g. `src/posts/posts.json`)
3. Global data files (e.g. `src/_data/meta.js`)

This means a value in a page's front matter always wins over a global default.

---

## 2. Project structure explained

```
src/
├── _config/        Configuration: collections, filters, plugins, build events
├── _data/          Global data available in every template
├── _includes/      Partials, components, head fragments, CSS, scripts
│   ├── head/       Fragments included in <head> (SEO, CSS injection, etc.)
│   ├── partials/   Shared Nunjucks fragments (header, footer, nav, etc.)
│   ├── webc/       Reusable WebC components (.webc)
│   ├── css/        Per-page CSS files (inlined at build time)
│   └── scripts/    Per-page JS files (inlined at build time)
├── _layouts/       Page layouts (base.njk, page.njk, post.njk, tags.njk)
├── assets/         Static assets (CSS source, fonts, images, SVGs)
├── common/         Site-wide files (sitemap, robots.txt, RSS feed, 404)
├── content/        Multilingual content (it/, en/)
├── pages/          Language-neutral utility pages
└── posts/          Blog posts
```

**Key rule:** layouts live in `src/_layouts/`, not inside `_includes/`. All other reusable fragments live inside `src/_includes/`.

---

## 3. How to add a new page

### Simple content page (Markdown)

1. Create the file in the appropriate content folder:

```
src/content/it/my-new-page.md
src/content/en/my-new-page.md
```

2. Add front matter at the top:

```yaml
---
title: My New Page
description: A short description for SEO.
layout: page
---

Your content here in **Markdown**.
```

The `permalink` is set automatically by the language directory data file (`it.json` / `en.json`):
- Italian page → `/it/my-new-page/`
- English page → `/en/my-new-page/`

### Page with template logic (Nunjucks)

Use `.njk` instead of `.md` when you need loops, conditionals, or include other partials:

```
src/content/it/projects.njk
```

```njk
---
title: Progetti
layout: page
---

<div class="wrapper">
  {% for project in projects %}
    <p>{{ project.name }}</p>
  {% endfor %}
</div>
```

### Override the permalink

To set a custom URL, add `permalink` to the front matter:

```yaml
---
title: Home
permalink: /it/
---
```

---

## 4. How to add a new section to an existing page

### In a Markdown page

Sections in Markdown pages are written as regular Markdown content. If you need a more structured HTML layout, switch the file to `.njk`.

### In a Nunjucks page

Add a `<section>` block directly in the `.njk` file. Example:

```njk
<section class="full | region">
  <div class="wrapper flow">
    <h2>New section title</h2>
    <p>Section content.</p>
  </div>
</section>
```

### Using a WebC component

If the section will be reused across pages, turn it into a WebC component (see §5) and use the tag in the page:

```njk
<impact-stats></impact-stats>
```

### Layout utilities (CSS classes)

The template uses a set of layout utility classes from the design system:

| Class | Effect |
|---|---|
| `wrapper` | Centered container with max-width |
| `region` | Vertical padding (responsive) |
| `flow` | Vertical spacing between children |
| `full` | Full-width bleed (breaks out of wrapper) |
| `cluster` | Horizontal flex group |
| `grid` | Auto-fill grid |
| `prose` | Readable text column with comfortable width |

---

## 5. How to create a new WebC component

WebC components colocate HTML, CSS, and JS in a single `.webc` file.

### 1. Create the file

```
src/_includes/webc/custom-impact-stats.webc
```

### 2. Write the component

```html
<section class="impact-stats | region wrapper" webc:root>
  <ul class="cluster" role="list">
    <li>
      <strong>250+</strong>
      <span @text="t.impact.volunteers"></span>
    </li>
    <li>
      <strong>45</strong>
      <span @text="t.impact.projects"></span>
    </li>
  </ul>
</section>

<style webc:scoped>
  .impact-stats strong {
    font-size: var(--size-fluid-4);
  }
</style>
```

Key WebC attributes:

| Attribute | Effect |
|---|---|
| `webc:root` | Applies the component's classes to the root element |
| `webc:scoped` | Scopes the `<style>` block to this component only |
| `@text="expr"` | Sets the text content from a JS expression |
| `@html="expr"` | Sets inner HTML from a JS expression |
| `:attr="expr"` | Binds an HTML attribute dynamically |
| `<slot>` | Inserts slotted content passed by the caller |

### 3. Use the component in a page

WebC components registered in `src/_includes/webc/` are automatically available by their filename:

```html
<!-- in any .njk or .webc page -->
<custom-impact-stats></custom-impact-stats>
```

No import is needed.

---

## 6. How to edit navigation

Navigation items are defined in `src/_data/navigation.js`:

```js
export default {
  top: [
    { text: 'Home',     url: '/it/' },
    { text: 'About',    url: '/it/about/' },
    { text: 'Projects', url: '/it/projects/' }
  ],
  bottom: [
    { text: 'Privacy',  url: '/it/privacy/' }
  ]
};
```

- `top` → items shown in the main header navigation
- `bottom` → items shown in the footer

For a multilingual site, use translation keys instead of hardcoded text and resolve them in the partial (see §7).

---

## 7. How to add or edit translations

Translation files live in `src/_data/translations/`:

```
src/_data/translations/it.js   ← Italian
src/_data/translations/en.js   ← English
```

Each file exports a plain object with UI strings organized by section:

```js
// src/_data/translations/it.js
export default {
  nav: {
    home: 'Home',
    about: 'Chi siamo',
    projects: 'Progetti'
  },
  common: {
    learnMore: 'Scopri di più',
    donate: 'Dona ora'
  },
  impact: {
    volunteers: 'Volontari',
    projects: 'Progetti',
    helped: 'Persone aiutate',
    countries: 'Paesi'
  }
};
```

**Rules:**
- Only put UI strings here (labels, buttons, generic headings)
- Page-specific content (body text, descriptions) belongs in the Markdown/Nunjucks content files
- Keep the same key structure across all language files

### Using translations in templates

Make the translation object available to a layout by loading the right file based on `lang`:

```njk
{# in a layout or partial #}
{% set t = translations[lang] %}
<button>{{ t.common.donate }}</button>
```

---

## 8. How to add a new language

1. **Register the language** in `src/_data/languages.js`:

```js
export default [
  { code: 'it', label: 'Italiano', default: true },
  { code: 'en', label: 'English',  default: false },
  { code: 'fr', label: 'Français', default: false }   // new
];
```

2. **Create the content folder** and directory data file:

```
src/content/fr/fr.json
```

```json
{
  "lang": "fr",
  "locale": "fr_FR",
  "permalink": "/fr/{{ page.fileSlug }}/"
}
```

3. **Add a translation file**:

```
src/_data/translations/fr.js
```

Copy the structure from `it.js` and translate all values.

4. **Add content pages**:

```
src/content/fr/index.md
src/content/fr/about.md
```

---

## 9. How to write and publish blog posts

### File location and naming convention

Posts live in `src/posts/` organized by year:

```
src/posts/2025/my-post-title.md
```

Use a date prefix for easy sorting:

```
src/posts/2025/2025-08-04-my-post-title.md
```

Posts with images can be a folder:

```
src/posts/2025/2025-08-04-my-post-title/
    index.md
    cover.jpg
```

### Front matter

```yaml
---
title: 'My Post Title'
description: 'A short description for SEO and feed readers.'
date: 2025-08-04
tags:
  - announcements
  - projects
---
```

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Post title |
| `description` | Recommended | Used for SEO and RSS feed |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `tags` | Optional | Array of topic tags |
| `draft: true` | Optional | Hides the post from production build |

### Post URL

The URL is generated automatically from the title via the `slugify` filter, as defined in `src/posts/posts.json`:

```
/blog/my-post-title/
```

### Drafts

Add `draft: true` to the front matter to exclude a post from the production build while keeping it in the repository:

```yaml
---
draft: true
---
```

---

## 10. How design tokens work

Design tokens are the single source of truth for colors, spacing, typography, and more.

### Token files

```
src/_data/designTokens/
├── colors.json       Color palette
├── colorsBase.json   Base color values (used to generate the palette)
├── fonts.json        Font families
├── spacing.json      Spacing scale
├── textSizes.json    Font size scale
├── textLeading.json  Line height scale
├── textWeights.json  Font weight values
├── borderRadius.json Border radius scale
└── viewports.json    Breakpoint definitions
```

### How tokens become Tailwind utilities

`tailwind.config.js` imports each token file and uses `tokensToTailwind()` to convert the items array into Tailwind theme values. For example, a spacing token named `s-m` becomes the Tailwind utility `p-space-s-m`, `gap-space-s-m`, etc.

For fluid values (spacing and font sizes), `clampGenerator()` generates `clamp()` CSS functions that smoothly scale between viewport sizes.

### Semantic color tokens

In addition to raw token colors, the following **semantic CSS variables** are available and map to the current theme (light/dark):

| CSS variable | Tailwind class |
|---|---|
| `--color-primary` | `text-theme-primary`, `bg-theme-primary` |
| `--color-bg` | `bg-theme-bg` |
| `--color-text` | `text-theme-text` |
| `--color-light` | `bg-theme-light` |
| `--color-dark` | `bg-theme-dark` |

Use semantic tokens in components so they automatically adapt to dark mode.

### Adding a new color

1. Open `src/_data/designTokens/colors.json`
2. Add your color to the `items` array following the existing format
3. Run `npm run colors` to regenerate the color palette CSS
4. The new color is immediately available as a Tailwind utility

---

## 11. How the CSS pipeline works

```
src/assets/css/          ← entry point(s)
        ↓
build-css.js             ← PostCSS runner (runs before Eleventy)
        ↓
postcss-import           ← resolves @import statements
tailwindcss              ← generates utility classes from tokens + content scan
autoprefixer             ← adds vendor prefixes
cssnano                  ← minifies output
        ↓
src/_includes/css/       ← compiled output (temporary, gitignored)
        ↓
css-inline.njk           ← inlines the CSS into <head> of every page
```

### Adding component-level CSS

For styles scoped to a single page or component, create a CSS file in `src/_includes/css/` and include it via `{% include "css/my-component.css" %}` — it gets inlined at build time, not loaded as a separate request.

For WebC components, add a `<style webc:scoped>` block directly inside the `.webc` file.

### Tailwind usage

Tailwind classes are available on all `.md`, `.njk`, `.webc`, and `.html` files under `src/` (as configured in `tailwind.config.js` `content` array).

Use design token utility classes rather than raw Tailwind defaults:

```html
<!-- Prefer token-based utilities -->
<div class="p-space-s text-size-step-1 text-theme-text">…</div>

<!-- Avoid arbitrary values -->
<div class="p-[14px] text-[1.25rem]">…</div>
```

---

## 12. Common front matter fields reference

| Field | Type | Description |
|---|---|---|
| `layout` | string | Layout alias: `base`, `page`, `post` |
| `title` | string | Page title (shown in `<title>` and `<h1>`) |
| `description` | string | Meta description for SEO |
| `permalink` | string | Override the generated URL |
| `date` | date | Publication date (posts only, YYYY-MM-DD) |
| `tags` | array | Topic tags; `posts` tag adds to the blog collection |
| `draft` | boolean | `true` hides from production build |
| `lang` | string | Page language (`it`, `en`); usually set by data cascade |
| `locale` | string | Locale string (`it_IT`); usually set by data cascade |
| `ogImage` | string | Path to a custom Open Graph image |
| `eleventyExcludeFromCollections` | boolean | `true` excludes the page from all collections |

### Layout hierarchy

```
base.njk      ← full HTML document (<html>, <head>, <body>)
  └── page.njk    ← adds wrapper + prose container
  └── post.njk    ← adds post header, date, tags
  └── tags.njk    ← tag archive with paginated post list
```

Always choose the most specific layout. Use `page` for standard content pages and `post` only for blog posts.
