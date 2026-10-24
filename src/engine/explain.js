import { whyTemplates, optionTemplates } from '../data/templates.js';

const CRITERIA = ['cost', 'effort', 'eco', 'solves'];

function fillTemplate(template, params) {
  if (!template) return '';
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match;
  });
}

function getSkillWord(skill) {
  const num = Number(skill);
  if (num >= 4) return 'high';
  if (num >= 2) return 'moderate';
  return 'low';
}

/**
 * Generates plain-language "why" and "why not" explanations for scored options.
 *
 * @param {Object} result Output from scoreItem
 * @param {Object} [ctx] Context containing itemName
 * @returns {Array} One entry per remaining option with attached notices and headline
 */
export function explain(result, ctx = {}) {
  const { options = [], notices = [], gap = 0, confidence = 'toss-up', facts = {} } = result || {};
  const itemName = ctx.itemName || 'item';

  // Derived placeholder values
  const ratio = facts.ratio ?? 0;
  const pct = Math.round(ratio * 100);
  const minutes = facts.minutes ?? 0;
  const skill = getSkillWord(facts.skill ?? 1);
  const price = facts.price ?? 0;
  const repairCost = facts.repairCost ?? 0;
  const multiple = repairCost > 0 ? Math.max(1, Math.round(price / repairCost)) : 1;

  const placeholders = {
    pct,
    minutes,
    skill,
    multiple,
    price,
    item: itemName,
  };

  const hasSafetyNotice = notices.some((n) => n.type === 'safety');
  const hasPoorValueNotice = notices.some((n) => n.type === 'poorValue');

  const safetyNoticeText =
    'Stop using it. Don’t charge, open or puncture it. Take it to an e-waste or battery drop-off.';
  const poorValueNoticeText = fillTemplate(
    'Repair is possible but costs about {pct}% of a new one.',
    placeholders
  );

  const mappedNotices = notices.map((n) => {
    if (n.type === 'safety') {
      return { ...n, message: safetyNoticeText };
    }
    if (n.type === 'poorValue') {
      return { ...n, message: poorValueNoticeText };
    }
    return n;
  });

  if (options.length === 0) {
    const emptyResult = [];
    emptyResult.notices = mappedNotices;
    emptyResult.safetyNotice = hasSafetyNotice ? safetyNoticeText : null;
    emptyResult.headline = null;
    return emptyResult;
  }

  const winner = options[0];
  const second = options[1];

  // Derive Headline for top option
  let baseHeadline = 'Toss-up: it depends on what matters most to you.';
  if (confidence === 'clear') {
    baseHeadline = 'Clear winner';
  } else if (confidence === 'close') {
    const labelA = optionTemplates[winner.id]?.label || winner.id;
    const labelB = second ? optionTemplates[second.id]?.label || second.id : '';
    baseHeadline = `Close call: ${labelA} and ${labelB} are within ${gap} points`;
  }

  if (winner.id === 'recycle') {
    baseHeadline = `${baseHeadline}. Nothing worth fixing here.`;
  }

  const entries = options.map((opt, index) => {
    const isWinner = index === 0;

    let why = [];
    let whyNot = '';
    let headline = null;
    let notice = null;

    if (opt.id === 'repair' && (opt.flags?.includes('poorValue') || hasPoorValueNotice)) {
      notice = poorValueNoticeText;
    }

    if (isWinner) {
      headline = baseHeadline;

      // Find top 2 criteria by contribution (prioritizing concrete facts cost & effort for repair)
      const sortedCriteria = [...CRITERIA].sort((a, b) => {
        const weightA = opt.id === 'repair' && (a === 'cost' || a === 'effort') ? 2 : 1;
        const weightB = opt.id === 'repair' && (b === 'cost' || b === 'effort') ? 2 : 1;
        const valA = (opt.contributions?.[a] ?? 0) * weightA;
        const valB = (opt.contributions?.[b] ?? 0) * weightB;
        return valB - valA;
      });

      const topTwo = sortedCriteria.slice(0, 2);
      why = topTwo.map((crit) => {
        const tmpl =
          whyTemplates[opt.id]?.[crit]?.positive ||
          whyTemplates[crit]?.positive ||
          'Strong performance in this area.';
        return fillTemplate(tmpl, placeholders);
      });
    } else {
      // Find criterion where it trails the winner most
      let maxDeficit = -Infinity;
      let worstCrit = CRITERIA[0];

      for (const crit of CRITERIA) {
        const winnerContrib = winner.contributions?.[crit] ?? 0;
        const optContrib = opt.contributions?.[crit] ?? 0;
        const deficit = winnerContrib - optContrib;

        if (deficit > maxDeficit) {
          maxDeficit = deficit;
          worstCrit = crit;
        }
      }

      const tmpl =
        whyTemplates[opt.id]?.[worstCrit]?.negative ||
        whyTemplates[worstCrit]?.negative ||
        'Scores lower overall than the top option.';

      whyNot = fillTemplate(tmpl, placeholders);
    }

    return {
      id: opt.id,
      why,
      whyNot,
      headline,
      notice,
    };
  });

  // Attach metadata to the returned list
  entries.notices = mappedNotices;
  entries.safetyNotice = hasSafetyNotice ? safetyNoticeText : null;
  entries.headline = baseHeadline;

  return entries;
}

