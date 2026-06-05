# Quickstart: Validating T20 Wizard Spell Comptroller

## Prerequisites
- Foundry VTT with Tormenta20 system installed.
- The module enabled in a world.

## Validation Scenarios

### 1. UI Injection
1. Create a character.
2. Add "Arcanista" class and set path to "Mago".
3. Open the sheet -> Spells tab.
4. **Expected**: The "Spell Control" panel appears above the spell list.

### 2. Calculation Accuracy
1. Add twelve spells to the character.
2. Prepare five of them.
3. **Expected**: Total: Known: 12, Prepared: 5, Limit: 6, Status: OK.

### 3. Limit Enforcement (Visual)
1. Prepare 7 spells (with 12 known spells).
2. **Expected**: Total: Prepared: 7, Limit: 6, Status: "Limite Excedido" (highlighted).

### 4. Reactivity
1. Toggle preparation on a spell.
2. **Expected**: The counts update immediately without closing the sheet.
