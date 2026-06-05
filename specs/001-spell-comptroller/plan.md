# Implementation Plan: T20 Wizard Spell Comptroller

**Branch**: `001-spell-comptroller` | **Date**: 2026-06-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-spell-comptroller/spec.md`

## Summary

Implement a Foundry VTT module that tracks and displays spell counts (known, prepared, limit) for Tormenta20 Magos. The approach involves hooking into `renderActorSheet`, calculating totals via a decoupled helper, and injecting a Handlebars template into the UI.

## Technical Context

**Language/Version**: JavaScript (ES6 Modules)

**Primary Dependencies**: Foundry VTT API (v11/v12)

**Storage**: Foundry VTT Actor/Item Data (Embedded)

**Testing**: Jest (for calculation logic)

**Target Platform**: Foundry VTT

**Project Type**: Foundry VTT Module (Add-on)

**Performance Goals**: UI update < 100ms, zero impact on sheet scroll/input latency.

**Constraints**: No database writes in render hooks; prepared limit is half of total known spells (rounded down).

**Scale/Scope**: Single actor sheet extension; supports 1st-5th circle spells.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Modular Logic**: Logic will be in `scripts/logic.js`, separate from `scripts/module.js` (UI).
- [x] **II. Test-Driven Accuracy**: All calculation logic in `logic.js` will have Jest tests.
- [x] **III. Reactive UX & Performance**: Hook `renderActorSheet` will use local data only.
- [x] **IV. Visual Feedback**: Handlebars template will use standard T20/Foundry CSS.
- [x] **V. I18n-First**: All strings in `lang/pt-BR.json` and `lang/en.json`.

## Project Structure

### Documentation (this feature)

```text
specs/001-spell-comptroller/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
module/
├── module.json
├── lang/
│   ├── pt-BR.json
│   └── en.json
├── templates/
│   └── spell-control.hbs
└── scripts/
    ├── module.js        # Main hook entry point
    └── logic.js         # Calculation logic (ESM)

tests/
└── unit/
    └── logic.test.js
```

**Structure Decision**: Single project module structure tailored for Foundry VTT.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | | |
