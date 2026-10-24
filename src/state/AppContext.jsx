import { useReducer, useMemo } from 'react';
import itemsData from '../data/items.json';
import { presets } from '../config/scoring.js';
import { scoreItem } from '../engine/score.js';
import { AppContext } from './context.js';

const DEFAULT_CATEGORY_ID = 'charger';
const defaultItem = itemsData.find((i) => i.id === DEFAULT_CATEGORY_ID) || itemsData[0];

const initialState = {
  step: 1,
  item: {
    categoryId: defaultItem.id,
    age: '',
    price: defaultItem.replacePrice,
    intent: 'damaged', // 'damaged' | 'unwanted'
  },
  problem: {
    symptomId: 'physical',
    severity: 'moderate', // 'minor' | 'moderate' | 'severe'
    flags: [],
    text: '',
  },
  priorities: { ...presets.lowBudget }, // budget: 70, time: 40, eco: 40, solves: 50
  skillLevel: 'beginner', // 'beginner' | 'comfortable' | 'advanced'
  history: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };

    case 'UPDATE_ITEM': {
      const updatedItem = { ...state.item, ...action.payload };
      let updatedProblem = { ...state.problem };

      // If category changed, prefill default replacePrice and prune incompatible safety flags
      if (action.payload.categoryId && action.payload.categoryId !== state.item.categoryId) {
        const cat = itemsData.find((i) => i.id === action.payload.categoryId);
        if (cat) {
          updatedItem.price = cat.replacePrice;
          const applicable = cat.applicableFlags || [];
          updatedProblem.flags = updatedProblem.flags.filter((f) => applicable.includes(f));
        }
      }

      // If intent switched to unwanted, clear problem flags & text
      if (action.payload.intent === 'unwanted') {
        updatedProblem.flags = [];
        updatedProblem.text = '';
      }

      return {
        ...state,
        item: updatedItem,
        problem: updatedProblem,
      };
    }

    case 'UPDATE_PROBLEM':
      return {
        ...state,
        problem: { ...state.problem, ...action.payload },
      };

    case 'UPDATE_PRIORITIES':
      return {
        ...state,
        priorities: { ...state.priorities, ...action.payload },
      };

    case 'APPLY_PRESET':
      return {
        ...state,
        priorities: { ...action.payload },
      };

    case 'SET_SKILL_LEVEL':
      return {
        ...state,
        skillLevel: action.payload,
      };

    case 'RESET':
      return {
        ...initialState,
        priorities: { ...presets.lowBudget },
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const currentCategory = useMemo(() => {
    return itemsData.find((i) => i.id === state.item.categoryId) || itemsData[0];
  }, [state.item.categoryId]);

  const scoreResult = useMemo(() => {
    if (state.step !== 4) return null;

    return scoreItem({
      item: currentCategory,
      symptomId: state.problem.symptomId,
      severity: state.problem.severity,
      flags: state.problem.flags,
      intent: state.item.intent,
      price: Number(state.item.price) || currentCategory.replacePrice,
      priorities: state.priorities,
      skillLevel: state.skillLevel,
    });
  }, [
    state.step,
    currentCategory,
    state.problem.symptomId,
    state.problem.severity,
    state.problem.flags,
    state.item.intent,
    state.item.price,
    state.priorities,
    state.skillLevel,
  ]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      currentCategory,
      scoreResult,
    }),
    [state, currentCategory, scoreResult]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
