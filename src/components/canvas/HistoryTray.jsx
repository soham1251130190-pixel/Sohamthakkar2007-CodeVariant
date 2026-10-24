export default function HistoryTray({ entries }) {
  if (entries.length === 0) return null;
  return (
    <section aria-label="This session">
      <h2 className="text-lg font-bold text-forest">This session</h2>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {entries.map((entry) => <article key={entry.id} className="min-w-40 rounded-lg border border-line bg-white px-3 py-2 text-sm">
          <p className="font-semibold text-ink">{entry.optionLabel} · {entry.score} / 100</p>
          <p className="mt-1 text-xs text-muted">{entry.statusLabel} · {entry.timeLabel}</p>
        </article>)}
      </div>
    </section>
  );
}
