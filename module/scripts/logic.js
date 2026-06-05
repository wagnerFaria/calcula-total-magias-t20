/**
 * Decoupled logic for calculating spell counts and limits for T20 Magos.
 */
export function calculateSpellData(actor) {
  const items = actor.items || [];
  
  // 1. Identify if character is a Mago
  const hasArcanistaClass = items.some(item => 
    item.type === "classe" && item.name === "Arcanista"
  );
  const hasMagoPath = items.some(item => 
    item.type === "poder" && item.name === "Caminho do Arcanista: Mago"
  );
  
  const isMago = hasArcanistaClass && hasMagoPath;

  // 2. Initialize structure
  const result = {
    isMago,
    totalKnown: 0,
    totalPrepared: 0,
    limit: 0,
    status: "ok",
    statusLabel: "T20WIZARD.StatusOk",
    circles: [
      { level: 1, label: "T20WIZARD.Circle1", known: 0, prepared: 0, status: "ok" },
      { level: 2, label: "T20WIZARD.Circle2", known: 0, prepared: 0, status: "ok" },
      { level: 3, label: "T20WIZARD.Circle3", known: 0, prepared: 0, status: "ok" },
      { level: 4, label: "T20WIZARD.Circle4", known: 0, prepared: 0, status: "ok" },
      { level: 5, label: "T20WIZARD.Circle5", known: 0, prepared: 0, status: "ok" }
    ]
  };

  if (!isMago) return result;

  // 3. Filter and count spells
  const spells = items.filter(item => item.type === "magia");
  
  spells.forEach(spell => {
    const circleLevel = spell.system?.circulo ?? spell.system?.level;
    const isPrepared = !!(spell.system?.preparada ?? spell.system?.prepared ?? spell.flags?.tormenta20?.preparada);

    result.totalKnown++;
    if (isPrepared) result.totalPrepared++;

    if (circleLevel >= 1 && circleLevel <= 5) {
      const circleData = result.circles[circleLevel - 1];
      circleData.known++;
      if (isPrepared) circleData.prepared++;
    }
  });

  // 4. Calculate limit: half of total known spells (floor)
  result.limit = Math.floor(result.totalKnown / 2);

  // 5. Check global status
  if (result.totalPrepared > result.limit) {
    result.status = "exceeded";
    result.statusLabel = "T20WIZARD.StatusExceeded";
  }

  return result;
}
