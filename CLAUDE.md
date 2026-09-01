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

IrAcoNAl, a pi, is the mascot. `assets/img/iraconal-original.png` is
the original drawing,
with a white background baked in. `assets/img/iraconal.png` is that
drawing cropped
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

### The homepage is a greeting and a game

The front door says `Hello.` and then you are already playing. Twenty-one
stones, take one to three, whoever takes the last one wins, IrAcoNAl
moves second. No introduction: nobody arrives wanting to read about the
person whose site it is.

IrAcoNAl plays perfectly, and perfect play is one line -- always leave a
multiple of four. Twenty-one is not a multiple of four, so the game is
*winnable from the start*; the visitor simply has to find the invariant.
Random play loses about 998 times in 1000, so they will lose, and losing
is what sends them looking. Nothing is explained until they ask.

This also gives the mascot a real job. IrAcoNAl is the opponent, not
decoration.

The daily problem stays, below the game, for anyone who would rather
think quietly than play.

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

Tokens live at the top of `assets/css/site.css`; changing the look means
changing those values, not each page.

- **There is no accent hue.** The site is off-white ink (`#f0efec`) on
  warm near-black (`#0a0a0c`) and nothing else. Emphasis is carried by
  brightness and weight -- a right answer is bright, a wrong one is
  dim -- never by colour. The bright ink is the same value as the type
  and the same value as the mascot's paper, so the whole site is one
  material. An earlier version used an amber accent; it was dropped.
- The circle is the site's only graphic mark: the greeting's full stop,
  the game's stones, the roots marked on the grapher. Same shape, same
  ink, every time.
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
- `[hidden]` is forced to `display: none` globally. Any class that sets
  `display` outranks the browser's own `[hidden]` rule, so without it a
  hidden button is still painted.

### Layout on disk

    index.html  tools.html  runaway.html   pages, served from the root
    favicon.png  apple-touch-icon.png      must stay at the root
    assets/css/site.css                    every token and rule
    assets/js/                             game, problem, tools, runaway
    assets/img/                            the mascot and the original scan
    dev/build-preview.py                   not part of the site

Each page carries only the scripts it needs; there is no build step and
no framework. `game.js` and `problem.js` share the homepage, so each is
wrapped in its own function -- two top-level scripts share one scope and
their names would collide.

The grapher parses expressions into a tree of small functions rather
than calling `eval`, so the worst a visitor can type is a syntax
error. Its y-window is built from the curve's turning points, because
scaling to the extremes lets one steep tail flatten everything worth
looking at.

## Previewing a change

GitHub Pages serves the live domain, so there is no staging: the site
cannot be looked at without publishing it. `scripts/build-preview.py`
solves that. It reads the real pages, stylesheet, scripts and mascot
off disk and folds them into one self-contained HTML file, with the
three pages as routes and the drawing embedded once. That file can be
opened anywhere, including as a Claude Artifact, without touching the
live site.

    python3 scripts/build-preview.py preview.html

It is a preview tool, not a build step. The site itself is still plain
files with no build and no framework, and the preview is generated
*from* those files so it cannot drift from them.

## Still open

Puzzles, play, finance and HMM are unbuilt and unlinked. The homepage
problem set is the seed for whatever the puzzles area becomes.
