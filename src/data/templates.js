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
  // Generic fallback per criterion
  cost: {
    positive: 'Costs about {pct}% of a new {item}.',
    negative: 'Repair would cost about {pct}% of a new one.',
  },
  effort: {
    positive: 'Quick fix: about {minutes} minutes, {skill} skill.',
    negative: 'Needs about {minutes} minutes and {skill} skill.',
  },
  eco: {
    positive: 'Keeps the {item} out of the waste stream.',
    negative: 'Adds e-waste and a new product’s footprint.',
  },
  solves: {
    positive: 'Restores it to normal use.',
    negative: 'Won’t fix the original problem.',
  },

  // Option-specific templates
  repair: {
    cost: {
      positive: 'Costs about {pct}% of a new {item}.',
      negative: 'Repair would cost about {pct}% of a new one.',
    },
    effort: {
      positive: 'Quick fix: about {minutes} minutes, {skill} skill.',
      negative: 'Needs about {minutes} minutes and {skill} skill.',
    },
    eco: {
      positive: 'Keeps the {item} out of the waste stream.',
      negative: 'Higher carbon footprint than reusing as-is.',
    },
    solves: {
      positive: 'Restores it to normal use.',
      negative: 'May not fully fix it.',
    },
  },
  reuse: {
    cost: {
      positive: 'Little or no cost, little effort.',
      negative: 'Takes more effort than the winner.',
    },
    effort: {
      positive: 'Little or no cost, little effort.',
      negative: 'Takes more effort than the winner.',
    },
    eco: {
      positive: 'Extends lifespan with zero manufacturing impact.',
      negative: 'Lower environmental return than repairing.',
    },
    solves: {
      positive: 'Still useful in a new role.',
      negative: 'Won’t fix the original problem.',
    },
  },
  repurpose: {
    cost: {
      positive: 'Little or no cost, little effort.',
      negative: 'Takes more effort than the winner.',
    },
    effort: {
      positive: 'Little or no cost, little effort.',
      negative: 'Takes more effort than the winner.',
    },
    eco: {
      positive: 'Repurposes materials creatively.',
      negative: 'Takes more effort than the winner.',
    },
    solves: {
      positive: 'Still useful in a new role.',
      negative: 'Won’t fix the original problem.',
    },
  },
  replace: {
    cost: {
      positive: 'Provides a reliable replacement under warranty.',
      negative: 'Costs about {multiple}x more than repairing.',
    },
    effort: {
      positive: 'Fast turnaround with no DIY troubleshooting needed.',
      negative: 'Requires research and buying effort.',
    },
    eco: {
      positive: 'Modern energy-efficient equipment.',
      negative: 'Adds e-waste and a new product’s footprint.',
    },
    solves: {
      positive: 'Gives you a fully working one.',
      negative: 'Higher financial cost than repairing.',
    },
  },
  recycle: {
    cost: {
      positive: 'Free or low-cost municipal drop-off.',
      negative: 'Forfeits residual value.',
    },
    effort: {
      positive: 'Straightforward drop-off at collection center.',
      negative: 'Requires traveling to an e-waste center.',
    },
    eco: {
      positive: 'Recovers materials responsibly.',
      negative: 'Recycling has industrial processing energy costs.',
    },
    solves: {
      positive: 'Recovers materials responsibly.',
      negative: 'Gives up the item entirely.',
    },
  },
};
