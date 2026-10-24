import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreItem } from '../src/engine/score.js';
import { explain } from '../src/engine/explain.js';
import { presets } from '../src/config/scoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsPath = path.resolve(__dirname, '../src/data/items.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
const findItem = (id) => items.find((i) => i.id === id);

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- Running Fix It First Explanation Engine Tests ---\n');

// Case A: charger, physical, moderate, lowBudget
{
  const charger = findItem('charger');
  const res = scoreItem({
    item: charger,
    symptomId: 'physical',
    severity: 'moderate',
    flags: [],
    intent: 'damaged',
    price: 2500,
    priorities: presets.lowBudget,
    skillLevel: 'beginner',
  });

  const explanations = explain(res, { itemName: 'charger' });
  const repairExpl = explanations.find((e) => e.id === 'repair');
  const replaceExpl = explanations.find((e) => e.id === 'replace');

  const repairWhyText = repairExpl?.why?.join(' ') || '';
  assert(repairWhyText.includes('12%'), `Case A Repair why contains '12%' (got "${repairWhyText}")`);
  assert(repairWhyText.includes('20 minutes'), `Case A Repair why contains '20 minutes' (got "${repairWhyText}")`);

  const replaceWhyNot = replaceExpl?.whyNot || '';
  assert(replaceWhyNot.includes('8x'), `Case A Replace whyNot contains '8x' (got "${replaceWhyNot}")`);

  // Assert structure invariants
  const topEntry = explanations[0];
  assert(topEntry.why?.length === 2, `Top entry has exactly 2 why strings (got ${topEntry.why?.length})`);
  for (let i = 1; i < explanations.length; i++) {
    const entry = explanations[i];
    assert(Boolean(entry.whyNot && entry.whyNot.length > 0), `Non-top entry ${entry.id} has non-empty whyNot`);
  }
}

// Case B: charger, power, urgent
{
  const charger = findItem('charger');
  const res = scoreItem({
    item: charger,
    symptomId: 'power',
    severity: 'moderate',
    flags: [],
    intent: 'damaged',
    price: 2500,
    priorities: presets.urgent,
    skillLevel: 'beginner',
  });

  const explanations = explain(res, { itemName: 'charger' });
  const topEntry = explanations[0];
  const repairEntry = explanations.find((e) => e.id === 'repair');

  assert(topEntry.id === 'replace', `Case B Replace is top (got ${topEntry.id})`);

  const poorValueNoticeText = 'Repair is possible but costs about 72% of a new one.';
  assert(
    repairEntry?.notice?.includes('72%') || repairEntry?.notice?.includes('poor') || repairEntry?.notice === poorValueNoticeText,
    `Case B Repair carries poor-value notice text (got "${repairEntry?.notice}")`
  );

  // Invariants
  assert(topEntry.why?.length === 2, `Case B top entry has 2 why strings`);
  for (let i = 1; i < explanations.length; i++) {
    assert(Boolean(explanations[i].whyNot), `Case B non-top entry ${explanations[i].id} has non-empty whyNot`);
  }
}

// Case C: phone, swollen battery
{
  const phone = findItem('phone');
  const res = scoreItem({
    item: phone,
    symptomId: 'power',
    severity: 'moderate',
    flags: ['swollenBattery'],
    intent: 'damaged',
    price: 20000,
    priorities: presets.lowBudget,
    skillLevel: 'beginner',
  });

  const explanations = explain(res, { itemName: 'phone' });

  const hasSafetyNotice =
    explanations.safetyNotice?.includes('Stop using it') ||
    explanations.notices?.some((n) => n.message?.includes('Stop using it'));
  assert(hasSafetyNotice, 'Case C safety notice text is present');

  const hasRepairOrReuse = explanations.some((e) => e.id === 'repair' || e.id === 'reuse');
  assert(!hasRepairOrReuse, 'Case C no Repair or Reuse entries exist');

  // Invariants
  const topEntry = explanations[0];
  assert(topEntry.why?.length === 2, `Case C top entry has 2 why strings`);
  for (let i = 1; i < explanations.length; i++) {
    assert(Boolean(explanations[i].whyNot), `Case C non-top entry ${explanations[i].id} has non-empty whyNot`);
  }
}

if (failed) {
  console.error('\n❌ One or more explanation checks failed.');
  process.exit(1);
} else {
  console.log('\n🎉 All check:explain cases passed successfully!');
  process.exit(0);
}

