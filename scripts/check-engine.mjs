import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreItem } from '../src/engine/score.js';
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

function approx(val, expected, tol = 1) {
  return Math.abs(val - expected) <= tol;
}

console.log('--- Running Fix It First Scoring Engine Tests ---\n');

// Case A: charger, physical, moderate, price 2500, damaged, lowBudget, beginner
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

  const getScore = (id) => res.options.find((o) => o.id === id)?.score;

  assert(res.options[0]?.id === 'repair', `Case A top option is Repair (got ${res.options[0]?.id})`);
  assert(res.confidence === 'clear', `Case A confidence is clear (got ${res.confidence})`);
  assert(approx(getScore('repair'), 84), `Case A Repair score ~84 (got ${getScore('repair')})`);
  assert(approx(getScore('reuse'), 58), `Case A Reuse score ~58 (got ${getScore('reuse')})`);
  assert(approx(getScore('repurpose'), 53), `Case A Repurpose score ~53 (got ${getScore('repurpose')})`);
  assert(approx(getScore('recycle'), 52), `Case A Recycle score ~52 (got ${getScore('recycle')})`);
  assert(approx(getScore('replace'), 48), `Case A Replace score ~48 (got ${getScore('replace')})`);
}

// Case B: charger, power, moderate, price 2500, damaged, urgent, beginner
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

  const getScore = (id) => res.options.find((o) => o.id === id)?.score;
  const repairOpt = res.options.find((o) => o.id === 'repair');

  assert(res.options[0]?.id === 'replace', `Case B Replace is first (got ${res.options[0]?.id})`);
  assert(approx(getScore('replace'), 73), `Case B Replace score ~73 (got ${getScore('replace')})`);
  assert(approx(getScore('repair'), 57), `Case B Repair score ~57 (got ${getScore('repair')})`);
  assert(repairOpt?.flags?.includes('poorValue'), 'Case B Repair is flagged poorValue');
}

// Case C: phone, power, with swollenBattery
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

  const activeIds = res.options.map((o) => o.id).sort();
  const hasSafetyNotice = res.notices.some((n) => n.type === 'safety');

  assert(
    activeIds.length === 2 && activeIds[0] === 'recycle' && activeIds[1] === 'replace',
    `Case C only Replace and Recycle remain (got ${activeIds.join(', ')})`
  );
  assert(hasSafetyNotice, 'Case C includes safety notice');
}

// Case D: phone, power, no flags
{
  const phone = findItem('phone');
  const res = scoreItem({
    item: phone,
    symptomId: 'power',
    severity: 'moderate',
    flags: [],
    intent: 'damaged',
    price: 20000,
    priorities: presets.lowBudget,
    skillLevel: 'beginner',
  });

  const repairRemoved = res.removed.some((r) => r.id === 'repair');
  const repairInOptions = res.options.some((o) => o.id === 'repair');

  assert(repairRemoved && !repairInOptions, 'Case D Repair removed (low fixability)');
}

// Case E: kettle, power
{
  const kettle = findItem('kettle');
  const res = scoreItem({
    item: kettle,
    symptomId: 'power',
    severity: 'moderate',
    flags: [],
    intent: 'damaged',
    price: 1500,
    priorities: presets.lowBudget,
    skillLevel: 'beginner',
  });

  const repairOpt = res.options.find((o) => o.id === 'repair');

  assert(repairOpt !== undefined, 'Case E Repair is present');
  assert(repairOpt?.flags?.includes('poorValue'), 'Case E Repair flagged poorValue (ratio 0.8)');
}

// Case F: any item, intent unwanted
{
  const bicycle = findItem('bicycle');
  const res = scoreItem({
    item: bicycle,
    intent: 'unwanted',
    price: 9000,
    priorities: presets.lowBudget,
    skillLevel: 'beginner',
  });

  const repairInOptions = res.options.some((o) => o.id === 'repair');
  const reuseOpt = res.options.find((o) => o.id === 'reuse');

  assert(!repairInOptions, 'Case F No Repair in active options');
  assert(reuseOpt?.criteria?.solves === 60, `Case F Reuse solves criterion = 60 (got ${reuseOpt?.criteria?.solves})`);
}

if (failed) {
  console.error('\n❌ One or more engine check cases failed.');
  process.exit(1);
} else {
  console.log('\n🎉 All 6 engine cases passed successfully!');
  process.exit(0);
}
