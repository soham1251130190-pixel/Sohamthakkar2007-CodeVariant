import {
  gates,
  severity as severityMultipliers,
  skillLevels,
  optionConstants,
} from '../config/scoring.js';

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Pure scoring function for evaluating 5 circular/action paths for an item.
 *
 * @param {Object} params
 * @param {Object} params.item Category item definition
 * @param {string} [params.symptomId] Selected symptom ID
 * @param {string} [params.severity] Severity level: 'minor' | 'moderate' | 'severe'
 * @param {string[]} [params.flags] Active safety flag IDs
 * @param {string} [params.intent] 'damaged' | 'unwanted'
 * @param {number} [params.price] User replacement price
 * @param {Object} [params.priorities] Slider priorities { budget, time, eco, solves }
 * @param {string} [params.skillLevel] 'beginner' | 'comfortable' | 'advanced'
 * @returns {Object} { options, removed, notices, gap, confidence }
 */
export function scoreItem({
  item,
  symptomId,
  severity = 'moderate',
  flags = [],
  intent = 'damaged',
  price,
  priorities = {},
  skillLevel = 'beginner',
}) {
  const notices = [];
  const removed = [];
  const isUnwanted = intent === 'unwanted';
  const effectivePrice = Number(price) > 0 ? Number(price) : (item?.replacePrice ?? 2500);

  // 1. Safety flags check (Gate)
  const hasSafetyFlag = Array.isArray(flags) && flags.length > 0;
  if (hasSafetyFlag) {
    removed.push(
      { id: 'repair', reason: 'Safety risk detected' },
      { id: 'reuse', reason: 'Safety risk detected' },
      { id: 'repurpose', reason: 'Safety risk detected' }
    );
    notices.push({
      type: 'safety',
      message: 'Safety hazard detected. DIY repair, reuse, and repurpose options have been disabled.',
    });
  }

  // 2. Unwanted vs Damaged item gating
  let symptom = null;
  let fix = 0;
  let repairCost = 0;
  let ratio = 0;
  let gap = 0;
  let minutes = 0;
  let isPoorValue = false;

  if (isUnwanted) {
    if (!hasSafetyFlag) {
      removed.push({ id: 'repair', reason: 'Item is unwanted, not damaged' });
    }
  } else {
    // Damaged intent
    symptom = item?.symptoms?.[symptomId] || item?.symptoms?.power;

    const sevFix = severityMultipliers?.fixability?.[severity] ?? 1;
    const sevCost = severityMultipliers?.repairCost?.[severity] ?? 1;

    fix = clamp((symptom?.fixability ?? 0) * sevFix, 0, 1);
    repairCost = (symptom?.repairCost ?? 0) * sevCost;
    ratio = effectivePrice > 0 ? repairCost / effectivePrice : 0;

    const userSkill = skillLevels?.[skillLevel] ?? skillLevels?.beginner ?? 1;
    const skillNeed = symptom?.skill ?? 1;
    gap = Math.max(0, skillNeed - userSkill);
    minutes = symptom?.repairMinutes ?? 30;

    // Check fixability gate
    if (!hasSafetyFlag && fix < gates.minFixability) {
      removed.push({ id: 'repair', reason: 'Fixability is below the minimum threshold' });
    }

    // Check poor value gate
    if (ratio > gates.poorValueRatio) {
      isPoorValue = true;
      notices.push({
        type: 'poorValue',
        message: 'Repair cost is high relative to replacement price.',
      });
    }
  }

  const isRemoved = (id) => removed.some((r) => r.id === id);

  // 3. Criteria calculation (each clamped 0 to 100)
  const allCriteria = {};

  // Repair
  if (!isRemoved('repair') && symptom) {
    const costScore = clamp(100 - ratio * 100);
    const effortScore = clamp(
      optionConstants.repair.effortBase -
        minutes * optionConstants.repair.minutesFactor -
        symptom.skill * optionConstants.repair.skillFactor -
        gap * optionConstants.repair.gapFactor
    );
    const ecoScore = clamp(optionConstants.repair.eco);
    const solvesScore = clamp(fix * 100 * optionConstants.repair.solvesFactor);

    allCriteria.repair = {
      cost: costScore,
      effort: effortScore,
      eco: ecoScore,
      solves: solvesScore,
    };
  }

  // Reuse
  if (!isRemoved('reuse')) {
    allCriteria.reuse = {
      cost: clamp(optionConstants.reuse.cost),
      effort: clamp(optionConstants.reuse.effort),
      eco: clamp(optionConstants.reuse.eco),
      solves: clamp(isUnwanted ? optionConstants.reuse.solvesUnwanted : optionConstants.reuse.solves),
    };
  }

  // Repurpose
  if (!isRemoved('repurpose')) {
    allCriteria.repurpose = {
      cost: clamp(optionConstants.repurpose.cost),
      effort: clamp(optionConstants.repurpose.effort),
      eco: clamp(optionConstants.repurpose.eco),
      solves: clamp(isUnwanted ? optionConstants.repurpose.solvesUnwanted : optionConstants.repurpose.solves),
    };
  }

  // Replace
  if (!isRemoved('replace')) {
    const replaceCostScore = clamp(
      optionConstants.replace.costBase - effectivePrice * optionConstants.replace.costPerRupee,
      optionConstants.replace.costMin,
      optionConstants.replace.costMax
    );
    allCriteria.replace = {
      cost: replaceCostScore,
      effort: clamp(optionConstants.replace.effort),
      eco: clamp(optionConstants.replace.eco),
      solves: clamp(optionConstants.replace.solves),
    };
  }

  // Recycle
  if (!isRemoved('recycle')) {
    const recyclability = item?.recyclability ?? 0.5;
    allCriteria.recycle = {
      cost: clamp(optionConstants.recycle.cost),
      effort: clamp(optionConstants.recycle.effort),
      eco: clamp(recyclability * optionConstants.recycle.ecoFactor),
      solves: clamp(optionConstants.recycle.solves),
    };
  }

  // 4. Normalized Weights
  const rawWeights = {
    cost: Number(priorities?.budget ?? 0),
    effort: Number(priorities?.time ?? 0),
    eco: Number(priorities?.eco ?? 0),
    solves: Number(priorities?.solves ?? 0),
  };
  const sumWeights = rawWeights.cost + rawWeights.effort + rawWeights.eco + rawWeights.solves;

  const weights = sumWeights > 0
    ? {
        cost: rawWeights.cost / sumWeights,
        effort: rawWeights.effort / sumWeights,
        eco: rawWeights.eco / sumWeights,
        solves: rawWeights.solves / sumWeights,
      }
    : { cost: 0.25, effort: 0.25, eco: 0.25, solves: 0.25 };

  // 5. Calculate scores and contributions
  const options = [];

  for (const [id, crit] of Object.entries(allCriteria)) {
    const contributions = {
      cost: weights.cost * crit.cost,
      effort: weights.effort * crit.effort,
      eco: weights.eco * crit.eco,
      solves: weights.solves * crit.solves,
    };

    const rawScore =
      contributions.cost +
      contributions.effort +
      contributions.eco +
      contributions.solves;

    const optFlags = [];
    if (id === 'repair' && isPoorValue) {
      optFlags.push('poorValue');
    }

    options.push({
      id,
      score: Math.round(rawScore),
      rawScore,
      criteria: crit,
      contributions,
      flags: optFlags,
    });
  }

  // Sort descending by rawScore
  options.sort((a, b) => b.rawScore - a.rawScore);

  // 6. Gap & confidence determination
  let confidence = 'toss-up';
  let scoreGap = 0;

  if (options.length >= 2) {
    scoreGap = options[0].score - options[1].score;
    if (scoreGap >= gates.clearWinnerGap) {
      confidence = 'clear';
    } else if (scoreGap >= gates.closeCallGap) {
      confidence = 'close';
    } else {
      confidence = 'toss-up';
    }
  } else if (options.length === 1) {
    scoreGap = options[0].score;
    confidence = 'clear';
  }

  return {
    options,
    removed,
    notices,
    gap: scoreGap,
    confidence,
  };
}
