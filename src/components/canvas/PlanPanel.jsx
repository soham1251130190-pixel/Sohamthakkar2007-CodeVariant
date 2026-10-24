export default function PlanPanel({ plan }) {
  return (
    <section className="rounded-xl border border-forest/30 bg-mint/40 p-4" aria-label="Plan">
      <p className="text-xs font-semibold uppercase tracking-wide text-forest">Your plan</p>
      <h2 className="mt-1 text-2xl font-bold text-forest">{plan.label}</h2>
      <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink">
        {plan.nextSteps.map((step) => <li key={step}>{step}</li>)}
      </ol>
      <dl className="mt-4 grid gap-3 border-t border-forest/20 pt-4 text-sm sm:grid-cols-3">
        <div><dt className="font-semibold text-muted">Estimated cost</dt><dd className="mt-1 font-semibold text-ink">{plan.estimatedCost}</dd></div>
        <div><dt className="font-semibold text-muted">Estimated time</dt><dd className="mt-1 font-semibold text-ink">{plan.estimatedTime}</dd></div>
        <div><dt className="font-semibold text-muted">Where to go</dt><dd className="mt-1 text-ink">{plan.whereToGo}</dd></div>
      </dl>
      <p className="mt-4 rounded-lg bg-white/70 px-3 py-2 text-sm text-ink"><span className="font-semibold text-forest">Fallback: </span>{plan.fallback}</p>
    </section>
  );
}
