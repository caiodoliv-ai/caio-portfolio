# Design system

## Brand platform

| | |
|---|---|
| **Claim** | *Always in motion.* |
| **Positioning** | I lead integrated marketing that connects brand and performance, aligning teams, partners and data around one goal. |
| **Proof** | Two industries (sport retail, aviation), one method · €2M+ budgets · 6+ cross-functional teams led · 100K+ audience · 5+ partners · C-level reporting · 4 languages |
| **Unspoken goal** | Show readiness to lead a team through scope and proof, never by asking for it. |
| **Story** | Born where the sun rises first (João Pessoa) → made Italy home (2002) → the path so far → how I lead (BMX) → right now |
| **Personality** | Warm, precise, curious, energetic. Human before corporate. |

**Guardrails**
- Industry-neutral language: no aviation metaphors, no airport codes, no "flights".
- No job-hunting signals in public: no "open to work", target cities or "your company".
- Movement is a personal trait (curiosity, adaptability, energy), not a travel theme.

## Colour tokens (`:root` in `assets/css/main.css`)

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F4F1EA` | Page background (warm ivory) |
| `--paper-2` | `#EBE6DB` | Globe base, placeholders |
| `--card` | `#FBF9F4` | Cards |
| `--line` | `#DDD6C8` | Rules and borders |
| `--ink` | `#1F1E1B` | Text, dark cards |
| `--ink-2` | `#4A463F` | Body text |
| `--muted` | `#8A8378` | Labels, meta |
| `--clay` | `#C8643B` | The only accent: links, italics, markers, buttons |
| `--clay-2` | `#E08A62` | Accent on dark backgrounds |
| `--night` | `#1B1A17` | The single dark scene (Origins) |

Use the accent sparingly: one italic word per heading, one primary button per view.

## Typography

| Role | Font | Notes |
|---|---|---|
| Headings, editorial text | **Newsreader** (serif) | Regular weight; italics in `--clay` for the key word |
| Body, UI | **Inter** | 15–17px body |
| Labels, data, meta | **JetBrains Mono** | Uppercase, 10–12px, letter-spacing .1–.16em |

All three load from Google Fonts. If they fail, the stack falls back to Georgia / system-ui / ui-monospace.

## Components

- **Eyebrow** — mono label above headings (`.eyebrow`), numbered `0X · Section`.
- **Spec card** (`.spec`) — career card: number + dates, role, company, three key values (`.kv`), bullets. The current role uses the dark variant.
- **Stat** (`.stat`) — big serif number with accent `+`, mono label.
- **Principle** (`.pr`) — number, "On the track" line, "At work" line.
- **Signal** (`.sig`) — category, title, one line, optional link.
- **Placeholder** (`.ph`) — dashed accent box. Must not reach production.
- **Buttons** — `.btn.clay` (primary), `.btn.line` (secondary), pill-shaped.

## Motion principles

1. **Motion tells the story.** Every animation shows progress in the narrative (the route draws, the rider runs, the principles change). No decoration-only motion.
2. **One protagonist per scene.** The globe in Origins, the rider in How I lead.
3. **Scroll is the timeline.** Scenes are scrubbed by scroll, not played automatically.
4. **Short.** Full scroll should take 60–90 seconds.
5. **Respect the reader.** `prefers-reduced-motion` and failed script loads get a complete static layout.

## Imagery

- Self-drawn SVG only (monogram, rider, track, radar). No stock icons.
- Photos to add: portrait (warm natural light, 4:5) and optionally a BMX race photo.
- No company logos.
