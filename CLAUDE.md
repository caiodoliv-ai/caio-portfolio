# CLAUDE.md — working on this repo

This is Caio de Oliveira's personal site: a static, scroll-driven one-page site (`index.html`) plus a printable CV (`cv.html`). Read this file before making changes.

## Golden rules

1. **No build step.** Plain HTML/CSS/JS. Do not introduce frameworks, bundlers or npm dependencies for the site itself. `tools/` may use Node for one-off scripts only.
2. **Classic scripts, not ES modules.** The site must keep working when `index.html` is opened from the file system (`file://`), where ES modules are blocked. Scripts load in order at the end of `<body>`: vendor libs → `globe-data.js` → `main.js`.
3. **Self-hosted libraries only.** Never switch vendor files back to CDN links: an earlier version broke when the CDN couldn't load. Pinned versions: GSAP 3.12.5, ScrollTrigger 3.12.5, Lenis 1.1.13, three.js r128 (UMD build, `window.THREE`).
4. **Progressive enhancement is mandatory.** `main.js` adds the `anim` class to `<html>` only when the libraries loaded, motion is allowed and the viewport is sane. Every hidden or animated starting state in CSS must be scoped under `.anim`, and every scene needs a readable static layout under `html:not(.anim)`. Test with JavaScript disabled.
5. **Facts must match the CV.** Dates, titles, numbers and languages must be identical across `index.html`, `cv.html`, the PDF CV and LinkedIn. Never invent results or metrics: use a `PLACEHOLDER` label instead and list it in `docs/CONTENT.md`.
6. **Positioning guardrails** (see `docs/DESIGN.md`):
   - Language is **industry-neutral**. No aviation metaphors (flights, boarding passes, gates, airport codes). Air Dolomiti is one experience in the path, not the frame.
   - **No public job-hunting signals.** No "open to work", "looking for a new role", target cities or "your company / boarding". The closing section is "Right now".
   - No phone number or home address anywhere.
7. **Tone:** warm, editorial, professional. English (UK spelling is fine, keep it consistent).

## Scroll scenes: how not to break them

- **Create pinned ScrollTriggers first, in page order** (Origins → Career → How I lead), then every other trigger. Triggers created before a pin above them get wrong positions.
- For triggers on pinned sections, use the pin spacer (`box('#id')` helper in `main.js`) as the trigger element.
- Anything that changes layout after load (fonts, images) must be followed by `ScrollTrigger.refresh()`. A `ResizeObserver` on `<main>` and on the career track already does this; keep it.
- Use `invalidateOnRefresh: true` and function-based values for anything that depends on viewport size.
- Mobile (≤ 900px) has its own choreography: native horizontal swipe for the career cards, camera-follow on the BMX track, shorter pins.

## How to test

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

Check at least: 1440×900, 1280×720, 1024×768, 820×1180, 390×844, 360×640, plus JavaScript disabled and `prefers-reduced-motion: reduce`. Scroll through every scene and confirm that no two pinned sections overlap and that the career track ends before "How I lead" starts. If Playwright is available, take screenshots at several scroll positions rather than trusting one viewport.

## Where things are

| Need to change… | Look in |
|---|---|
| Any text | `index.html` (sections are commented) · `cv.html` |
| Colours, fonts, spacing | `:root` tokens at the top of `assets/css/main.css` |
| Scene timing, pins, globe pose | `assets/js/main.js` (sections 3–5) |
| Globe land dots | `tools/generate-globe-data.mjs` → regenerates `assets/js/globe-data.js` |
| Open placeholders | `docs/CONTENT.md` |
| Deployment | `docs/DEPLOY.md` |

## Commit style

Short imperative subject in English (`Add Fujitsu details to career card`), one logical change per commit.
