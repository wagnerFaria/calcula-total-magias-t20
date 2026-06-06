/**
 * Decoupled logic for calculating spell counts and limits for T20 Magos.
 */
export function calculateSpellData(actor) {
  console.log(`T20 Wizard Spell Comptroller | Starting calculation for ${actor.name}`);
  const items = actor.items || [];
  
  // 1. Identify if character is a Mago
  const hasArcanistaClass = items.some(item => 
    item.type === "classe" && item.name?.toLowerCase().includes("arcanista")
  );
  const hasMagoPath = items.some(item => 
    (item.type === "poder" || item.type === "ability") && 
    (item.name?.toLowerCase().includes("mago") || item.name?.toLowerCase().includes("caminho do arcanista"))
  );
  
  const hasFlag = !!(actor.flags?.tormenta20?.mago);
  
  const isMago = (hasArcanistaClass && hasMagoPath) || hasFlag;

  console.log(`T20 Wizard Spell Comptroller | Detection: Arcanista=${hasArcanistaClass}, PathMago=${hasMagoPath}, FlagMago=${hasFlag} => isMago=${isMago}`);

  // 2. Initialize structure
  const result = {
    isMago,
    totalKnown: 0,
    totalPrepared: 0,
    limit: 0,
    isWithinLimit: true,
    status: "ok",
    statusLabel: "T20WIZARD.StatusOk",
    arcane: 0,
    divine: 0,
    universal: 0,
    circles: [
      { level: 1, label: "T20WIZARD.Circle1", known: 0, prepared: 0 },
      { level: 2, label: "T20WIZARD.Circle2", known: 0, prepared: 0 },
      { level: 3, label: "T20WIZARD.Circle3", known: 0, prepared: 0 },
      { level: 4, label: "T20WIZARD.Circle4", known: 0, prepared: 0 },
      { level: 5, label: "T20WIZARD.Circle5", known: 0, prepared: 0 }
    ]
  };

  if (!isMago) return result;

  // 3. Filter and count spells
  const spells = items.filter(item => 
    item.type === "magia" || 
    item.type === "spell"
  );
  
  console.log(`T20 Wizard Spell Comptroller | Found ${spells.length} items identified as spells.`);

  spells.forEach(spell => {
    const circleLevel = spell.system?.circulo ?? spell.system?.level;
    const isPrepared = !!(spell.system?.preparada ?? spell.system?.prepared ?? spell.flags?.tormenta20?.preparada);
    const tipo = spell.system?.tipo;

    result.totalKnown++;
    if (isPrepared) result.totalPrepared++;

    if (circleLevel >= 1 && circleLevel <= 5) {
      const circleData = result.circles[circleLevel - 1];
      circleData.known++;
      if (isPrepared) circleData.prepared++;
    }

    if (tipo === "arc") result.arcane++;
    else if (tipo === "div") result.divine++;
    else if (tipo === "uni") result.universal++;
  });

  // 4. Calculate limit: half of total known spells (floor)
  result.limit = Math.floor(result.totalKnown / 2);

  // 5. Check global status
  result.isWithinLimit = result.totalPrepared <= result.limit;
  if (!result.isWithinLimit) {
    result.status = "exceeded";
    result.statusLabel = "T20WIZARD.StatusExceeded";
  }

  console.log(`T20 Wizard Spell Comptroller | Calculation finished: Known=${result.totalKnown}, Prepared=${result.totalPrepared}, Limit=${result.limit}, Status=${result.status}`);

  return result;
}
