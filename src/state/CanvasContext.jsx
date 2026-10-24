import { useReducer, useMemo } from 'react';
import { CanvasContext } from './canvasContext.js';
import {
  initialCanvasState,
  canvasReducer,
  buildScoreParams,
} from './canvasReducer.js';
import itemsData from '../data/items.json';
import { presets } from '../config/scoring.js';
import { scoreItem } from '../engine/score.js';
import { buildResultView } from '../engine/resultView.js';
import { gates } from '../config/scoring.js';

export function CanvasProvider({ children }) {
  const [state, dispatch] = useReducer(canvasReducer, initialCanvasState);

  const currentCategory = useMemo(() => {
    return itemsData.find((i) => i.id === state.itemId) ?? null;
  }, [state.itemId]);

  // Raw score — recomputed whenever scored=true and inputs change
  const rawScoreResult = useMemo(() => {
    if (!state.scored || !state.itemId) return null;
    const params = buildScoreParams(state, itemsData, presets);
    return scoreItem(params);
  }, [state]);

  // Filtered score — apply ruledOut and recompute confidence/gap
  const scoreResult = useMemo(() => {
    if (!rawScoreResult) return null;
    if (!state.ruledOut.length) return rawScoreResult;

    const filteredOptions = rawScoreResult.options.filter(
      (o) => !state.ruledOut.includes(o.id)
    );
    const ruledOutRemoved = state.ruledOut
      .filter((id) => rawScoreResult.options.some((o) => o.id === id))
      .map((id) => ({ id, reason: 'Ruled out by user' }));

    let confidence = 'toss-up';
    let gap = 0;
    if (filteredOptions.length >= 2) {
      gap = filteredOptions[0].score - filteredOptions[1].score;
      if (gap >= gates.clearWinnerGap) confidence = 'clear';
      else if (gap >= gates.closeCallGap) confidence = 'close';
    } else if (filteredOptions.length === 1) {
      gap = filteredOptions[0].score;
      confidence = 'clear';
    }

    return {
      ...rawScoreResult,
      options: filteredOptions,
      removed: [...rawScoreResult.removed, ...ruledOutRemoved],
      gap,
      confidence,
    };
  }, [rawScoreResult, state.ruledOut]);

  const resultView = useMemo(
    () => buildResultView(scoreResult, { itemName: currentCategory?.name ?? 'item' }),
    [scoreResult, currentCategory]
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      currentCategory,
      scoreResult,
      resultView,
      rawScoreResult,
    }),
    [state, currentCategory, scoreResult, resultView, rawScoreResult]
  );

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

