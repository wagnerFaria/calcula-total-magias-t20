# Feature Specification: T20 Wizard Spell Comptroller

**Feature Branch**: `001-spell-comptroller`

**Created**: 2026-06-05

**Status**: Draft

**Input**: User description: "the specifications of the application is on GEMINI.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mago Spell Tracking (Priority: P1)

As a player with a Mago character, I want to see a consolidated view of my known and prepared spells per circle, so I can manage my daily preparation correctly according to Tormenta20 rules.

**Why this priority**: Core value of the module. Without this, the module serves no purpose.

**Independent Test**: Can be verified by opening a Mago character sheet and checking if the new spell control panel appears with correct initial counts.

**Acceptance Scenarios**:

1. **Given** a character with Arcanista class and Mago path, **When** I open the character sheet, **Then** I should see a "Spell Control" panel in the spells tab.
2. **Given** the spell control panel is visible, **When** I look at the counts, **Then** they must accurately reflect the spells currently on my character sheet grouped by circle.

---

### User Story 2 - Real-time Preparation Management (Priority: P2)

As a Mago, I want the spell control panel to update instantly when I prepare or unprepare a spell, so I don't have to reload the sheet to see my current status.

**Why this priority**: Essential for UX consistency and to avoid confusion during preparation.

**Independent Test**: Toggle preparation on a spell and observe the "Prepared" count and "Status" in the panel update without closing/opening the sheet.

**Acceptance Scenarios**:

1. **Given** the spell control panel is visible, **When** I toggle the "prepared" state of a 1st circle spell, **Then** the "1st Circle Prepared" count and "Total Prepared" count must update immediately.
2. **Given** I reach my maximum prepared limit for a circle, **When** I prepare one more spell in that circle, **Then** the status for that circle must change to "Limite Excedido".

---

### User Story 3 - Limit Calculation based on Intelligence (Priority: P3)

As a player, I want the maximum prepared limit to be calculated automatically based on my Intelligence modifier, so I don't have to calculate it manually.

**Why this priority**: Automates a core T20 rule, reducing player error.

**Independent Test**: Change the character's Intelligence attribute and verify the "Limite Máximo" in the panel updates accordingly.

**Acceptance Scenarios**:

1. **Given** a Mago with Intelligence 18 (+4 mod), **When** checking the panel, **Then** the limit for each available circle should be 5 (1 + 4).
2. **Given** a Mago with Intelligence 20 (+5 mod), **When** checking the panel, **Then** the limit for each available circle should update to 6.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST identify if an Actor is an Arcanista with the Mago path before injecting the UI.
- **FR-002**: The system MUST count "Known Spells" by iterating through the actor's items of type "spell" and grouping them by circle (1st to 5th).
- **FR-003**: The system MUST count "Prepared Spells" by checking the preparation state of each spell item.
- **FR-004**: The system MUST calculate the "Maximum Prepared Limit" as **half of the total number of known spells** (rounded down).
- **FR-005**: The system MUST display a table/grid in the Actor Sheet (Spells tab) showing: Circle, Known Spells, Prepared Spells, Maximum Limit, and Status.
- **FR-006**: The system MUST update the UI reactively using the `renderActorSheet` hook.
- **FR-007**: All user-facing strings MUST be localized using `game.i18n.localize`.

### Key Entities

- **SpellControlPanel**: The UI component injected into the Actor Sheet.
- **SpellCounts**: A data structure containing the sums of known and prepared spells, grouped by circle.
- **PreparationLimit**: The calculated value based on character attributes and T20 rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Spell calculation logic matches Tormenta20 rules for Magos with 100% accuracy.
- **SC-002**: UI updates reactively within 100ms of a data change in Foundry.
- **SC-003**: 100% of user-facing strings are localized via `game.i18n.localize`.
- **SC-004**: No infinite rendering loops triggered during actor sheet interaction.

## Assumptions

- **A-001**: The Tormenta20 system for Foundry VTT uses standard item types ("spell" or "magia") and attributes (`system.atributos.int.mod`).
- **A-002**: The "Mago" path is identified by a specific property in the Arcanista class item (e.g., `system.subclasse` or `system.caminho`).
- **A-003**: The user wants the control panel specifically in the Spells tab of the Actor Sheet.
- **A-004**: The "1 + Int" rule applies to all circles available to the Mago uniformly.
red spells, regardless of their individual circles.
