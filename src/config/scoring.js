export const gates = {
  minFixability: 0.2,
  poorValueRatio: 0.7,
  clearWinnerGap: 15,
  closeCallGap: 5,
};

export const severity = {
  fixability: { minor: 1.1, moderate: 1, severe: 0.6 }, // cap at 1 later
  repairCost: { minor: 0.8, moderate: 1, severe: 1.5 },
};

export const presets = {
  lowBudget: { budget: 70, time: 40, eco: 40, solves: 50 },
  urgent:    { budget: 20, time: 60, eco: 20, solves: 100 },
};

export const criteria = ['cost', 'effort', 'eco', 'solves'];

export const options = ['repair', 'reuse', 'repurpose', 'replace', 'recycle'];

export const symptoms = [
  {
    id: 'power',
    label: 'Power or charging failure',
    description: 'Won’t turn on, won’t charge, or loses power immediately.',
  },
  {
    id: 'physical',
    label: 'Physical breakage',
    description: 'Cracked screen, broken casing, loose parts, or structural damage.',
  },
  {
    id: 'intermittent',
    label: 'Intermittent or glitchy',
    description: 'Works intermittently, cuts out, or behaves unreliably.',
  },
  {
    id: 'cosmetic',
    label: 'Cosmetic wear',
    description: 'Scuffs, scratches, or surface wear that do not affect core function.',
  },
];

export const safetyFlags = [
  {
    id: 'swollenBattery',
    label: 'Swollen or bulging battery',
    warning: 'Severe fire risk. Stop using immediately and do not charge or puncture.',
  },
  {
    id: 'exposedWiring',
    label: 'Exposed or frayed wires',
    warning: 'Electric shock hazard. Disconnect from power source right away.',
  },
  {
    id: 'burningSmell',
    label: 'Burning smell or smoke',
    warning: 'Overheating hazard. Disconnect immediately and ventilate the room.',
  },
];

export const skillLevels = {
  beginner: 1,
  comfortable: 3,
  advanced: 5,
};

