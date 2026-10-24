/**
 * Drop rules table.
 * Defines all legal drop operations in the canvas.
 * cardType: what is being dragged.
 * zoneId: where it is dropped.
 * action: reducer action type to dispatch.
 * The UI never decides what a drop means; it only asks this table.
 */
export const dropRules = [
  // Workbench slots
  { cardType: 'item',     zoneId: 'slot-item',       action: 'SET_ITEM' },
  { cardType: 'symptom',  zoneId: 'slot-problem',    action: 'SET_SYMPTOM' },
  { cardType: 'unwanted', zoneId: 'slot-problem',    action: 'SET_UNWANTED' },
  { cardType: 'severity', zoneId: 'slot-severity',   action: 'SET_SEVERITY' },
  { cardType: 'flag',     zoneId: 'slot-safety',     action: 'TOGGLE_FLAG' },
  { cardType: 'preset',   zoneId: 'slot-priorities', action: 'SET_PRESET' },

  // Score / clear actions
  { cardType: 'bundle',   zoneId: 'score',           action: 'SCORE' },
  { cardType: 'bundle',   zoneId: 'clear',           action: 'CLEAR_WORKBENCH' },

  // Results actions
  { cardType: 'option',   zoneId: 'commit',          action: 'SET_PLAN' },
  { cardType: 'option',   zoneId: 'save',            action: 'SAVE_FOR_LATER' },
  { cardType: 'option',   zoneId: 'ruleOut',         action: 'RULE_OUT' },
  { cardType: 'ruledOut', zoneId: 'results',         action: 'RESTORE_OPTION' },
  { cardType: 'history',  zoneId: 'reopen',          action: 'REOPEN_HISTORY' },
  { cardType: 'history',  zoneId: 'delete',          action: 'DELETE_HISTORY' },

  // Drag slot cards back to tray to clear them
  { cardType: 'item',     zoneId: 'tray',            action: 'CLEAR_ITEM' },
  { cardType: 'symptom',  zoneId: 'tray',            action: 'CLEAR_SYMPTOM' },
  { cardType: 'unwanted', zoneId: 'tray',            action: 'CLEAR_SYMPTOM' },
  { cardType: 'severity', zoneId: 'tray',            action: 'CLEAR_SEVERITY' },
  { cardType: 'flag',     zoneId: 'tray',            action: 'TOGGLE_FLAG' },
  { cardType: 'preset',   zoneId: 'tray',            action: 'CLEAR_PRESET' },
];

/**
 * Look up the action for a (cardType, zoneId) pair.
 * Returns null if no rule matches (incompatible drop).
 */
export function resolveAction(cardType, zoneId) {
  const rule = dropRules.find(
    (r) => r.cardType === cardType && r.zoneId === zoneId
  );
  return rule ? rule.action : null;
}

/**
 * Get the set of card types that a zone accepts, for highlight logic.
 */
export function acceptedTypes(zoneId) {
  return dropRules
    .filter((r) => r.zoneId === zoneId)
    .map((r) => r.cardType);
}

// Zone IDs
export const ZONES = [
  'slot-item', 'slot-problem', 'slot-severity', 'slot-safety',
  'slot-priorities', 'score', 'clear', 'commit', 'save',
  'ruleOut', 'results', 'reopen', 'delete', 'tray',
];

