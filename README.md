# Caio de Oliveira — personal site

> **Always in motion.** I connect brand and performance, across industries, channels and cultures.

A one-page, scroll-driven personal site that tells my story as a sequence of scenes: from João Pessoa (Brazil) to Verona (Italy), through my career, the way I lead, what I'm learning and what I'm working on right now. A classic, printable CV lives at `cv.html`.

- **Stack:** plain HTML, CSS and JavaScript. No build step, no framework.
- **Motion:** GSAP + ScrollTrigger (scroll scenes), Lenis (smooth scroll on desktop), three.js (dotted globe). All self-hosted in `assets/js/vendor/`.
- **Hosting:** GitHub → Cloudflare (Workers static assets). Live at https://caio-portfolio.caiodoliv.workers.dev

---

## Quick start

```bash
# clone
git clone https://github.com/caiodoliv-ai/caio-portfolio.git
cd caio-portfolio

# preview locally (any static server works)
python3 -m http.server 8080
# then open http://localhost:8080
```

You can also double-click `index.html`: the site works from the file system, too.

## Project structure

```
caio-portfolio/
├── index.html              # the interactive one-page site (all texts live here)
├── cv.html                 # classic CV, printable / "Save as PDF"
├── assets/
│   ├── css/
│   │   ├── main.css        # design tokens + all styles for index.html
│   │   └── cv.css          # extra styles for cv.html (+ print styles)
│   ├── js/
│   │   ├── main.js         # scroll scenes, globe, reveals, counters
│   │   ├── globe-data.js   # dotted world map (generated)
│   │   └── vendor/         # GSAP, ScrollTrigger, Lenis, three.js (pinned versions)
│   └── img/
│       └── favicon.svg     # monogram
├── docs/
│   ├── CONTENT.md          # where every text lives + open placeholders
│   ├── DESIGN.md           # brand platform, palette, type, components, motion rules
│   ├── ARCHITECTURE.md     # how the scroll scenes and the globe work
│   ├── DEPLOY.md           # GitHub + Cloudflare Pages + custom domain
│   └── ROADMAP.md          # next steps and ideas
├── tools/
│   └── generate-globe-data.mjs   # regenerates assets/js/globe-data.js
├── _headers                # Cloudflare Pages caching & security headers
├── robots.txt
└── CLAUDE.md               # working instructions for Claude Code
```

## Editing content

All copy is plain HTML in `index.html`, section by section (look for the `<!-- ===== 0X NAME ===== -->` comments). Open placeholders are marked with the `PLACEHOLDER` label and listed in [`docs/CONTENT.md`](docs/CONTENT.md).

Rule of thumb: **the site tells the facts, the tailored CV chooses the angle.** Dates, titles and numbers must match the PDF CV and LinkedIn exactly.

## Deploy

See [`docs/DEPLOY.md`](docs/DEPLOY.md). In short: every push to `main` redeploys automatically through Cloudflare.

## Credits

Built by Caio de Oliveira with Claude. Libraries: [GSAP](https://gsap.com) (standard GSAP licence), [Lenis](https://github.com/darkroomengineering/lenis) (MIT), [three.js](https://threejs.org) (MIT). Map data derived from [Natural Earth](https://www.naturalearthdata.com) via `world-atlas` (public domain).

© 2026 Caio de Oliveira. Texts, story and personal data are not licensed for reuse.
