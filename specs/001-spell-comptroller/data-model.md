# Data Model: T20 Wizard Spell Comptroller

## SpellData (Calculated State)

The core logic produces this object for the UI:

| Field | Type | Description |
| :--- | :--- | :--- |
| `circles` | `Array<CircleData>` | Breakdown per spell circle (1-5) |
| `totalKnown` | `Number` | Sum of all known spells |
| `totalPrepared` | `Number` | Sum of all prepared spells |
| `isMago` | `Boolean` | Flag indicating if character is a Mago |

## CircleData

| Field | Type | Description |
| :--- | :--- | :--- |
| `level` | `Number` | Circle level (1 to 5) |
| `known` | `Number` | Count of known spells in this circle |
| `prepared` | `Number` | Count of prepared spells in this circle |
| `label` | `String` | Localized label (e.g., "1º Círculo") |

## GlobalData

| Field | Type | Description |
| :--- | :--- | :--- |
| `totalKnown` | `Number` | Sum of all known spells |
| `totalPrepared` | `Number` | Sum of all prepared spells |
| `limit` | `Number` | Max prepared limit (floor(totalKnown / 2)) |
| `status` | `String` | "ok" or "exceeded" |
