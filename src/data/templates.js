export const optionTemplates = {
  repair: {
    label: 'Repair',
    tagline: 'Fix the fault and restore full original functionality.',
    pointerType: 'repair shop',
    fallback: 'If this doesn’t work, try the next option',
    nextSteps: [
      'Assess whether the repair requires specialist tools or basic skills',
      'Estimate replacement part costs and order the right components',
      'Safely power down or unplug the item before opening',
      'Follow a step-by-step repair guide or take it to a qualified technician',
      'Test the device thoroughly to ensure safe and reliable operation',
    ],
  },
  reuse: {
    label: 'Reuse',
    tagline: 'Keep using it as-is for a simpler role or pass it on.',
    pointerType: 'resale',
    fallback: 'If this doesn’t work, try the next option',
    nextSteps: [
      'Identify secondary uses that don’t depend on the broken feature',
      'Clean the item and confirm it remains safe to handle',
      'Offer the item to a friend, family member, or community group',
      'List it on a local community sharing or free-cycling group',
    ],
  },
  repurpose: {
    label: 'Repurpose',
    tagline: 'Transform parts or materials into something entirely new.',
    pointerType: 'DIY guide',
    fallback: 'If this doesn’t work, try the next option',
    nextSteps: [
      'Identify functional components or materials that can be salvaged',
      'Disassemble carefully using appropriate safety gear',
      'Clean, trim, and prepare parts for their new purpose',
      'Assemble your upcycled creation or store parts for future projects',
    ],
  },
  replace: {
    label: 'Replace',
    tagline: 'Purchase a reliable replacement when fixing isn’t practical.',
    pointerType: 'resale',
    fallback: 'If this doesn’t work, try the next option',
    nextSteps: [
      'Look for durable, repairable, or certified refurbished models',
      'Check for trade-in discounts or exchange programs for your old item',
      'Safely back up and transfer data or accessories before retiring',
      'Plan responsible disposal or recycling for the outgoing unit',
    ],
  },
  recycle: {
    label: 'Recycle',
    tagline: 'Reclaim raw materials and prevent hazardous waste in landfills.',
    pointerType: 'drop-off point',
    fallback: 'If this doesn’t work, try the next option',
    nextSteps: [
      'Separate detachable cables, batteries, and accessories',
      'Ensure any personal data or sensitive storage has been wiped',
      'Find an authorised e-waste or municipal recycling drop-off point',
      'Deposit the item into the designated collection bin or book a pickup',
    ],
  },
};

export const { repair, reuse, repurpose, replace, recycle } = optionTemplates;

export const whyTemplates = {
  cost: {
    positive: 'Repair costs only {ratio}% of a replacement, saving you significant money.',
    negative: 'Repair costs {ratio}% of replacement price, which is poor financial value.',
  },
  effort: {
    positive: 'Quick and easy to fix in roughly {minutes} minutes with moderate effort.',
    negative: 'Demanding repair requiring around {minutes} minutes and specialized skill.',
  },
  eco: {
    positive: 'High environmental benefit by keeping materials in circulation and out of landfill.',
    negative: 'Higher carbon footprint and resource consumption than circular alternatives.',
  },
  solves: {
    positive: 'Completely resolves the issue and restores full functionality.',
    negative: 'Only partially addresses the problem, leaving ongoing limitations.',
  },
};

