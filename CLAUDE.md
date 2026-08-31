# NumberOnWings — Project Context

## What NumberOnWings Is

NumberOnWings is a personal mathematical playground, portfolio, and collection of experiments.

It is NOT:
- a generic educational platform
- a tutoring service
- a school dashboard
- a SaaS product
- a corporate-looking math website

The site should feel like wandering into someone's mathematical world.

The original NumberOnWings personality matters:
- the “Wrong wings” joke
- IrAcoNAl, the pi-like mascot
- mathematical rabbit holes
- projects and experiments
- programming
- puzzles
- strange ideas
- humor

Core principle:

**Original NumberOnWings personality + better machinery.**

NOT:

**Generic math platform + NumberOnWings branding.**

---

## Design Philosophy

Prefer:
- dark / black interfaces
- strong typography
- negative space
- clean layouts
- intentional weirdness
- touch-friendly controls
- good iPad/mobile behavior

Avoid:
- generic edtech design
- generic SaaS dashboards
- childish design
- notebook-paper UI
- doodle borders everywhere
- excessive graph-paper backgrounds
- unnecessary animations
- giant collections of identical cards
- mascot placement merely for decoration

IrAcoNAl itself may remain hand-drawn.

The UI does not need to look hand-drawn.

Different areas of NumberOnWings may have different personalities.

**Consistency is useful. Uniformity is not the goal.**

---

## Current Site Direction

Current conceptual areas:

- HOME
- PUZZLES
- PLAY
- FINANCE

This architecture is not sacred. Change it if a better structure emerges.

Do not build twenty pages before establishing a good visual language.

Get one important page right first.

---

# HMM 🤨

HMM is NumberOnWings's adaptive mathematics problem system.

Its name is simply:

**HMM**

It does not need to stand for anything.

## Subjects

Initial subject structure may include:

- Prealgebra
- Algebra
- Geometry
- Number Theory
- Counting & Probability
- Intermediate Algebra
- Precalculus

More subjects may be added later.

Each subject should eventually contain many granular topics and subtopics.

## Problem Sources

HMM should be hybrid:

1. Generated problems
2. Curated problems

Generated problems should come from genuinely different problem families.

Do NOT create fake variety by repeatedly using the same structure with different integers.

The anti-repetition system should consider:
- problem family
- mathematical structure
- recently practiced concepts
- recent variants

not merely exact problem text.

## Attempts

A problem allows up to 3 attempts.

- first-attempt success receives strongest credit
- second-attempt success receives less
- third-attempt success receives less again
- after 3 failed attempts, reveal the solution

## Adaptive System

HMM has two conceptual rating layers.

### Visible rating

A relatively simple rating shown to users for:
- motivation
- progress
- milestones

### Secret 🤫 engine

The actual adaptive model can be much more detailed.

It may eventually estimate:
- ability by subtopic
- uncertainty
- performance by problem family
- first-attempt vs later-attempt performance
- recent vs long-term performance
- prerequisite weaknesses
- structural variants
- amount of available evidence
- unusual lucky/unlucky results

The visible rating does NOT need to expose the internal model.

HMM may occasionally give a substantially harder problem as a probe to test whether its estimate is wrong.

## Modes

Planned modes:

- HMM Chooses
- Focus
- Mixed

**HMM Chooses** should be the default adaptive experience.

---

# PLAY

PLAY is for interacting with mathematics rather than consuming lessons.

It should be approximately half:

**mathematical toys / laboratories**

and half:

**games**

Possible labs:
- Number Lab
- Graph Lab
- Probability Lab
- Simulations

Possible games:
- Coin Weighing
- logic games
- probability games
- deduction games
- search games
- mathematical mini-games

PLAY should feel like opening a drawer containing strange mathematical things.

It should NOT feel like coursework.

## Coin Weighing

The player chooses difficulty.

Possible modes include:

- simpler mode: counterfeit direction is known
- harder mode: counterfeit may be heavier or lighter

---

# Coins

NumberOnWings has a coin economy.

Coins can be earned and spent.

Game payouts should be designed with probability and expected value in mind.

Do not accidentally create unlimited positive-expected-value coin generators unless that behavior is deliberately intended.

---

# Achievements

Achievements should recognize interesting behavior.

They may:
- award coins
- subtract coins
- be secret
- be funny
- reward recovery
- reward unusual behavior

Examples of the intended style:

- SECOND TIME'S THE CHARM
- REFUSED TO DIE
- FINANCIAL GENIUS
- YOU BOUGHT WHAT?

Avoid making the achievement system primarily:

- solve 10 problems
- solve 50 problems
- solve 100 problems

Achievements should tell stories about how the site was used.

---

# Avatar Packs

Current possible themes:

- Number Theory
- Algebra
- Geometry
- Counting & Probability
- Calculus
- Free

The Free pack is intentionally “bad in a good way” and may contain ridiculous mathematical junk.

---

# Shop and Hidden Economy

NumberOnWings has a Shop.

A hidden economy/market system may influence prices.

IMPORTANT:

**Do not publicly expose the Stock Market yet.**

For now, avoid visible:
- stock trading
- market pages
- recent trades

The hidden economy may still affect other systems.

A public market can be considered later.

---

# Social Features

Do NOT currently add:

- comments
- DMs
- public submissions
- user-to-user messaging
- other public communication systems

---

# Homepage

The homepage should answer:

**“What the hell is NumberOnWings?”**

It should NOT primarily answer:

**“What features does this educational product offer?”**

Potential homepage material:
- mathematical projects
- current experiments
- current mathematical obsession
- weird discoveries
- programming projects
- IrAcoNAl
- jokes
- rabbit holes
- things currently being built

The homepage should feel alive and personal rather than like a feature directory.

---

# Development Rules

Before making major changes:

1. Read this file.
2. Inspect the existing repository.
3. Understand the current implementation.
4. Do not assume existing code or design must be preserved.

When an important long-term project decision is made, update this file.

Newer decisions override contradictory older decisions.

Do NOT fill this file with:
- temporary bugs
- debugging logs
- short-lived implementation details
- conversation transcripts
- personal information

The repository remains the source of truth for implementation.

Prefer:
1. build one important piece
2. inspect it visually
3. iterate
4. expand
