# Tasks: T20 Wizard Spell Comptroller

**Input**: Design documents from `/specs/001-spell-comptroller/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Unit tests for calculation logic are mandatory per Constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create module directory structure: `module/`, `module/lang/`, `module/templates/`, `module/scripts/`
- [X] T002 Create `module/module.json` with basic manifest data
- [X] T003 Create `module/lang/pt-BR.json` and `module/lang/en.json` with initial keys
- [X] T004 Setup Jest configuration for logic testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and template infrastructure

- [X] T005 [P] Create `module/templates/spell-control.hbs` with the basic table structure
- [X] T006 [P] Implement `module/scripts/logic.js` with `calculateSpellData` (returning mock data initially)
- [X] T007 Create `tests/unit/logic.test.js` to verify `calculateSpellData` requirements (TDD)

---

## Phase 3: User Story 1 - Mago Spell Tracking (Priority: P1) 🎯 MVP

**Goal**: Consolidated view of known and prepared spells per circle

**Independent Test**: Character sheet shows the panel with correct initial counts (even if limit is not yet calculated).

### Tests for User Story 1

- [X] T008 [P] [US1] Add test case to `tests/unit/logic.test.js` for grouping spells by circle
- [X] T009 [P] [US1] Add test case to `tests/unit/logic.test.js` for counting known vs prepared spells

### Implementation for User Story 1

- [X] T010 [US1] Implement spell filtering and grouping in `module/scripts/logic.js`
- [X] T011 [US1] Implement `module/scripts/module.js` with `renderActorSheet` hook to inject template
- [X] T012 [US1] Add logic to `module.js` to identify "Arcanista/Mago" actor type

**Checkpoint**: User Story 1 should be fully functional with accurate counts.

---

## Phase 4: User Story 2 - Real-time Preparation Management (Priority: P2)

**Goal**: Instant UI updates when toggling preparation

**Independent Test**: Toggling a spell updates the panel counts instantly.

### Implementation for User Story 2

- [X] T013 [US2] Ensure `logic.js` correctly handles the `item.system.preparada` state
- [X] T014 [US2] Verify `renderActorSheet` is triggered by Foundry on item update (standard behavior)

**Checkpoint**: Panel is reactive to preparation state changes.

---

## Phase 5: User Story 3 - Limit Calculation (Priority: P3)

**Goal**: Automatic limit calculation (half known spells, rounded down)

**Independent Test**: Limit in panel reflects floor(total_known / 2).

### Tests for User Story 3

- [X] T015 [P] [US3] Add test case to `tests/unit/logic.test.js` for `floor(totalKnown / 2)` calculation
- [X] T016 [P] [US3] Add test case to `tests/unit/logic.test.js` for status "ok" vs "exceeded"

### Implementation for User Story 3

- [X] T017 [US3] Implement limit and status logic in `module/scripts/logic.js`
- [X] T018 [US3] Update `module/templates/spell-control.hbs` to display the global limit and status highlight

**Checkpoint**: Preparation limits are correctly enforced and displayed.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T019 [P] Verify 100% I18n coverage using `game.i18n.localize` in `spell-control.hbs`
- [X] T020 [P] Audit hooks to ensure no infinite rendering loops (no `actor.update` in render)
- [X] T021 [P] Documentation updates in `README.md`
- [X] T022 Code cleanup and refactoring to ensure logic/UI decoupling
- [X] T023 Run `quickstart.md` validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1.
- **User Stories (Phase 3+)**: Depend on Foundational (Phase 2).
- **Polish (Final Phase)**: Depends on all user stories.

### Implementation Strategy

- **MVP First**: Complete US1 and US2 for immediate tracking value.
- **Incremental**: Add US3 (Limits) as the final functional refinement.
