# Architecture

## Files and load order

```
index.html
  ├─ assets/css/main.css
  └─ scripts (end of <body>, classic, in this order)
       1. assets/js/vendor/gsap.min.js           window.gsap
       2. assets/js/vendor/ScrollTrigger.min.js  window.ScrollTrigger
       3. assets/js/vendor/lenis.min.js          window.Lenis
       4. assets/js/vendor/three.min.js          window.THREE (r128)
       5. assets/js/globe-data.js                window.GLOBE_LAND
       6. assets/js/main.js
```

Classic scripts (not ES modules) keep the site working from `file://`.

## The `anim` switch

```js
const ANIM = gsap && ScrollTrigger && THREE loaded
          && !prefers-reduced-motion
          && innerHeight < screen.height * 2;   // guards against auto-height preview iframes
document.documentElement.classList.toggle('anim', ANIM);
```

- With `.anim`: hidden start states (`.anim .rv`, `.anim .o-step`), pinned scenes, globe.
- Without it: `html:not(.anim) …` rules in `main.css` turn every scene into a static, fully readable layout (dark Origins block, swipeable career cards, stacked principles, globe hidden).
- HTML defaults are the *final* values (e.g. `7+`, `7,400 km`); JS resets them to 0 only when it animates them.

## Scenes

| Scene | Trigger | Pin length | What is scrubbed |
|---|---|---|---|
| Origins | `#origins` | 260% (190% mobile) | Globe pose (x, y, scale, lat, lon), route draw 0→1, three text steps, km counter |
| Career | `#path` | track width − viewport (desktop only) | `#track` translateX. Mobile: native scroll-snap carousel |
| How I lead | `#lead` | 200% (220% mobile) | Rider position on the SVG path, track stroke, principle 1/2/3 at progress .40 / .76. Mobile: SVG is 300vw and pans to follow the rider |

Non-pinned triggers (created **after** all pins): nav highlight + progress bar, night mode (`body.night` while Origins is on screen), globe fade-out on Numbers, word-by-word heading reveals (`.split`), `.rv` reveals, counters, the dotted "journey" line in Right now.

## Globe

- `root` (screen position + scale) → `tilt` (rotation.x = latitude) → `spin` (rotation.y = −π/2 − longitude). This makes `(lat, lon)` face the camera.
- Land: ~2,700 points from `GLOBE_LAND`, rendered as `THREE.Points` with a round sprite.
- Route: `TubeGeometry` along a great-circle arc João Pessoa → Verona (lifted 30% at mid-point), revealed with `setDrawRange`; a glowing "comet" rides the arc.
- State object `S` (x, y, scale, lat, lon, idle drift, dark, route, op, labels) is tweened by ScrollTrigger and read every frame.
- City labels are HTML elements projected from 3D (`toScreen`), hidden when on the back of the globe and clamped to the viewport.

## Keeping positions correct

- Pins are created first, in page order.
- `ScrollTrigger.refresh()` runs on `load`, on `document.fonts.ready`, and whenever a `ResizeObserver` sees `<main>` height or the career track width change. Without this, late-loading fonts made the career pin overlap "How I lead".
- Width-only resizes > 40px trigger a refresh; height-only changes (mobile URL bar) don't.

## Motion modes

| Mode | When | What runs |
|---|---|---|
| `html.anim` | Width > 900px, libraries loaded, motion allowed | Pinned GSAP scenes, globe through Origins, Lenis smooth scroll on mouse devices |
| `html.m` | Width ≤ 900px, motion allowed, IntersectionObserver available | No pins. The static layout plus light effects: reveal on view with a small stagger, counters, the Origins route map drawing with the km counter, greeting rotator, the BMX rider running the whole track once, scope bars, closing line. A small auto-rotating globe sits in the hero and fades out on scroll (`html.m-globe`) |
| neither | Reduced motion, JavaScript off, libraries missing | Static layout under `html:not(.anim)`; everything readable |

Pinned scroll-scrubbed scenes proved fragile on real phones (momentum scrolling, address bar), so phones get the lighter `m` mode by design. Tablets and small laptops above 900px keep the desktop scenes; on touch screens those use `normalizeScroll` and snapping.

Open the site with `#debug` to show a badge with the active mode and the reason, plus touch/WebGL support and viewport size.

## Smooth scroll

Lenis runs only when the page is top-level (not inside an iframe) and the pointer is fine (mouse/trackpad). Touch devices keep native scrolling. `window.__lenis` is exposed for debugging and automated tests.

## Regenerating globe data

```bash
cd tools
npm init -y && npm i world-atlas@2 topojson-client@3 d3-geo@3
node generate-globe-data.mjs   # writes ../assets/js/globe-data.js
```
