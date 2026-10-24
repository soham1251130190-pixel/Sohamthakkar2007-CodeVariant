import { useCanvasContext } from '../../state/useCanvasContext.js';
import DataCard from './DataCard.jsx';
import Zone from './Zone.jsx';

export default function ScorePanel({ rejectedZone }) {
  const { state, scoreResult } = useCanvasContext();
  return (
    <section className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Zone id="score" label="Score it" hint="Drop your decision bundle here" rejected={rejectedZone === 'score'} className="border-amber bg-amber/10" />
        <Zone id="clear" label="Clear" hint="Drop the bundle here to start again" rejected={rejectedZone === 'clear'} />
      </div>
      {state.scored && scoreResult && <div aria-live="polite" className="rounded-xl border border-line bg-mint/30 p-4">
        <h2 className="text-xl font-bold text-forest">Current ranking</h2>
        <ol className="mt-3 space-y-2">
          {scoreResult.options.map((option, index) => <li key={option.id}>
            <DataCard id={`option-${option.id}`} type="option" payload={option} label={`${index + 1}. ${option.id[0].toUpperCase()}${option.id.slice(1)} — ${option.score} / 100`} variant="option" />
          </li>)}
        </ol>
      </div>}
    </section>
  );
}
