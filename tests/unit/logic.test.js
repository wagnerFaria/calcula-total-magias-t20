import { calculateSpellData } from '../../module/scripts/logic.js';

describe('calculateSpellData', () => {
  const mockMagoActor = {
    flags: {
      tormenta20: {
        mago: true
      }
    },
    items: [
      { name: 'Spell 1-1', type: 'magia', system: { circulo: 1, preparada: true } },
      { name: 'Spell 1-2', type: 'magia', system: { circulo: 1, preparada: false } },
      { name: 'Spell 2-1', type: 'magia', system: { circulo: 2, preparada: true } },
      { name: 'Spell 3-1', type: 'magia', system: { circulo: 3, preparada: false } },
    ]
  };

  test('should identify Mago correctly', () => {
    const result = calculateSpellData(mockMagoActor);
    expect(result.isMago).toBe(true);
  });

  test('should return isMago: false for non-Magos', () => {
    const nonMagoActor = {
      flags: {
        tormenta20: {
          mago: false
        }
      },
      items: []
    };
    const result = calculateSpellData(nonMagoActor);
    expect(result.isMago).toBe(false);
  });

  test('should count known spells correctly', () => {
    const result = calculateSpellData(mockMagoActor);
    expect(result.totalKnown).toBe(4);
  });

  test('should count prepared spells correctly', () => {
    const result = calculateSpellData(mockMagoActor);
    expect(result.totalPrepared).toBe(2);
  });

  test('should group spells by circle', () => {
    const result = calculateSpellData(mockMagoActor);
    
    const circle1 = result.circles.find(c => c.level === 1);
    expect(circle1.known).toBe(2);
    expect(circle1.prepared).toBe(1);

    const circle2 = result.circles.find(c => c.level === 2);
    expect(circle2.known).toBe(1);
    expect(circle2.prepared).toBe(1);

    const circle3 = result.circles.find(c => c.level === 3);
    expect(circle3.known).toBe(1);
    expect(circle3.prepared).toBe(0);
  });

  test('should calculate limit as half of known spells (floor)', () => {
    const result = calculateSpellData(mockMagoActor); // 4 known -> limit 2
    expect(result.limit).toBe(2);

    const actorWith5Spells = {
      flags: {
        tormenta20: {
          mago: true
        }
      },
      items: [
        ...mockMagoActor.items,
        { name: 'Spell 3-2', type: 'magia', system: { circulo: 3, preparada: false } }
      ]
    };
    const result2 = calculateSpellData(actorWith5Spells); // 5 known -> limit 2
    expect(result2.limit).toBe(2);
  });

  test('should set status as exceeded if prepared > limit', () => {
    const overLimitActor = {
      flags: {
        tormenta20: {
          mago: true
        }
      },
      items: [
        { name: 'S1', type: 'magia', system: { circulo: 1, preparada: true } },
        { name: 'S2', type: 'magia', system: { circulo: 1, preparada: true } },
        { name: 'S3', type: 'magia', system: { circulo: 1, preparada: true } }, // 3 prepared, 3 known -> limit 1
      ]
    };
    const result = calculateSpellData(overLimitActor);
    expect(result.status).toBe('exceeded');
  });
});

