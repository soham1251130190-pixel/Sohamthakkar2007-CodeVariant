import { symptoms, safetyFlags } from '../../config/scoring.js';

export default function StepProblem({ problem, category, onChange }) {
  const applicableFlagsList = safetyFlags.filter((flag) =>
    (category.applicableFlags || []).includes(flag.id)
  );

  const handleSymptomSelect = (symptomId) => {
    onChange({ symptomId });
  };

  const handleSeveritySelect = (severity) => {
    onChange({ severity });
  };

  const handleFlagToggle = (flagId) => {
    const current = problem.flags || [];
    const next = current.includes(flagId)
      ? current.filter((f) => f !== flagId)
      : [...current, flagId];
    onChange({ flags: next });
  };

  const handleTextChange = (e) => {
    onChange({ text: e.target.value });
  };

  const hasFlagsSelected = (problem.flags || []).length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-forest mb-1">
          Describe the problem
        </h2>
        <p className="text-sm text-muted">
          Tell us what went wrong so we can evaluate repair feasibility and safety risks.
        </p>
      </div>

      {/* Symptom selection chips */}
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">
          Primary Symptom <span className="text-coral">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {symptoms.map((sym) => {
            const isSelected = problem.symptomId === sym.id;
            return (
              <button
                key={sym.id}
                type="button"
                onClick={() => handleSymptomSelect(sym.id)}
                className={`min-h-[44px] p-3 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-center ${
                  isSelected
                    ? 'border-forest bg-forest/10 ring-2 ring-forest'
                    : 'border-line bg-white hover:bg-mint/40'
                }`}
              >
                <span className="font-semibold text-sm text-ink">{sym.label}</span>
                <span className="text-xs text-muted mt-0.5">{sym.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Severity selection */}
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">
          Problem Severity <span className="text-coral">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'minor', label: 'Minor', desc: 'Slight flaw' },
            { id: 'moderate', label: 'Moderate', desc: 'Noticeable issue' },
            { id: 'severe', label: 'Severe', desc: 'Completely broken' },
          ].map((sev) => {
            const isSelected = problem.severity === sev.id;
            return (
              <button
                key={sev.id}
                type="button"
                onClick={() => handleSeveritySelect(sev.id)}
                className={`min-h-[44px] p-2.5 sm:p-3 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-forest bg-forest text-white shadow-sm'
                    : 'border-line bg-white hover:bg-mint/40 text-ink'
                }`}
              >
                <span className="font-semibold text-sm capitalize">{sev.label}</span>
                <span className={`text-[11px] hidden sm:block ${isSelected ? 'text-white/80' : 'text-muted'}`}>
                  {sev.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Flags (filtered to category applicable flags) */}
      {applicableFlagsList.length > 0 && (
        <div className="pt-2 border-t border-line">
          <label className="block text-sm font-semibold text-ink mb-2">
            Safety Hazards Check <span className="text-xs font-normal text-muted">(select all that apply)</span>
          </label>

          <div className="space-y-2">
            {applicableFlagsList.map((flag) => {
              const isChecked = (problem.flags || []).includes(flag.id);
              return (
                <label
                  key={flag.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    isChecked
                      ? 'border-coral bg-coral/10 ring-1 ring-coral'
                      : 'border-line bg-white hover:bg-coral/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleFlagToggle(flag.id)}
                    className="mt-0.5 w-4 h-4 rounded text-coral accent-coral cursor-pointer"
                  />
                  <div className="text-sm">
                    <span className="font-semibold text-ink block">{flag.label}</span>
                    <span className="text-xs text-muted mt-0.5 block">{flag.warning}</span>
                  </div>
                </label>
              );
            })}
          </div>

          {hasFlagsSelected && (
            <div className="mt-3 p-3 rounded-xl bg-coral/10 border border-coral text-coral text-xs sm:text-sm">
              <strong className="block font-bold">⚠️ Critical Safety Warning</strong>
              <p className="mt-0.5 text-ink">
                Because of the selected safety hazard, DIY repair, reuse, and repurpose options will be safely disabled. Only certified replacement and safe recycling drop-offs will be recommended.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Optional problem description */}
      <div className="pt-2 border-t border-line">
        <label htmlFor="problem-notes" className="block text-sm font-semibold text-ink mb-1.5">
          Additional Details <span className="text-xs font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="problem-notes"
          rows={3}
          value={problem.text || ''}
          onChange={handleTextChange}
          placeholder="e.g. Started malfunctioning after a drop, works intermittently when cable is bent..."
          className="w-full p-3 rounded-xl border border-line bg-white text-ink text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
        />
      </div>
    </div>
  );
}
