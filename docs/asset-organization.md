# Asset Organization - Single Source of Truth

## Overview

This document defines the single source of truth for all assets in the dash-board-mfe project, ensuring proper handling for both standalone deployment (GitHub Pages) and Module Federation consumption (shell app).

## Directory Structure

```
dash-board-mfe/
├── public/                              # Static assets for HTML/CSS references only
│   ├── bavaria-regierungsbezirke-dissolved.topojson  # Map data (fetched dynamically)
│   ├── favicon.svg                      # Browser favicon (referenced by index.html)
│   ├── icons.svg                        # Icon sprite sheet (CSS reference)
│   └── bayern.svg                       # Bayern shape/logo (if used)
│
└── src/
    └── assets/                          # All images imported in components
        ├── hero.png                     # Hero image (import with ?url)
        └── regions/                     # Region SVG files (import with ?url)
            ├── oberbayern.svg
            ├── niederbayern.svg
            ├── oberpfalz.svg
            ├── oberfranken.svg
            ├── mittelfranken.svg
            ├── unterfranken.svg
            └── schwaben.svg
```

## Rules

### Images Imported in Components (src/assets/)

**Use `?url` parameter for ALL images:**

```tsx
// PNG/JPG
import heroImage from '../assets/hero.png?url';
<img src={heroImage} alt="Hero" />

// SVG
import oberbayernSvg from '../../assets/regions/oberbayern.svg?url';
<img src={oberbayernSvg} alt="Region" />
```

- Vite emits the file to `dist/assets/` with a content hash
- Import resolves to the correct relative path
- ✅ Works in standalone deployment (GitHub Pages)
- ✅ Works in Module Federation (shell app)

### Static Assets (public/)

**Use for files referenced by HTML or CSS (NOT imported in components):**

- Files referenced by `index.html` (e.g., `<link rel="icon" href="/favicon.svg">`)
- Data files loaded via fetch API (e.g., `.topojson`)
- Icon sprite sheets referenced in CSS (`url(/icons.svg#icon-name)`)

**Do NOT use for:**
- Images imported in React components → use `src/assets/` with `?url` instead

## Single Source of Truth

| Asset Type | Source Location | Access Method |
|------------|----------------|---------------|
| Hero Image | `src/assets/hero.png` | Import with `?url` |
| Region SVG Icons | `src/assets/regions/*.svg` | Import with `?url` |
| Favicon | `public/favicon.svg` | HTML `<link>` tag |
| Map TopoJSON | `public/*.topojson` | Fetch API |
| Icon Sprites | `public/icons.svg` | CSS `url()` |

**No duplication** between `public/` and `src/assets/` for component images.

## Build Output

When building for production:

1. **Static files from `public/`** → copied as-is to `dist/`
   - `dist/bavaria-regierungsbezirke-dissolved.topojson`
   - `dist/favicon.svg`
   - `dist/icons.svg`
   - `dist/bayern.svg`

2. **Imported images with `?url`** → emitted with hash to `dist/assets/`
   - `dist/assets/hero-BqxwW46-.png`
   - `dist/assets/oberbayern-X7k2Lp9-.svg`
   - `dist/assets/niederbayern-Y3m9Qq1-.svg`
   - ... (all region SVGs)

## Module Federation Compatibility

✅ **Works in Shell App:**
- All imported images (hero + region SVGs) use `?url` parameter
- Vite resolves paths correctly relative to MFE deployment location
- No dependency on `import.meta.env.BASE_URL` for component images

✅ **Works on GitHub Pages:**
- All assets build correctly with `/dash-board-mfe/` base path
- Static `public/` files serve from dist root
- Imported assets reference hashed versions in `dist/assets/`

## Verification Commands

```bash
# Verify images are only in src/assets (not duplicated in public/)
find src/assets -type f \( -name "*.png" -o -name "*.svg" -o -name "*.jpg" \)

# Check public only has static files (favicon, icons, topojson)
ls -la public/

# Build and verify hashed assets
yarn build
ls -lh dist/assets/*.{png,svg}
```

## Summary

| Asset Type | Location | Import Method | Module Fed | GitHub Pages |
|------------|----------|---------------|------------|--------------|
| PNG/JPG Images | `src/assets/` | `import x from 'file?url'` | ✅ | ✅ |
| SVG Icons | `src/assets/` | `import x from 'file?url'` | ✅ | ✅ |
| Favicon | `public/` | `<link>` in HTML | ✅ | ✅ |
| Map Data | `public/` | fetch() API | ✅ | ✅ |
| Icon Sprites | `public/` | CSS `url()` | ✅ | ✅ |

