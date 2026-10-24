export default function ProgressBar({ currentStep, intent }) {
  const isUnwanted = intent === 'unwanted';
  const totalSteps = isUnwanted ? 3 : 4;

  let displayStep = currentStep;
  if (isUnwanted) {
    if (currentStep === 1) displayStep = 1;
    else if (currentStep === 3) displayStep = 2;
    else if (currentStep === 4) displayStep = 3;
  }

  const stepLabels = isUnwanted
    ? {
        1: 'Item Details',
        2: 'Your Priorities',
        3: 'Recommendations',
      }
    : {
        1: 'Item Details',
        2: 'Problem Assessment',
        3: 'Your Priorities',
        4: 'Recommendations',
      };

  const progressPercent = Math.round((displayStep / totalSteps) * 100);

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-muted mb-2">
        <span className="text-forest uppercase tracking-wider">
          Step {displayStep} of {totalSteps}: {stepLabels[displayStep]}
        </span>
        <span className="font-bold text-ink">{progressPercent}%</span>
      </div>

      <div className="w-full h-2 bg-line/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-forest transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
