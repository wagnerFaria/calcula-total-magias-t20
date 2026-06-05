# Research: T20 Wizard Spell Comptroller

## Decision: Modular Hook Injection
- **Decision**: Use `Hooks.on('renderActorSheet', ...)` to detect Mago characters and inject the UI.
- **Rationale**: This is the standard Foundry VTT pattern for extending existing sheets. It ensures the panel is re-rendered whenever the sheet data changes.
- **Alternatives considered**: MutationObserver on the DOM (too brittle), overwriting the ActorSheet class (too intrusive).

## Decision: Decoupled Calculation Logic
- **Decision**: Create a pure function `calculateSpellData(actor)` in `logic.js`.
- **Rationale**: Allows for unit testing with Jest without needing a full Foundry environment. Ensures accuracy of T20 rule implementation.
- **Alternatives considered**: Inlining logic in the hook (untestable), using Foundry's `DataModel` (complex for simple sums).

## Decision: Data Path Verification
- **Decision**: Target `item.system.circulo` for spell circles and count all spell items to determine the preparation limit.
- **Rationale**: Based on current Tormenta20 system (T20) architecture for Foundry VTT. The limit is half the total count of spell items.
- **Note**: Will include a safety check for path existence to prevent crashes on system updates.

## Decision: UI Integration
- **Decision**: Use `template.hbs` and inject it into the `.tab.spells` container using jQuery (provided by Foundry).
- **Rationale**: Standard Foundry UI pattern. jQuery simplifies DOM manipulation within hooks.
