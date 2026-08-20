# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Foundry VTT add-on module for the **Tormenta20 (T20)** system that automates spell-preparation bookkeeping for Arcanista/Mago characters. In T20, a Mago's max preparable spells equals **half the total known spells, rounded down**, and the base system doesn't surface that count anywhere — this module injects a reactive panel into the character sheet's Spells tab showing known/prepared counts per circle (1st–5th), the computed limit, and an over-limit warning.

## Commands

```bash
npm install       # install dependencies (jest, archiver)
npm test          # run Jest unit tests (module/scripts/logic.js via tests/unit/logic.test.js)
npm run zip       # package module/ into calcula-total-magias-t20-<version>.zip for distribution
```

Run a single test file: `node --experimental-vm-modules node_modules/jest/bin/jest.js tests/unit/logic.test.js`
Run tests matching a name: `node --experimental-vm-modules node_modules/jest/bin/jest.js -t "should calculate limit"`

Note the `--experimental-vm-modules` flag is required because this is a native ESM project (`"type": "module"` in package.json) — don't drop it when invoking Jest directly.

CI (`.github/workflows/release.yml`) runs `npm test` and `npm run zip` on every `v*` tag push, then attaches the zip and `module/module.json` to a GitHub release. Bump `version` in both `package.json` and `module/module.json` together before tagging.

## Architecture

The codebase is deliberately split into a pure calculation layer and a DOM/Foundry-API layer, so the math can be unit tested without mocking Foundry globals:

- **[module/scripts/logic.js](module/scripts/logic.js)** — `calculateSpellData(actor)`: pure function, no Foundry globals. Takes a plain actor-like object (`{ name, items, flags }`) and returns known/prepared counts per circle, totals, the computed limit, over-limit status, and a breakdown by spell type (arcane/divine/universal). This is the only file exercised by [tests/unit/logic.test.js](tests/unit/logic.test.js) — treat it as the domain layer and keep it Foundry-free so tests keep working without a Foundry runtime.
- **[module/scripts/module.js](module/scripts/module.js)** — Foundry integration layer. Registers on `Hooks.on('renderActorSheet', ...)`, calls `calculateSpellData(actor)`, renders [module/templates/spell-control.hbs](module/templates/spell-control.hbs), then injects the result into the sheet's Spells tab using a cascade of DOM-matching strategies (by `data-tab`, by "Magias" header text, by locating an existing spell `.item` in the DOM, finally falling back to the active tab). This cascade exists because the T20 sheet's DOM structure isn't guaranteed stable across system versions — see the "Data Paths" note below before changing detection logic.

### Mago detection and data paths (system-version sensitive)

Because the Tormenta20 system's data model can shift between versions, `calculateSpellData` probes multiple possible field names rather than assuming one:

- **Mago detection**: `isMago` is true if the actor has an item `type === "classe"` whose name includes "arcanista" AND an item `type === "poder"`/`"ability"` whose name includes "mago" or "caminho do arcanista" — OR the actor has `flags.tormenta20.mago` set directly.
- **Spell filter**: items where `type === "magia"` or `type === "spell"`.
- **Circle**: `item.system.circulo` (pt) or `item.system.level` (en).
- **Prepared flag**: `item.system.preparada`, `item.system.prepared`, or `item.flags.tormenta20.preparada`.
- **Spell type**: `item.system.tipo` — `"arc"`/`"div"`/`"uni"` map to arcane/divine/universal counters.

If you're adding new detection logic, inspect a real actor's data first (`canvas.tokens.controlled[0].actor` in the Foundry console) rather than guessing field names — both pt-BR and en field names are supported side by side throughout, and [specs/001-spell-comptroller/contracts/actor-structure.md](specs/001-spell-comptroller/contracts/actor-structure.md) documents the currently-known contract.

### Render-loop safety constraint

All calculation and DOM injection happens synchronously inside the `renderActorSheet` hook handler. **Never call `actor.update()` (or anything that mutates the actor) from within this hook** — Foundry re-renders the sheet on every actor data change, so a write inside the render handler causes an infinite render loop. The module is read-only by design: it only reads `actor.items`/`actor.flags` and injects HTML.

### I18n

All user-facing strings go through `game.i18n.localize`, backed by [module/lang/pt-BR.json](module/lang/pt-BR.json) and [module/lang/en.json](module/lang/en.json) (keys prefixed `T20WIZARD.*`). Both files must be kept in sync — a missing key in one language breaks that locale's UI silently.

### Specs

[specs/001-spell-comptroller/](specs/001-spell-comptroller/) contains the original spec-driven-development artifacts (spec, plan, data model, contracts, tasks) for this feature. `contracts/actor-structure.md` is the authoritative reference for the actor/item data paths this module depends on.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
