import DataCard from './DataCard.jsx';

export default function HistoryTray({ entries }) {
  return (
    <section aria-label="This session">
      <h2 className="text-lg font-bold text-forest">This session</h2>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {entries.map((entry) => <DataCard key={entry.id} id={`history-${entry.id}`} type="history" payload={entry.id}
          label={`${entry.optionLabel} · ${entry.score} / 100`} sublabel={`${entry.itemName} · ${entry.statusLabel} · ${entry.timeLabel}`} badge={<span className={`rounded-full px-2 py-0.5 text-[10px] ${entry.status === 'committed' ? 'bg-forest text-white' : 'bg-white text-muted'}`}>{entry.statusLabel}</span>} variant="default" className={`min-w-48 ${entry.status === 'committed' ? 'border-forest bg-mint/60 font-semibold' : 'bg-mint/20 text-muted opacity-80'}`} />)}
      </div>
    </section>
  );
}
