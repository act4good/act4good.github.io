# Deployment Guide

Step-by-step instructions for deploying the site to GitHub Pages, Netlify, and Vercel, and connecting a custom domain on GoDaddy.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local build test](#2-local-build-test)
3. [GitHub repository setup](#3-github-repository-setup)
4. [GitHub Actions + GitHub Pages](#4-github-actions--github-pages)
5. [Custom domain on GitHub Pages](#5-custom-domain-on-github-pages)
6. [Netlify](#6-netlify)
7. [Vercel](#7-vercel)
8. [GoDaddy DNS configuration](#8-godaddy-dns-configuration)
9. [HTTPS enforcement](#9-https-enforcement)
10. [Environment variables reference](#10-environment-variables-reference)

---

## 1. Prerequisites

- Node.js **≥ 24.x** installed ([nodejs.org](https://nodejs.org))
- A GitHub account
- Git installed and configured

---

## 2. Local build test

Before deploying, verify the production build works locally.

```bash
# Install dependencies
npm ci

# Run production build
npm run build
```

The output is written to `dist/`. Open it with any static file server to verify:

```bash
npx serve dist
```

---

## 3. GitHub repository setup

1. Create a new repository on [github.com/new](https://github.com/new).
   - Name: e.g. `my-nonprofit-site`
   - Visibility: **Public** (required for free GitHub Pages)
   - Do **not** initialise with README or .gitignore — you already have one

2. Add the remote and push:

```bash
git init                              # if not already a git repo
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## 4. GitHub Actions + GitHub Pages

### 4.1 — Create the workflow file

Create `.github/workflows/deploy.yml` in the project root:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main          # triggers on every push to main

  workflow_dispatch:  # allows manual trigger from GitHub UI

permissions:
  contents: write     # needed by peaceiris/actions-gh-pages

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build
        env:
          URL: ${{ vars.SITE_URL }}   # set this in repo settings (see §10)

      - name: Deploy to gh-pages branch
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: yourdomain.com       # remove this line if not using a custom domain
```

> **Replace** `yourdomain.com` with your actual domain, or delete the `cname:` line entirely if you are using the default `username.github.io` URL.

### 4.2 — Enable GitHub Pages

1. Go to your repository → **Settings** → **Pages**
2. Under **Build and deployment**, set:
   - Source: **Deploy from a branch**
   - Branch: `gh-pages` / `/ (root)`
3. Click **Save**

The site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/` after the first successful workflow run.

### 4.3 — Verify the deployment

Go to **Actions** tab in your repository. The workflow `Deploy to GitHub Pages` should appear and turn green. If it fails, check the logs for details.

---

## 5. Custom domain on GitHub Pages

### 5.1 — Add CNAME file to the build

The `cname:` field in the workflow (§4.1) automatically writes a `CNAME` file to the `gh-pages` branch root. This is sufficient — you do not need to commit a `CNAME` file manually.

### 5.2 — Configure the custom domain in GitHub

1. Repository → **Settings** → **Pages**
2. Under **Custom domain**, type your domain (e.g. `www.yourdomain.com`)
3. Click **Save**
4. GitHub will run a DNS check. It may take a few minutes to turn green after you configure DNS (§8).

---

## 6. Netlify

The template ships with `netlify.toml` already configured with security headers and cache rules.

### 6.1 — Connect the repository

1. Log in to [app.netlify.com](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project** → **GitHub**
3. Authorize Netlify and select your repository

### 6.2 — Configure build settings

Netlify auto-detects most settings, but confirm:

| Setting | Value |
|---|---|
| Base directory | *(leave empty)* |
| Build command | `npm run build` |
| Publish directory | `dist` |

### 6.3 — Set environment variables

Go to **Site configuration** → **Environment variables** → **Add a variable**:

| Key | Value |
|---|---|
| `URL` | `https://yourdomain.com` |

### 6.4 — Custom domain on Netlify

1. **Site configuration** → **Domain management** → **Add a domain**
2. Enter your domain and follow the verification steps
3. Configure DNS at GoDaddy (§8)

---

## 7. Vercel

The template ships with `vercel.json` already configured with security headers.

### 7.1 — Connect the repository

1. Log in to [vercel.com](https://vercel.com)
2. Click **Add New Project** → import from GitHub
3. Select your repository

### 7.2 — Configure build settings

| Setting | Value |
|---|---|
| Framework Preset | **Other** |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm ci` |

### 7.3 — Set environment variables

In the project settings → **Environment Variables**:

| Key | Value |
|---|---|
| `URL` | `https://yourdomain.com` |

### 7.4 — Custom domain on Vercel

1. Project → **Settings** → **Domains** → **Add**
2. Enter your domain
3. Configure DNS at GoDaddy (§8)

---

## 8. GoDaddy DNS configuration

Log in to [godaddy.com](https://godaddy.com) → **My Products** → **DNS** next to your domain.

### Option A — Subdomain (`www.yourdomain.com`)

Add a **CNAME** record:

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `www` | Target (see below) | 600 |

**Target by deployment platform:**

| Platform | CNAME target |
|---|---|
| GitHub Pages | `YOUR_USERNAME.github.io` |
| Netlify | `YOUR_SITE_NAME.netlify.app` |
| Vercel | `cname.vercel-dns.com` |

### Option B — Apex domain (`yourdomain.com`) on GitHub Pages

Add four **A** records:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 600 |
| A | `@` | `185.199.109.153` | 600 |
| A | `@` | `185.199.110.153` | 600 |
| A | `@` | `185.199.111.153` | 600 |

Also add an **AAAA** record for IPv6 (recommended):

| Type | Name | Value | TTL |
|---|---|---|---|
| AAAA | `@` | `2606:50c0:8000::153` | 600 |
| AAAA | `@` | `2606:50c0:8001::153` | 600 |
| AAAA | `@` | `2606:50c0:8002::153` | 600 |
| AAAA | `@` | `2606:50c0:8003::153` | 600 |

> DNS propagation can take up to 48 hours, though usually it completes within 30 minutes.

### Redirect apex → www (or vice versa)

GoDaddy supports **Forwarding** in the DNS panel. Add a forwarding rule:
- Forward `yourdomain.com` → `https://www.yourdomain.com` (301 permanent)

---

## 9. HTTPS enforcement

### GitHub Pages

Once your custom domain DNS resolves, go to repository → **Settings** → **Pages** and tick **Enforce HTTPS**. This provisions a Let's Encrypt certificate automatically.

### Netlify

HTTPS is enabled by default. Netlify provisions a Let's Encrypt certificate automatically when the domain resolves.

### Vercel

HTTPS is enforced by default. No action required.

---

## 10. Environment variables reference

| Variable | Description | Example |
|---|---|---|
| `URL` | Full production URL (no trailing slash) | `https://www.yourdomain.com` |
| `ELEVENTY_ENV` | Build environment (`development` / `production` / `test`) | Set automatically by npm scripts |

### Setting `URL` in GitHub Actions

In your repository → **Settings** → **Variables** → **Actions** → **New repository variable**:

- Name: `SITE_URL`
- Value: `https://www.yourdomain.com`

The workflow uses it as `${{ vars.SITE_URL }}`.

### Setting `URL` locally

Create a `.env` file at the project root (already loaded via `dotenv`):

```
URL=http://localhost:8080
```

> The `.env` file is gitignored by default. Never commit secrets to the repository.
