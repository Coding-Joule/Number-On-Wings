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

## Decided

### The homepage is a greeting and a problem

The front door says `Hello.` and then hands the visitor something to
solve. That is the whole hook.

This is deliberately not the AoPS move. "Train with the World's Top
Minds" works for them because they have IMO alumni to point at; the
promise is that someone else's status can rub off. Borrowing that
framing here would mean inventing authority. A greeting plus a real
problem is a claim that cannot be faked and cannot be copied, because
the evidence is the work itself.

Six problems rotate, one per day, chosen by the reader's local date.
They are six genuinely different families -- Legendre's formula,
modular cycles, divisor counting, a parity invariant, a telescoping
series, an area ratio -- not one template with the integers swapped.
Fake variety is worse than a single problem.

Solutions are real. Working, then the general result underneath it.
No simplified explanations.

Solved problems are remembered in `localStorage`. It is a memory, not
a score: nothing is ranked, nothing is compared to anyone else, and
attempts are not counted.

### Navigation only points at things that exist

No "coming soon", no dimmed placeholders. A section appears on the
homepage when it is built and not before. Carried forward from v0:
the prime factoriser, the fractal tree, the grapher, and the runaway
button. The squaring/cubing calculator was dropped -- it was a
calculator, not an idea.

### Visual language

Tokens live at the top of `style.css`; changing the look means
changing those values, not each page.

- Warm near-black (`#0a0a0c`), off-white text, one amber accent.
- Mathematics is set in a serif, and nothing else on the site is.
  Variables are italic, operators and function names upright.
- The greeting's full stop is a drawn circle, not a typed period: at
  display size a period is a square block in many fonts.
- **IrAcoNAl is drawn in black ink and stays black ink.** It is never
  inverted, tinted, lightened or faded to suit a background. Where it
  sits on a dark surface it is given paper to sit on -- a `--paper`
  tile (`#f0efec`, sampled from the favicon) with the favicon's
  rounded corner -- because a black drawing on a dark surface
  disappears. The paper changes size; the ink never changes at all.
  An earlier version of this page inverted the drawing to cream, which
  was wrong: it made the mascot into something it is not.
- Lists of destinations are full-width rows, not a grid of identical
  cards.
- 48px minimum tap targets; 16px inputs so iOS Safari does not zoom.

### Pages

`index.html` (home), `tools.html`, `runaway.html`. Each page carries
its own script; there is no build step and no framework.

The grapher parses expressions into a tree of small functions rather
than calling `eval`, so the worst a visitor can type is a syntax
error. Its y-window is built from the curve's turning points, because
scaling to the extremes lets one steep tail flatten everything worth
looking at.

## Still open

Puzzles, play, finance and HMM are unbuilt and unlinked. The homepage
problem set is the seed for whatever the puzzles area becomes.
