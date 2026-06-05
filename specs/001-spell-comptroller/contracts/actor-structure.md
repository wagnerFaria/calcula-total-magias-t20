# Contract: Tormenta20 Actor Structure

The module depends on the following data paths in the T20 system:

## Class Identification
- `actor.items`: Array of items.
- Item `type === "classe"`: Represents a character class.
- `item.name`: Expected to contain "Arcanista".
- `item.system.caminho`: Expected to be "Mago" for relevant characters.

## Spell Identification
- Item `type === "magia"`: Represents a spell.
- `item.system.circulo`: Integer (1-5) representing the spell circle.
- `item.system.preparada`: Boolean indicating if the spell is prepared.
