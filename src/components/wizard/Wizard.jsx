import { useAppContext } from '../../state/useAppContext.js';
import Card from '../Card.jsx';
import Button from '../Button.jsx';
import ProgressBar from './ProgressBar.jsx';
import StepItem from './StepItem.jsx';
import StepProblem from './StepProblem.jsx';
import StepPriorities from './StepPriorities.jsx';
import StepResults from './StepResults.jsx';

export default function Wizard() {
  const { state, dispatch, currentCategory, scoreResult } = useAppContext();
  const { step, item, problem, priorities, skillLevel } = state;
  const isUnwanted = item.intent === 'unwanted';

  // Navigation handlers
  const handleNext = () => {
    if (step === 1) {
      // If unwanted, skip Step 2 and jump straight to Step 3
      dispatch({ type: 'SET_STEP', payload: isUnwanted ? 3 : 2 });
    } else if (step === 2) {
      dispatch({ type: 'SET_STEP', payload: 3 });
    } else if (step === 3) {
      dispatch({ type: 'SET_STEP', payload: 4 });
    }
  };

  const handleBack = () => {
    if (step === 2) {
      dispatch({ type: 'SET_STEP', payload: 1 });
    } else if (step === 3) {
      // If unwanted, jump back to Step 1
      dispatch({ type: 'SET_STEP', payload: isUnwanted ? 1 : 2 });
    } else if (step === 4) {
      dispatch({ type: 'SET_STEP', payload: 3 });
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  // Step 1 Validation: category selected and price > 0
  const isStep1Valid = Boolean(item.categoryId && Number(item.price) > 0);

  // Step 2 Validation (damaged): symptom and severity required
  const isStep2Valid = isUnwanted || Boolean(problem.symptomId && problem.severity);

  return (
    <Card className="max-w-2xl mx-auto shadow-md">
      <ProgressBar currentStep={step} intent={item.intent} />

      {step === 1 && (
        <div className="space-y-6">
          <StepItem
            item={item}
            onChange={(fields) => dispatch({ type: 'UPDATE_ITEM', payload: fields })}
          />
          <div className="flex justify-end pt-4 border-t border-line">
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!isStep1Valid}
              className="w-full sm:w-auto"
            >
              Continue →
            </Button>
          </div>
        </div>
      )}

      {step === 2 && !isUnwanted && (
        <div className="space-y-6">
          <StepProblem
            problem={problem}
            category={currentCategory}
            onChange={(fields) => dispatch({ type: 'UPDATE_PROBLEM', payload: fields })}
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-line">
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full sm:w-auto"
            >
              ← Back
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!isStep2Valid}
              className="w-full sm:w-auto"
            >
              Set Priorities →
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <StepPriorities
            priorities={priorities}
            skillLevel={skillLevel}
            onPrioritiesChange={(p) => dispatch({ type: 'UPDATE_PRIORITIES', payload: p })}
            onSkillLevelChange={(lvl) => dispatch({ type: 'SET_SKILL_LEVEL', payload: lvl })}
            onApplyPreset={(preset) => dispatch({ type: 'APPLY_PRESET', payload: preset })}
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-line">
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full sm:w-auto"
            >
              ← Back
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              className="w-full sm:w-auto"
            >
              Calculate Results →
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <StepResults
          results={scoreResult}
          onReset={handleReset}
          onBack={handleBack}
        />
      )}
    </Card>
  );
}
