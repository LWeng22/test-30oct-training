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
- [ ] Choose the visual design (styling is simple and neutral until then).

## Key Requirements
1. Every page must be responsive and work on desktop, tablet and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Rules for Claude
- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
