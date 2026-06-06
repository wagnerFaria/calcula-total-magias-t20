# Tasks: T20 Wizard Spell Comptroller

**Feature**: T20 Wizard Spell Comptroller
**MVP Scope**: Phase 3 (User Story 1)

## Dependencies
- US1 must be completed before US2 and US3.
- US2 and US3 can be worked on in parallel after US1.

## Phase 1: Setup
- [ ] T001 Initialize project structure (module.json, directories) in `module/module.json`
- [ ] T002 Setup Jest testing environment in `package.json`

## Phase 2: Foundational
- [ ] T003 Setup initial localization files in `module/lang/pt-BR.json` and `module/lang/en.json`

## Phase 3: User Story 1 - Mago Spell Tracking
**Goal**: Display consolidated view of known and prepared spells per circle.
**Independent Test**: Open a Mago character sheet and verify the "Spell Control" panel appears with correct initial counts.
- [ ] T004 [P] [US1] Write unit tests for Mago identification and spell counting logic in `tests/unit/logic.test.js`
- [ ] T005 [P] [US1] Implement `calculateSpellData` function in `module/scripts/logic.js` to return known/prepared totals grouped by circle
- [ ] T006 [US1] Create Handlebars template for spell control panel in `module/templates/spell-control.hbs`
- [ ] T007 [US1] Implement `renderActorSheet` hook in `module/scripts/module.js` to inject template into the UI

## Phase 4: User Story 2 - Real-time Preparation Management
**Goal**: Panel updates instantly when preparing/unpreparing a spell.
**Independent Test**: Toggle preparation on a spell and observe the counts update immediately.
- [ ] T008 [P] [US2] Add status logic (OK vs Exceeded limit) to `calculateSpellData` in `module/scripts/logic.js`
- [ ] T009 [P] [US2] Update unit tests to verify preparation toggle and status state in `tests/unit/logic.test.js`
- [ ] T010 [US2] Add dynamic styling for exceeded limits in `module/styles/module.css`
- [ ] T011 [US2] Update Handlebars template to display status indicator in `module/templates/spell-control.hbs`

## Phase 5: User Story 3 - Limit Calculation
**Goal**: Limit calculated automatically based on total known spells (half rounded down).
**Independent Test**: Add/remove spells from the character and verify the limit updates.
- [ ] T012 [P] [US3] Update unit tests for half-known-spells limit calculation in `tests/unit/logic.test.js`
- [ ] T013 [US3] Implement dynamic limit calculation in `calculateSpellData` in `module/scripts/logic.js`

## Final Phase: Polish & Cross-Cutting Concerns
- [ ] T014 Review and polish UI CSS to match T20 Foundry standards in `module/styles/module.css`
- [ ] T015 Verify all translation strings are populated in `module/lang/pt-BR.json`
