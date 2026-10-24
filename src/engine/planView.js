import { optionTemplates } from '../data/templates.js';

const OTHER_OPTION_TIMES = {
  reuse: 'A few minutes to set up',
  repurpose: 'Time for a small project',
  replace: 'Time to compare and buy',
  recycle: 'A short drop-off visit',
};

function estimateCost(optionId, facts) {
  if (optionId === 'repair') return `₹${Math.round(facts.repairCost ?? 0).toLocaleString('en-IN')}`;
  if (optionId === 'replace') return `₹${Math.round(facts.price ?? 0).toLocaleString('en-IN')}`;
  return 'Free';
}

function whereToGo(optionId, item) {
  if (optionId === 'repair') return item.repairPointer;
  if (optionId === 'recycle') return item.dropOff;
  if (optionId === 'reuse') return item.reuse?.[0];
  if (optionId === 'repurpose') return item.repurpose?.[0];
  return 'Compare repair quotes before buying new.';
}

/** Builds display-ready content for the selected plan without React dependencies. */
export function buildPlanView(plan, result, item, safetyNotice = null) {
  if (!plan || !result || !item) return null;

  const selected = result.options.find((option) => option.id === plan.optionId);
  if (!selected) return null;

  const template = optionTemplates[selected.id];
  const nextOption = result.options.find((option) => option.id !== selected.id);
  const isSafetyPlan = Boolean(safetyNotice);
  const safetySteps = [
    `Take the ${item.name} to ${item.dropOff}.`,
    safetyNotice,
  ];

  return {
    id: selected.id,
    label: template.label,
    tagline: template.tagline,
    nextSteps: isSafetyPlan ? safetySteps : template.nextSteps,
    estimatedCost: estimateCost(selected.id, result.facts),
    estimatedTime: selected.id === 'repair'
      ? `${result.facts.minutes} minutes`
      : OTHER_OPTION_TIMES[selected.id],
    whereToGo: isSafetyPlan ? item.dropOff : whereToGo(selected.id, item),
    fallback: nextOption
      ? `If this doesn’t work, try ${optionTemplates[nextOption.id].label}.`
      : 'No fallback option remains.',
  };
}

/** Formats state history for display without adding UI logic to history cards. */
export function buildHistoryView(history) {
  return history.map((entry) => ({
    ...entry,
    optionLabel: optionTemplates[entry.bestOptionId]?.label ?? entry.bestOptionId,
    statusLabel: entry.status === 'committed' ? 'Committed' : 'Saved',
    timeLabel: new Date(entry.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  }));
}
