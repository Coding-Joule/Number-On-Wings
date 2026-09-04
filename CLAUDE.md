# NumberOnWings

Personal site at numberonwings.com. Rebuilt from scratch in August 2026.

This file was reset at the start of that rebuild. The previous version,
along with the entire previous site, is on the `archive/v0-original`
branch.

Decisions get recorded here as they are made. Newest decision wins.

---

## What this is

A personal mathematical playground and portfolio. Projects, experiments,
puzzles, programming, and whatever is currently being chased.

It is not an educational product, a tutoring service, or a SaaS dashboard.
The site should feel like wandering into someone's mathematical world,
not like browsing a feature list.

IrAcoNAl, a pi, is the mascot. `IMG_3098.png` is the original drawing,
with a white background baked in. `iraconal.png` is that drawing cropped
with the paper keyed out, ink kept black. The ink is black, so on a dark
surface it needs to be lightened rather than used as-is.

The favicon is the mascot on a paper-coloured tile. A tile is needed: a
transparent black drawing disappears against a dark browser tab.

## Hard constraints

- Dark interface.
- Strong typography, real negative space.
- Touch-first: iPad behavior is not an afterthought.
- No childish design, no generic edtech, no doodle borders, no
  notebook-paper UI, no grids of identical cards.
- No simplified explanations. The mathematics is allowed to be real.

## Rebuild rules

- Get one page right before building the next.
- Build it, look at it, iterate, then expand.
- Do not assume any earlier code or design must be preserved.

## Structure

- `/` &mdash; holding page while the rebuild happens.
- `/next/` &mdash; the real homepage, in progress. Promoting it is a move to
  the root with no link edits, because every asset path is root-relative.
- `404.html` &mdash; GitHub Pages serves this for any missing path.
- `nav.js` &mdash; the nav is defined once here and injected into
  `<header class="nav">`. Links get added as pages come into existence.
- `style.css` &mdash; tokens at the top; edit those, not each page.

## Palette

Orange `#ff7a1a` primary, yellow `#ffc233` for lifted and active states,
red `#e8412c` in thin accents only. Ground is a warm near-black. Every
text role clears 4.5:1 on its own surface.

## Checklist

- [x] Build a `/next/` folder on main
- [x] Fix all errors
- [x] Create a 404 page
- [x] Create `nav.js` and move the nav into it
- [x] Clean up `style.css` and the other files: drop useless comments,
      keep the ones that explain a decision
- [x] Strip anything that reads as machine-written
- [x] Polish
- [x] Replace the questions with "what the heck is NumberOnWings?!" ones
- [x] Delete unused branches, files and folders &mdash; no unused files or
      folders exist. `claude/numberwings-repo-reset-cl02g8` was identical
      to main and is deleted locally, but this environment's proxy refuses
      remote ref deletions, so it has to be removed from the GitHub UI.

## Open

- Nothing explains the name. A "why is it called NumberOnWings?" question
  belongs in the list, but the answer is not mine to invent.
- `claude/homepage-design-nfu3z2` holds unmerged work from another
  session: a different homepage, an `assets/` layout, `game.js`,
  `problem.js`, `runaway.html`, `tools.html`. Kept deliberately.
- The `archive/` branches are the way back to the original site. Keep.
