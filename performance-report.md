# Performance Audit Report — Reliable Engineering & Construction

**Date:** 12 Feb 2026
**Pages scanned:** 18 HTML files
**Images in /images/:** 155 files (245 MB total)
**Images referenced from HTML:** 83 files (100 MB total)

---

## EXECUTIVE SUMMARY

| Category | Severity | Issues Found |
|---|---|---|
| Render-blocking resources | 🔴 Critical | Tailwind CDN script in `<head>` on all 18 pages |
| Unoptimized images | 🔴 Critical | 88 images > 1 MB; hero image 16.8 MB |
| Missing lazy loading | 🟡 Medium | 46 of 163 `<img>` tags missing `loading="lazy"` |
| Missing width/height | 🟡 Medium | 107 of 163 `<img>` tags missing explicit dimensions |
| No WebP format | 🟡 Medium | Only 4 of 155 images are WebP; 0 `<picture>` tags used |
| Render-blocking fonts | 🟡 Medium | CSS `@import` for fonts on 8 pages; blocking `<link>` on 5 pages |
| Unused asset files | 🟢 Low | 6 JS/CSS files in /assets/ not referenced by any HTML |
| Large inline code | 🟢 Low | index.html has 59 KB inline JS + 21 KB inline CSS |
| Caching / compression | ✅ OK | .htaccess already configured with expires, gzip, cache-control |

**Estimated current PageSpeed score:** 40–55 (mobile), 55–70 (desktop)
**Estimated score after fixes:** 85–95+

---

## 1. RENDER-BLOCKING RESOURCES 🔴

### 1A. Tailwind CSS CDN — Blocking `<script>` in `<head>` (ALL 18 pages)

Every page loads the full Tailwind CSS runtime via a synchronous `<script>` in `<head>`:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Impact:** This is a ~300 KB JavaScript file that blocks rendering on every single page. It must download, parse, and execute before any content is painted.

**Pages affected:** All 18

| Page | Occurrences |
|---|---|
| about.html | 2 |
| contacts.html | 2 |
| index.html | 2 |
| All other 15 pages | 1 each |

### 1B. Render-blocking font stylesheets (5 pages)

These pages load Google Fonts via blocking `<link rel="stylesheet">` in `<head>`:

| Page | Blocking font links |
|---|---|
| commercial-renovation-singapore.html | 2 (`Archivo`, `Inter`) |
| residential-renovation-singapore.html | 2 (`Archivo`, `Inter`) |
| handyman-services-singapore.html | 2 (`Archivo`, `Inter`) |
| completed-projects.html | 1 (`Archivo`) |
| electrical-works-singapore.html | 1 (`Archivo`) |

### 1C. CSS `@import` inside `<style>` blocks (8 pages)

`@import` inside inline `<style>` is render-blocking — the browser must fetch the external stylesheet before continuing to parse CSS.

| Page | Import |
|---|---|
| about.html | Playfair+Display + Inter |
| completed-projects.html | Playfair+Display + Inter |
| contacts.html | Playfair+Display + Inter |
| electrical-works-singapore.html | Playfair+Display + Inter |
| painting-services-singapore.html | Playfair+Display + Inter |
| plastering-services-singapore.html | Playfair+Display + Inter |
| plumbing-services-singapore.html | Playfair+Display + Inter |
| tile-laying-services-singapore.html | Inter |

---

## 2. UNOPTIMIZED IMAGES 🔴

### 2A. Image size distribution (all 155 files in /images/)

| Size range | Count |
|---|---|
| > 10 MB | 2 |
| 1–10 MB | 86 |
| 500 KB – 1 MB | 34 |
| 100–500 KB | 20 |
| < 100 KB | 13 |

### 2B. Worst offenders (referenced from HTML, sorted by size)

| Size | File | Used on |
|---|---|---|
| **16,836 KB (16.4 MB)** | images/hacking/supermarket-shop-chernobyl-...ghost-town.jpg | index.html |
| **4,664 KB (4.6 MB)** | images/plumbing services/installation-replacement.jpg | index.html |
| **3,552 KB (3.5 MB)** | images/12.png | index.html (×2) |
| **2,416 KB (2.4 MB)** | images/commercial/school/toilet-bidet-tissuebox.jpg | commercial page |
| **2,228 KB (2.2 MB)** | images/commercial/school/IMG20251223154650.jpg | commercial page |
| **2,172 KB (2.1 MB)** | images/commercial/school/exhaust-glass.jpg | commercial page |
| **2,008 KB (2.0 MB)** | images/commercial/school/sink-mirror.jpg | commercial page |
| **1,996 KB (2.0 MB)** | images/commercial/Pei-chun/IMG20251223165100.jpg | commercial page |
| **1,952 KB (1.9 MB)** | images/tile services/grouting-sealing.png | index.html |
| **1,920 KB (1.9 MB)** | images/plastering/wall-plaster-repair.jpg | plastering page |
| **1,908 KB (1.9 MB)** | images/commercial/school/plumbing2.jpg | commercial page |
| **1,884 KB (1.8 MB)** | images/tile services/tile-replacement.png | index.html |
| **1,824 KB (1.8 MB)** | images/commercial/Pei-chun/IMG20251223170018.jpg | index, commercial |
| **1,808 KB (1.8 MB)** | images/tile services/tile-installation.png | index.html |
| **1,624 KB (1.6 MB)** | images/carpentry/kitchen-cabinets.png | carpentry, index |
| **1,624 KB (1.6 MB)** | images/carpentry/custom-wardrobes.png | carpentry, index, residential |
| **1,612 KB (1.6 MB)** | images/carpentry/feature-walls-tv-consoles.png | carpentry, index |
| **1,596 KB (1.6 MB)** | images/plastering/crack-repair-patching.jpg | plastering page |
| **1,436 KB (1.4 MB)** | images/services images/carpentry-works-overview.jpg | carpentry page |
| **1,436 KB (1.4 MB)** | images/services images/carpentry-works-hero.jpg | carpentry page |

### 2C. Homepage (index.html) image load — 32 images

Total image weight for index.html alone: **~47 MB**

The homepage loads 32 images. The top 5 alone total **30 MB**:
1. hacking/supermarket-shop... — 16.4 MB
2. plumbing services/installation-replacement.jpg — 4.6 MB
3. 12.png — 3.5 MB (loaded twice)
4. commercial/school/IMG20251223154650.jpg — 2.2 MB
5. tile services/tile-replacement.png — 1.8 MB

### 2D. No WebP format usage

- **WebP files in /images/:** 4 (only in handyman/ and plumbing services/)
- **`<picture>` tags in HTML:** 0
- **Potential savings:** WebP typically reduces file size by 25–35% vs JPEG and 50–80% vs PNG at equivalent visual quality

### 2E. Unreferenced large images (in /images/ but not used in any HTML)

| Size | File |
|---|---|
| 19,818 KB (19.4 MB) | images/image.png |
| 17,685 KB (17.3 MB) | images/image copy.png |
| 7,207 KB (7.0 MB) | images/services images/image.png |
| 5,104 KB (5.0 MB) | images/works.png |
| 4,775 KB (4.7 MB) | images/handyman/installation-replacement.jpg |
| 3,566 KB (3.5 MB) | images/residential/98.jpg |
| 3,095 KB (3.0 MB) | images/handyman/2149454773.jpg |
| 3,021 KB (3.0 MB) | images/Brown-Minimalist-Interior-Design-Photo-Collage-3.png |

These 8 files alone total **64 MB** and are not referenced from any HTML page.

---

## 3. MISSING LAZY LOADING 🟡

**Total `<img>` tags:** 163
**With `loading="lazy"`:** 117
**Missing `loading="lazy"`:** 46

| Page | Total imgs | Has lazy | Missing lazy |
|---|---|---|---|
| completed-projects.html | 14 | 1 | **13** |
| about.html | 16 | 10 | **6** |
| commercial-renovation-singapore.html | 16 | 13 | **3** |
| electrical-works-singapore.html | 11 | 8 | **3** |
| handyman-services-singapore.html | 7 | 4 | **3** |
| plumbing-services-singapore.html | 11 | 8 | **3** |
| residential-renovation-singapore.html | 10 | 7 | **3** |
| index.html | 32 | 30 | **2** |
| aircon-service-singapore.html | 5 | 4 | 1 |
| carpentry-works-singapore.html | 5 | 4 | 1 |
| ceiling-wall-partitions-singapore.html | 5 | 4 | 1 |
| contacts.html | 4 | 3 | 1 |
| painting-services-singapore.html | 5 | 4 | 1 |
| plastering-services-singapore.html | 5 | 4 | 1 |
| reinstatement-hacking-demolition-singapore.html | 5 | 4 | 1 |
| renovation-works-singapore.html | 2 | 1 | 1 |
| tile-laying-services-singapore.html | 5 | 4 | 1 |
| waterproofing-services-singapore.html | 5 | 4 | 1 |

**Note:** Some missing `loading="lazy"` are correct (hero/logo images above the fold should NOT be lazy). The 13 missing on completed-projects.html and 6 on about.html are the main concerns.

---

## 4. MISSING WIDTH/HEIGHT ATTRIBUTES 🟡

**Total `<img>` tags:** 163
**Missing `width=` attribute:** ~107

| Page | Total imgs | Missing width/height |
|---|---|---|
| index.html | 32 | **31** |
| commercial-renovation-singapore.html | 16 | **15** |
| about.html | 16 | **13** |
| completed-projects.html | 14 | **11** |
| residential-renovation-singapore.html | 10 | **9** |
| handyman-services-singapore.html | 7 | **6** |
| carpentry-works-singapore.html | 5 | 3 |
| ceiling-wall-partitions-singapore.html | 5 | 3 |
| painting-services-singapore.html | 5 | 3 |
| plastering-services-singapore.html | 5 | 3 |
| reinstatement-hacking-demolition-singapore.html | 5 | 3 |
| tile-laying-services-singapore.html | 5 | 3 |
| waterproofing-services-singapore.html | 5 | 3 |
| plumbing-services-singapore.html | 11 | 1 |
| aircon-service-singapore.html | 5 | 0 |
| contacts.html | 4 | 0 |
| electrical-works-singapore.html | 11 | 0 |
| renovation-works-singapore.html | 2 | 0 |

**Impact:** Missing width/height causes Cumulative Layout Shift (CLS) as images load and push content around.

---

## 5. FONT LOADING ISSUES 🟡

### 5A. Render-blocking `@import` in inline `<style>` (8 pages)

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:...');
```

This blocks CSS parsing until the font stylesheet is fetched. Should be converted to `<link rel="preload">` with `onload` swap pattern.

**Pages:** about.html, completed-projects.html, contacts.html, electrical-works-singapore.html, painting-services-singapore.html, plastering-services-singapore.html, plumbing-services-singapore.html, tile-laying-services-singapore.html

### 5B. Blocking `<link rel="stylesheet">` for fonts (5 pages)

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:..." rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:..." rel="stylesheet">
```

These are render-blocking. Should use the preload/onload pattern already used on index.html, about.html, and contacts.html.

**Pages:** commercial-renovation-singapore.html, residential-renovation-singapore.html, handyman-services-singapore.html, completed-projects.html, electrical-works-singapore.html

### 5C. Good patterns already in use (keep these)

index.html, about.html, contacts.html already use the non-blocking pattern:
```html
<link rel="preload" href="...fonts..." as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="...fonts..."></noscript>
```

---

## 6. UNUSED ASSET FILES 🟢

These files exist in `/assets/` but are **not referenced from any HTML page**:

| File | Size |
|---|---|
| assets/chatbot.js | 26,829 B |
| assets/sgsa-core.js | 14,136 B |
| assets/homepage.js | 5,088 B |
| assets/service-dropdown.js | 3,791 B |
| assets/contact-form.js | 2,582 B |
| assets/page-transitions.css | 1 B (empty) |

**Total unused:** ~52 KB

These files are likely superseded by `site.js` or inline scripts. They can be archived/removed to reduce deployment size.

---

## 7. LARGE HTML FILES & INLINE CODE 🟢

### 7A. HTML file sizes

| Page | File size | Lines |
|---|---|---|
| index.html | 169 KB | 3,809 |
| plumbing-services-singapore.html | 119 KB | 1,944 |
| painting-services-singapore.html | 110 KB | 2,182 |
| tile-laying-services-singapore.html | 110 KB | 2,167 |
| plastering-services-singapore.html | 110 KB | 2,173 |
| reinstatement-hacking-demolition-singapore.html | 108 KB | 2,115 |
| waterproofing-services-singapore.html | 107 KB | 2,109 |
| aircon-service-singapore.html | 104 KB | 2,028 |
| ceiling-wall-partitions-singapore.html | 104 KB | 2,025 |
| carpentry-works-singapore.html | 104 KB | 2,053 |

### 7B. Inline code sizes (largest pages)

| Page | Inline CSS | Inline JS | Total inline |
|---|---|---|---|
| index.html | 21 KB | 60 KB | **81 KB** |
| contacts.html | 4 KB | 49 KB | 53 KB |
| painting-services-singapore.html | 5 KB | 45 KB | 50 KB |
| waterproofing-services-singapore.html | 5 KB | 45 KB | 50 KB |
| tile-laying-services-singapore.html | 6 KB | 45 KB | 51 KB |
| reinstatement-hacking-demolition-singapore.html | 5 KB | 45 KB | 50 KB |

**Note:** Much of the inline JS is duplicated chat widget / scroll observer / mobile menu code across pages. Could be consolidated into site.min.js.

---

## 8. CACHING & COMPRESSION ✅ (Already configured)

`.htaccess` is well-configured with:
- **mod_expires:** 1 year for images, CSS, JS, fonts; 0 for HTML
- **Cache-Control headers:** `max-age=31536000, immutable` for static assets
- **GZIP compression:** Enabled for HTML, CSS, JS, SVG, fonts
- **Security headers:** X-Content-Type-Options, X-XSS-Protection, Referrer-Policy

No changes needed here.

---

## RECOMMENDED FIX PRIORITY

### Session 1 — Quick Wins (Biggest impact, lowest risk)
1. **Add `loading="lazy"` to below-fold images** — 46 images, ~30 min
2. **Add `width` and `height` attributes** to images missing them — ~107 images, ~1 hr
3. **Convert `@import` to `<link rel="preload">`** on 8 pages — ~30 min

### Session 2 — Image Optimization (Biggest size savings)
4. **Compress/resize oversized images** — Target < 200 KB per image
   - Top priority: the 16.8 MB, 4.6 MB, and 3.5 MB images on homepage
   - Estimated savings: 80+ MB across referenced images
5. **Create WebP versions** with `<picture>` fallbacks — ~83 images
6. **Delete unreferenced images** (64 MB of unused files)

### Session 3 — Advanced Optimizations
7. **Replace Tailwind CDN** with a pre-built CSS file containing only used classes
   - Current: ~300 KB JS runtime loaded on every page
   - After: ~15–30 KB static CSS file
8. **Consolidate duplicated inline JS** (chat widget, scroll observer, mobile menu) into site.min.js
9. **Convert blocking font `<link>` to preload pattern** on 5 pages
10. **Remove unused asset files** (52 KB cleanup)

### Estimated Impact

| Metric | Before (est.) | After (est.) |
|---|---|---|
| PageSpeed Mobile | 40–55 | 85–95 |
| PageSpeed Desktop | 55–70 | 90–98 |
| First Contentful Paint | 3–4s | 1–1.5s |
| Largest Contentful Paint | 4–8s | 1.5–2.5s |
| Total homepage weight | ~47 MB images | ~3–5 MB images |
| Cumulative Layout Shift | High | Near zero |

---

*Report generated by scanning all 18 HTML files, 155 image files, and all asset files in the project.*
