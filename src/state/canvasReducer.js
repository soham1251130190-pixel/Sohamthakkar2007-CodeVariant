import itemsData from '../data/items.json';

export const initialCanvasState = {
  itemId: null,       // string | null
  symptomId: null,    // string | null
  severity: null,     // 'minor' | 'moderate' | 'severe' | null
  flags: [],          // string[]
  presetKey: 'lowBudget',
  price: 2500,
  skillLevel: 'beginner',
  scored: false,
  ruledOut: [],
  plan: null,         // { optionId, timestamp } | null
  history: [],        // HistoryEntry[]
  liveMessage: '',
};

export function canvasReducer(state, action) {
  switch (action.type) {
    case 'SET_ITEM': {
      const cat = itemsData.find((i) => i.id === action.payload);
      return {
        ...state,
        itemId: action.payload,
        price: cat?.replacePrice ?? state.price,
        // Clear downstream selections when item changes
        symptomId: null,
        severity: null,
        flags: [],
        scored: false,
        ruledOut: [],
        plan: null,
        liveMessage: `${cat?.name ?? action.payload} added to Item`,
      };
    }

    case 'CLEAR_ITEM':
      return {
        ...initialCanvasState,
        liveMessage: 'Item cleared',
      };

    case 'SET_SYMPTOM':
      return {
        ...state,
        symptomId: action.payload,
        severity: state.severity,
        scored: false,
        ruledOut: [],
        liveMessage: `Symptom set to ${action.payload}`,
      };

    case 'CLEAR_SYMPTOM':
      return {
        ...state,
        symptomId: null,
        severity: null,
        scored: false,
        ruledOut: [],
        liveMessage: 'Symptom cleared',
      };

    case 'SET_SEVERITY':
      return {
        ...state,
        severity: action.payload,
        scored: false,
        ruledOut: [],
        liveMessage: `Severity set to ${action.payload}`,
      };

    case 'CLEAR_SEVERITY':
      return {
        ...state,
        severity: null,
        scored: false,
        liveMessage: 'Severity cleared',
      };

    case 'TOGGLE_FLAG': {
      const flagId = action.payload;
      const current = state.flags;
      const next = current.includes(flagId)
        ? current.filter((f) => f !== flagId)
        : [...current, flagId];
      return {
        ...state,
        flags: next,
        scored: false,
        ruledOut: [],
        liveMessage: current.includes(flagId)
          ? `Safety flag ${flagId} removed`
          : `Safety flag ${flagId} added`,
      };
    }

    case 'SET_PRESET':
      return {
        ...state,
        presetKey: action.payload,
        scored: false,
        liveMessage: `Priority preset set to ${action.payload}`,
      };

    case 'CLEAR_PRESET':
      return {
        ...state,
        presetKey: 'lowBudget',
        scored: false,
        liveMessage: 'Priority preset reset to Low Budget',
      };

    case 'SET_SKILL':
      return {
        ...state,
        skillLevel: action.payload,
        scored: false,
        liveMessage: `Skill level set to ${action.payload}`,
      };

    case 'SET_PRICE':
      return {
        ...state,
        price: Number(action.payload) || state.price,
        scored: false,
      };

    case 'SCORE':
      return {
        ...state,
        scored: true,
        ruledOut: [],
        liveMessage: 'Scoring complete — results ready',
      };

    case 'CLEAR_WORKBENCH':
      return {
        ...initialCanvasState,
        history: state.history,
        liveMessage: 'Workbench cleared',
      };

    case 'RULE_OUT': {
      const id = action.payload;
      if (state.ruledOut.includes(id)) return state;
      return {
        ...state,
        ruledOut: [...state.ruledOut, id],
        liveMessage: `${id} ruled out`,
      };
    }

    case 'RESTORE_OPTION':
      return {
        ...state,
        ruledOut: state.ruledOut.filter((id) => id !== action.payload),
        liveMessage: `${action.payload} restored to ranking`,
      };

    case 'SET_PLAN': {
      const { optionId, score, itemName } = action.payload;
      const entry = {
        id: `${Date.now()}-${optionId}`,
        itemName,
        bestOptionId: optionId,
        score,
        status: 'committed',
        time: new Date().toISOString(),
      };
      return {
        ...state,
        plan: { optionId, timestamp: entry.time },
        history: [entry, ...state.history],
        liveMessage: `Plan committed to ${optionId}`,
      };
    }

    case 'SAVE_FOR_LATER': {
      const { optionId, score, itemName } = action.payload;
      const entry = {
        id: `${Date.now()}-${optionId}`,
        itemName,
        bestOptionId: optionId,
        score,
        status: 'saved',
        time: new Date().toISOString(),
      };
      return {
        ...state,
        history: [entry, ...state.history],
        liveMessage: `${optionId} saved for later`,
      };
    }

    case 'SET_LIVE_MSG':
      return { ...state, liveMessage: action.payload };

    default:
      return state;
  }
}

/**
 * Derive the intent from state — damaged if a symptom is placed, else unwanted.
 */
export function deriveIntent(state) {
  return state.symptomId ? 'damaged' : 'unwanted';
}

/**
 * Returns true if the workbench has enough data to score.
 */
export function canScore(state) {
  return Boolean(state.itemId && state.price > 0);
}

/**
 * Build the scoreItem params from canvas state.
 */
export function buildScoreParams(state, itemsData, presets) {
  const item = itemsData.find((i) => i.id === state.itemId);
  const priorities = presets[state.presetKey] ?? presets.lowBudget;
  return {
    item,
    symptomId: state.symptomId,
    severity: state.severity ?? 'moderate',
    flags: state.flags,
    intent: deriveIntent(state),
    price: state.price,
    priorities,
    skillLevel: state.skillLevel,
  };
}

