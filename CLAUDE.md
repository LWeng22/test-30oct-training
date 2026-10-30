# CLAUDE.md

## Tech Stack
- Plain HTML, CSS, and JavaScript only.
- No frameworks and no build step: files open directly in a browser.

## Project Structure
- `README.md` – basic repository readme
- `CLAUDE.md` – this file
- `index.html` – portal home page
- `tools/adjacency.html` – the adjacency scorer tool
- `css/style.css` – shared styles and light/dark theme colours
- `js/theme.js` – theme toggle
- `js/portal.js` – opens and closes tool panels using the page address (`#tool-1`)
- `js/adjacency.js` – adjacency scorer logic

Add new pages (`.html`), styles (`.css`) and scripts (`.js`) in these folders, and update this section as files are added.

## Feature Plan
Phase 1 is the portal plus exactly one tool.
- [x] Portal in `index.html` with navigation and a placeholder card ("Tool 1 – coming soon") that opens and closes.
- [x] First tool: adjacency scorer (`tools/adjacency.html`).
- [x] Choose the visual design: "Workshop" (see Design Direction below).

## Key Requirements
1. Every page must be responsive and work on desktop, tablet and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Design Direction
Look: "Workshop" – warm, industrial signage. Everything new must follow it. Use the CSS variables in `css/style.css` (`--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--accent`, `--accent-text`); never hard-code colours.

Palette (the default is light; dark applies with `data-theme="dark"`):

| Role | Light | Dark |
|---|---|---|
| Page background (`--bg`) | `#FAF6EF` | `#1D1B19` |
| Cards and inputs (`--surface`) | `#FFFFFF` | `#292623` |
| Text and borders (`--text`, `--border`) | `#2B2A28` | `#F3EEE6` |
| Secondary text (`--text-muted`) | `#5C5750` | `#C2B9AB` |
| Accent (`--accent`) | `#C2410C` | `#FF8A4C` |
| Text on accent (`--accent-text`) | `#FFFFFF` | `#1D1B19` |

Typography (Google Fonts, loaded with one `<link>` in each page's `<head>`):
- Headings, site title, table headers: Barlow Condensed, bold, UPPERCASE.
- Everything else: Barlow, 17px base, line height 1.55.

Spacing and shape:
- Spacing in steps of 0.5rem (8px): 0.5, 1, 1.5, 2, 2.5rem. Page content is at most 65rem wide, side padding 1rem on phones and 3rem from 40rem up.
- Square corners (no rounding), 2px solid borders on cards, buttons and inputs.
- Header: 6px accent bar on top, 2px line underneath.
- Cards get a hard orange shadow (`6px 6px 0`) on hover, not a blur.
- Buttons and inputs are at least 2.75rem (44px) tall so they are easy to tap.
- Keep text/background pairs at 4.5:1 contrast or better in both themes.

## Rules for Claude
- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
