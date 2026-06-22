# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build locally
```

No test or lint scripts are configured.

## Architecture

Single-page scroll-based portfolio with no client-side routing. All sections live in `src/App.jsx` rendered sequentially; navigation uses anchor hash links (`#hero`, `#work`, `#about`).

**Stack:** React 18 + Vite, Tailwind CSS, GSAP (animations), Lenis (smooth scroll)

### Animation Pattern

GSAP is **dynamically imported** inside `useEffect` hooks (async/await) in each component — not imported at the top of files. ScrollTrigger is registered per-component. This is intentional for lazy loading.

```js
useEffect(() => {
  (async () => {
    const { default: gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    // ... animation setup
  })();
}, []);
```

### Smooth Scroll

`src/hooks/useLenis.js` initializes Lenis with `lerp: 0.08` and syncs it to GSAP's ticker. The instance is stored on `window.__lenis` for global access. Called once in `App.jsx`.

### Data Layer

All content data (services, benefits, tools, socials, image URLs) lives in `src/data/services.js`. When adding or modifying content, update this file rather than hardcoding values in components.

### Styling Conventions

- Fluid sizing via `clamp()` and `vw` units — no media queries
- Tailwind utilities for layout; inline styles for animation targets and dynamic values
- CSS variables defined in `src/index.css` for colors and fonts
- Custom font "Goga" is referenced in Tailwind config but falls back to "Syne" (Google Fonts)

### Custom Cursor

`CustomCursor.jsx` uses a MutationObserver to detect newly added interactive elements (links, buttons, inputs, `[data-cursor]`). To make any element trigger cursor hover state, add `data-cursor` attribute.

### Images

Currently using Unsplash placeholder URLs in `src/data/services.js`. Real portfolio images should replace these URLs there.
