# Module Federation Image Handling

## Problem

Images broke when this MFE was consumed via Module Federation because the shell app couldn't resolve relative file paths to assets in the remote module.

## Solution: Use `?url` Import for All Images

All images (PNG, JPG, SVG) are imported with the `?url` parameter, which tells Vite to emit the asset with a hashed filename and return the correct path.

### PNG/JPG Images

```tsx
import heroImage from '../assets/hero.png?url';
<img src={heroImage} alt="Hero" />
```

### SVG Images

```tsx
import oberbayernSvg from '../../assets/regions/oberbayern.svg?url';

const REGION_SVG_MAP: Record<string, string> = {
  oberbayern: oberbayernSvg,
  // ... other regions
}

<img src={REGION_SVG_MAP[regionId]} alt="Region" />
```

## How It Works

1. **Import with `?url`**: Vite processes the import and emits the file to `dist/assets/` with a content hash
2. **Path Resolution**: The import resolves to the correct relative path from wherever the bundle is loaded
3. **Module Federation**: The shell app receives the correct path relative to where the MFE is deployed

## Single Source of Truth

**All images live in `src/assets/`:**

```
src/
├── assets/
│   ├── hero.png              # Hero image (use ?url)
│   └── regions/              # Region SVG files (use ?url)
│       ├── oberbayern.svg
│       ├── niederbayern.svg
│       ├── oberpfalz.svg
│       ├── oberfranken.svg
│       ├── mittelfranken.svg
│       ├── unterfranken.svg
│       └── schwaben.svg
```

**Do NOT duplicate images in `public/`** — Vite handles asset emission automatically with `?url`.

## Build Output

```
dist/
├── assets/
│   ├── hero-BqxwW46-.png              # Hero image with hash
│   ├── oberbayern-X7k2Lp9-.svg        # Region SVGs with hash
│   ├── niederbayern-Y3m9Qq1-.svg
│   └── ... (other hashed assets)
```

## Compatibility

┌──────────────────┬──────────────────────────────────┬─────────────────────────┐
│ Scenario         │ Hero Image (PNG)                 │ Region Icons (SVG)      │
├──────────────────┼──────────────────────────────────┼─────────────────────────┤
│ GitHub Pages     │ ✅ Resolves to                   │ ✅ Resolves to          │
│ (standalone)     │ /dash-board-mfe/assets/hero-*.png│ /dash-board-mfe/assets/ │
│                  │                                  │ oberbayern-*.svg        │
├──────────────────┼──────────────────────────────────┼─────────────────────────┤
│ Module Federation│ ✅ Shell app gets correct path   │ ✅ Shell app gets       │
│ (shell app)      │ to MFE's deployed assets         │ correct path to MFE's   │
│                  │                                  │ deployed assets         │
└──────────────────┴──────────────────────────────────┴─────────────────────────┘