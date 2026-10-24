import { presets, skillLevels } from '../../config/scoring.js';

export default function StepPriorities({
  priorities,
  skillLevel,
  onPrioritiesChange,
  onSkillLevelChange,
  onApplyPreset,
}) {
  const handleSliderChange = (field, value) => {
    onPrioritiesChange({ [field]: Number(value) });
  };

  const isLowBudgetActive =
    priorities.budget === presets.lowBudget.budget &&
    priorities.time === presets.lowBudget.time &&
    priorities.eco === presets.lowBudget.eco &&
    priorities.solves === presets.lowBudget.solves;

  const isUrgentActive =
    priorities.budget === presets.urgent.budget &&
    priorities.time === presets.urgent.time &&
    priorities.eco === presets.urgent.eco &&
    priorities.solves === presets.urgent.solves;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-forest mb-1">
          Set your priorities &amp; skill level
        </h2>
        <p className="text-sm text-muted">
          Adjust the weights below to tailor recommendations to your budget, timeline, and DIY comfort.
        </p>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">
          Quick Priority Presets
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onApplyPreset(presets.lowBudget)}
            className={`min-h-[44px] p-3 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center justify-center ${
              isLowBudgetActive
                ? 'border-forest bg-forest text-white shadow-sm'
                : 'border-line bg-white hover:bg-mint/40 text-ink'
            }`}
          >
            <span className="font-semibold text-sm">💰 Low Budget</span>
            <span className={`text-xs mt-0.5 ${isLowBudgetActive ? 'text-white/80' : 'text-muted'}`}>
              High cost focus (70/40/40/50)
            </span>
          </button>

          <button
            type="button"
            onClick={() => onApplyPreset(presets.urgent)}
            className={`min-h-[44px] p-3 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center justify-center ${
              isUrgentActive
                ? 'border-forest bg-forest text-white shadow-sm'
                : 'border-line bg-white hover:bg-mint/40 text-ink'
            }`}
          >
            <span className="font-semibold text-sm">⚡ Urgent</span>
            <span className={`text-xs mt-0.5 ${isUrgentActive ? 'text-white/80' : 'text-muted'}`}>
              Speed &amp; complete fix (20/60/20/100)
            </span>
          </button>
        </div>
      </div>

      {/* Sliders for priorities */}
      <div className="space-y-4 pt-2 border-t border-line">
        {/* Budget Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="budget-slider" className="text-sm font-semibold text-ink">
              Budget Priority (Low cost preference)
            </label>
            <span className="text-sm font-bold text-forest">{priorities.budget}%</span>
          </div>
          <input
            id="budget-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            value={priorities.budget}
            onChange={(e) => handleSliderChange('budget', e.target.value)}
            className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-forest"
          />
          <div className="flex justify-between text-[11px] text-muted mt-0.5">
            <span>Money is no object (0%)</span>
            <span>Must be cheap (100%)</span>
          </div>
        </div>

        {/* Time Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="time-slider" className="text-sm font-semibold text-ink">
              Time &amp; Effort Priority (Quick resolution)
            </label>
            <span className="text-sm font-bold text-forest">{priorities.time}%</span>
          </div>
          <input
            id="time-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            value={priorities.time}
            onChange={(e) => handleSliderChange('time', e.target.value)}
            className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-forest"
          />
          <div className="flex justify-between text-[11px] text-muted mt-0.5">
            <span>Happy to spend hours (0%)</span>
            <span>Needs to be quick (100%)</span>
          </div>
        </div>

        {/* Eco Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="eco-slider" className="text-sm font-semibold text-ink">
              Eco Priority (Environmental impact)
            </label>
            <span className="text-sm font-bold text-forest">{priorities.eco}%</span>
          </div>
          <input
            id="eco-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            value={priorities.eco}
            onChange={(e) => handleSliderChange('eco', e.target.value)}
            className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-forest"
          />
          <div className="flex justify-between text-[11px] text-muted mt-0.5">
            <span>Not a priority (0%)</span>
            <span>Maximum sustainability (100%)</span>
          </div>
        </div>

        {/* Solves Weight (Configurable & Explicitly Documented Default) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <label htmlFor="solves-slider" className="text-sm font-semibold text-ink block">
                Effectiveness / Problem Resolution (Solves)
              </label>
              <span className="text-xs text-muted">
                Documented default: 50% (Low Budget preset) or 100% (Urgent preset)
              </span>
            </div>
            <span className="text-sm font-bold text-forest">{priorities.solves}%</span>
          </div>
          <input
            id="solves-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            value={priorities.solves}
            onChange={(e) => handleSliderChange('solves', e.target.value)}
            className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-forest"
          />
          <div className="flex justify-between text-[11px] text-muted mt-0.5">
            <span>Accept partial fixes (0%)</span>
            <span>Must fully restore (100%)</span>
          </div>
        </div>
      </div>

      {/* Skill Level Select */}
      <div className="pt-2 border-t border-line">
        <label htmlFor="skill-select" className="block text-sm font-semibold text-ink mb-1.5">
          Your DIY Skill Level
        </label>
        <select
          id="skill-select"
          value={skillLevel}
          onChange={(e) => onSkillLevelChange(e.target.value)}
          className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-line bg-white text-ink text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-forest cursor-pointer"
        >
          {Object.keys(skillLevels).map((levelKey) => (
            <option key={levelKey} value={levelKey}>
              {levelKey.charAt(0).toUpperCase() + levelKey.slice(1)} (
              {levelKey === 'beginner'
                ? 'Minimal tools & experience'
                : levelKey === 'comfortable'
                ? 'Basic tools, screwdrivers, confident with simple repairs'
                : 'Advanced tools, soldering, complex assembly'}
              )
            </option>
          ))}
        </select>
        <p className="text-xs text-muted mt-1">
          Affects the effort score for repairs requiring technical skill.
        </p>
      </div>
    </div>
  );
}
