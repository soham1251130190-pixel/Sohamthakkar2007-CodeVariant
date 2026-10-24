/**
 * Converts card drops into reducer actions. Keeping this separate lets the
 * DnD component remain an event bridge rather than a business-logic owner.
 */
export function buildHistorySnapshot(state) {
  return {
    item: { itemId: state.itemId, price: state.price },
    problem: {
      symptomId: state.symptomId,
      severity: state.severity,
      intent: state.intent,
      flags: [...state.flags],
    },
    priorities: { presetKey: state.presetKey },
    skillLevel: state.skillLevel,
  };
}

export function makeCanvasAction(type, payload, { itemName, state } = {}) {
  if (type === 'SET_PLAN' || type === 'SAVE_FOR_LATER') {
    return {
      type,
      payload: {
        optionId: payload.id,
        score: payload.score,
        itemName,
        snapshot: buildHistorySnapshot(state),
      },
    };
  }
  if (type === 'RULE_OUT') {
    return { type, payload: payload.id };
  }
  return { type, payload };
}
