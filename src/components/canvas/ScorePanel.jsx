import { useCanvasContext } from '../../state/useCanvasContext.js';
import Zone from './Zone.jsx';
import OptionCard from './OptionCard.jsx';
import PlanPanel from './PlanPanel.jsx';
import HistoryTray from './HistoryTray.jsx';
import DataCard from './DataCard.jsx';

export default function ScorePanel({ rejectedZone }) {
  const { state, resultView, ruledOutView, planView, historyView } = useCanvasContext();
  return (
    <section className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Zone id="score" label="Score it" hint="Drop your decision bundle here" rejected={rejectedZone === 'score'} className="border-amber bg-amber/10" />
        <Zone id="clear" label="Clear" hint="Drop the bundle here to start again" rejected={rejectedZone === 'clear'} />
      </div>
      {state.scored && resultView && <div aria-live="polite" className="space-y-4">
        <Zone id="results" label="Results" hint="Drop a ruled-out card here to restore it" rejected={rejectedZone === 'results'} hideHeading className="space-y-4 border-transparent bg-transparent p-0">
        {resultView.notices.map((notice) => <p key={notice.type} className={notice.type === 'safety' ? 'rounded-xl border border-coral bg-coral/15 px-4 py-3 text-sm font-semibold text-ink' : 'rounded-xl border border-line bg-slate-50 px-4 py-3 text-sm text-muted'}>{notice.message}</p>)}
        {resultView.headline && <h2 className="text-2xl font-bold text-forest">{resultView.headline}</h2>}
        <ol className="space-y-3">{resultView.options.map((option) => <li key={option.id}><OptionCard option={option} /></li>)}</ol>
        {resultView.removed.length > 0 && <div className="flex flex-wrap gap-2" aria-label="Unavailable options">{resultView.removed.map((option) => <span key={option.id} className="rounded-full border border-line bg-slate-100 px-3 py-1.5 text-xs text-muted">{option.label}: not available, {option.reason}</span>)}</div>}
        </Zone>
        <div className="grid gap-3 sm:grid-cols-2">
          <Zone id="commit" label="Commit to plan" hint="Drop an option card here" rejected={rejectedZone === 'commit'} className="border-forest bg-mint/40" />
          <Zone id="save" label="Save for later" hint="Drop an option card here" rejected={rejectedZone === 'save'} />
        </div>
        <Zone id="ruleOut" label="Rule out" hint={resultView.options.length > 1 ? 'Drop an option card here to remove it from the ranking' : 'Only one option remains'} rejected={rejectedZone === 'ruleOut'} disabled={resultView.options.length <= 1} />
        {ruledOutView.length > 0 && <section aria-label="Ruled out"><h2 className="text-lg font-bold text-forest">Ruled out</h2><div className="mt-2 flex flex-wrap gap-2">{ruledOutView.map((option) => <DataCard key={option.id} id={`ruled-out-${option.id}`} type="ruledOut" payload={option.id} label={`${option.label} ruled out`} sublabel="Drag to results to restore" variant="default" className="bg-slate-100 text-muted" />)}</div></section>}
        {planView && <PlanPanel plan={planView} />}
      </div>}
      <section className="space-y-3 border-t border-line pt-4" aria-label="History actions">
        <div className="grid gap-3 sm:grid-cols-2">
          <Zone id="reopen" label="Reopen" hint={historyView.length > 0 ? 'Drop a history card here to restore it' : 'No history cards yet'} rejected={rejectedZone === 'reopen'} disabled={historyView.length === 0} />
          <Zone id="delete" label="Delete" hint={historyView.length > 0 ? 'Drop a history card here to remove it' : 'No history cards yet'} rejected={rejectedZone === 'delete'} disabled={historyView.length === 0} />
        </div>
        <HistoryTray entries={historyView} />
      </section>
    </section>
  );
}
