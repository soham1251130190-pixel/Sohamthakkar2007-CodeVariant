import { optionTemplates } from '../data/templates.js';
import { explain } from './explain.js';

const CRITERIA = ['cost', 'effort', 'eco', 'solves'];

/**
 * Produces all display-ready result content from the engine output.
 * This is deliberately framework-free so the canvas components only render data.
 */
export function buildResultView(result, { itemName = 'item' } = {}) {
  if (!result) return null;

  const explanations = explain(result, { itemName });
  const explanationById = new Map(explanations.map((entry) => [entry.id, entry]));

  return {
    notices: explanations.notices ?? [],
    headline: explanations.headline ?? null,
    options: result.options.map((option, index) => {
      const template = optionTemplates[option.id] ?? {};
      const explanation = explanationById.get(option.id) ?? {};
      return {
        id: option.id,
        rank: index + 1,
        label: template.label ?? option.id,
        tagline: template.tagline ?? '',
        score: option.score,
        criteria: CRITERIA.map((id) => ({
          id,
          label: id === 'eco' ? 'Eco' : `${id[0].toUpperCase()}${id.slice(1)}`,
          score: Math.round(option.criteria?.[id] ?? 0),
        })),
        why: explanation.why ?? [],
        whyNot: explanation.whyNot ?? '',
        isBestMatch: index === 0,
        payload: option,
      };
    }),
    removed: result.removed.map((option) => ({
      id: option.id,
      label: optionTemplates[option.id]?.label ?? option.id,
      reason: option.reason,
    })),
  };
}
