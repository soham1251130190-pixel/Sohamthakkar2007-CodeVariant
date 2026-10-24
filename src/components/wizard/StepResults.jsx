import { optionTemplates } from '../../data/templates.js';
import Button from '../Button.jsx';

export default function StepResults({ results, onReset, onBack }) {
  if (!results) {
    return (
      <div className="text-center py-8">
        <p className="text-muted">Calculating recommendations...</p>
      </div>
    );
  }

  const { options, notices, removed, confidence, gap } = results;

  const confidenceBadge = {
    clear: { label: 'Clear Winner', style: 'bg-forest text-white' },
    close: { label: 'Close Call', style: 'bg-amber text-ink' },
    'toss-up': { label: 'Toss-up', style: 'bg-muted text-white' },
  }[confidence] || { label: confidence, style: 'bg-muted text-white' };

  return (
    <div className="space-y-6">
      {/* Header and Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-forest">
            Evaluation Results
          </h2>
          <p className="text-sm text-muted mt-0.5">
            Ranked paths based on your item, condition, and weighted priorities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Confidence:</span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${confidenceBadge.style}`}
          >
            {confidenceBadge.label} {gap > 0 ? `(gap ${gap})` : ''}
          </span>
        </div>
      </div>

      {/* 1. Notices first: Safety in coral, Poor value as note */}
      {notices && notices.length > 0 && (
        <div className="space-y-2.5">
          {notices.map((notice, idx) => {
            const isSafety = notice.type === 'safety';
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  isSafety
                    ? 'border-coral bg-coral/10 text-coral'
                    : 'border-amber/40 bg-amber/10 text-ink'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base">{isSafety ? '⚠️' : 'ℹ️'}</span>
                  <div>
                    <h3 className="font-bold text-sm">
                      {isSafety ? 'Safety Restriction Active' : 'Value Advisory'}
                    </h3>
                    <p className="text-xs sm:text-sm mt-0.5">{notice.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Ranked Options List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
          Ranked Options ({options.length} Available)
        </h3>

        {options.map((opt, index) => {
          const tmpl = optionTemplates[opt.id] || { label: opt.id, tagline: '' };
          const isTop = index === 0;
          const isPoorValue = opt.flags?.includes('poorValue');

          return (
            <div
              key={opt.id}
              className={`p-4 rounded-xl border transition-all ${
                isTop
                  ? 'border-forest bg-forest/5 shadow-sm'
                  : 'border-line bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isTop
                        ? 'bg-forest text-white'
                        : 'bg-mint text-forest border border-line'
                    }`}
                  >
                    #{index + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-ink capitalize">
                        {tmpl.label}
                      </h4>
                      {isTop && (
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-forest/15 text-forest px-2 py-0.5 rounded-full">
                          Top Pick
                        </span>
                      )}
                      {isPoorValue && (
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-amber text-ink px-2 py-0.5 rounded-full">
                          Poor Value
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">{tmpl.tagline}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-xl text-lg font-bold ${
                      isTop ? 'bg-amber text-ink' : 'bg-mint text-ink'
                    }`}
                  >
                    {opt.score}
                  </span>
                  <span className="block text-[10px] text-muted uppercase tracking-wider mt-0.5">
                    Score
                  </span>
                </div>
              </div>

              {/* Criteria snapshot */}
              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-line/60 text-center text-xs">
                <div>
                  <span className="block text-muted text-[10px] uppercase">Cost</span>
                  <span className="font-semibold text-ink">{opt.criteria.cost}</span>
                </div>
                <div>
                  <span className="block text-muted text-[10px] uppercase">Effort</span>
                  <span className="font-semibold text-ink">{opt.criteria.effort}</span>
                </div>
                <div>
                  <span className="block text-muted text-[10px] uppercase">Eco</span>
                  <span className="font-semibold text-ink">{opt.criteria.eco}</span>
                </div>
                <div>
                  <span className="block text-muted text-[10px] uppercase">Solves</span>
                  <span className="font-semibold text-ink">{opt.criteria.solves}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Removed options disclosure if any */}
      {removed && removed.length > 0 && (
        <div className="pt-2 border-t border-line text-xs text-muted">
          <p className="font-semibold text-ink mb-1">Excluded Options:</p>
          <ul className="list-disc pl-5 space-y-0.5">
            {removed.map((r, i) => (
              <li key={i}>
                <strong className="capitalize">{r.id}:</strong> {r.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-line">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          ← Back to Priorities
        </Button>
        <Button variant="accent" onClick={onReset} className="w-full sm:w-auto">
          Start Over
        </Button>
      </div>
    </div>
  );
}
