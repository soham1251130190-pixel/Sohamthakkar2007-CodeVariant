import { useCanvasContext } from '../../state/useCanvasContext.js';
import Zone from './Zone.jsx';
import OptionCard from './OptionCard.jsx';
import PlanPanel from './PlanPanel.jsx';
import HistoryTray from './HistoryTray.jsx';

export default function ScorePanel({ rejectedZone }) {
  const { state, resultView, planView, historyView } = useCanvasContext();
  return (
    <section className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Zone id="score" label="Score it" hint="Drop your decision bundle here" rejected={rejectedZone === 'score'} className="border-amber bg-amber/10" />
        <Zone id="clear" label="Clear" hint="Drop the bundle here to start again" rejected={rejectedZone === 'clear'} />
      </div>
      {state.scored && resultView && <div aria-live="polite" className="space-y-4">
        {resultView.notices.map((notice) => <p key={notice.type} className={notice.type === 'safety' ? 'rounded-xl border border-coral bg-coral/15 px-4 py-3 text-sm font-semibold text-ink' : 'rounded-xl border border-line bg-slate-50 px-4 py-3 text-sm text-muted'}>{notice.message}</p>)}
        {resultView.headline && <h2 className="text-2xl font-bold text-forest">{resultView.headline}</h2>}
        <ol className="space-y-3">{resultView.options.map((option) => <li key={option.id}><OptionCard option={option} /></li>)}</ol>
        {resultView.removed.length > 0 && <div className="flex flex-wrap gap-2" aria-label="Unavailable options">{resultView.removed.map((option) => <span key={option.id} className="rounded-full border border-line bg-slate-100 px-3 py-1.5 text-xs text-muted">{option.label}: not available, {option.reason}</span>)}</div>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Zone id="commit" label="Commit to plan" hint="Drop an option card here" rejected={rejectedZone === 'commit'} className="border-forest bg-mint/40" />
          <Zone id="save" label="Save for later" hint="Drop an option card here" rejected={rejectedZone === 'save'} />
        </div>
        {planView && <PlanPanel plan={planView} />}
        <HistoryTray entries={historyView} />
      </div>}
    </section>
  );
}
