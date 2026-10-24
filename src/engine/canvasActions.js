/**
 * Converts card drops into reducer actions. Keeping this separate lets the
 * DnD component remain an event bridge rather than a business-logic owner.
 */
export function makeCanvasAction(type, payload, { itemName } = {}) {
  if (type === 'SET_PLAN' || type === 'SAVE_FOR_LATER') {
    return {
      type,
      payload: {
        optionId: payload.id,
        score: payload.score,
        itemName,
      },
    };
  }
  if (type === 'RULE_OUT') {
    return { type, payload: payload.id };
  }
  return { type, payload };
}
