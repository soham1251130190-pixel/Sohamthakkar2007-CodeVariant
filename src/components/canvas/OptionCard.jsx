import DataCard from './DataCard.jsx';

function ScoreBar({ label, value, compact = false }) {
  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      <div className="flex items-baseline justify-between gap-2 text-xs text-muted">
        <span>{label}</span><span>{value}{compact ? '' : ' / 100'}</span>
      </div>
      <div className={`overflow-hidden rounded-full bg-amber/20 ${compact ? 'h-1.5' : 'h-2.5'}`}>
        <div className="score-fill h-full rounded-full bg-amber" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function OptionCard({ option }) {
  return (
    <DataCard id={`option-${option.id}`} type="option" payload={option.payload} variant="option" className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase tracking-wide text-muted">Rank {option.rank}</p><h3 className="mt-0.5 text-lg font-bold text-forest">{option.label}</h3></div>
        {option.isBestMatch && <span className="rounded-full bg-forest px-2 py-1 text-xs font-semibold text-white">Best match</span>}
      </div>
      <p className="mt-1 text-sm text-muted">{option.tagline}</p>
      <div className="mt-4"><ScoreBar label="Score" value={option.score} /></div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        {option.criteria.map((criterion) => <ScoreBar key={criterion.id} label={criterion.label} value={criterion.score} compact />)}
      </div>
      {option.isBestMatch ? <div className="mt-4 rounded-lg bg-mint px-3 py-2 text-sm text-ink"><p className="font-semibold text-forest">Why this</p><ul className="mt-1 list-disc space-y-1 pl-4">{option.why.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>
        : <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-ink"><span className="font-semibold text-muted">Why not: </span>{option.whyNot}</div>}
    </DataCard>
  );
}
