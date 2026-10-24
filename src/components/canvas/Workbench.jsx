import { safetyFlags } from '../../config/scoring.js';
import { useCanvasContext } from '../../state/useCanvasContext.js';
import DataCard from './DataCard.jsx';
import Zone from './Zone.jsx';

const titleize = (value) => value[0].toUpperCase() + value.slice(1);

function SlotCard({ type, payload, label, sublabel, variant }) {
  return <DataCard id={`slot-${type}-${payload}`} type={type} payload={payload} label={label} sublabel={sublabel} variant={variant} />;
}

export default function Workbench({ rejectedZone }) {
  const { state, dispatch, currentCategory } = useCanvasContext();
  const flagLabels = state.flags.map((id) => safetyFlags.find((flag) => flag.id === id)?.label).filter(Boolean);
  const presetLabel = state.presetKey === 'lowBudget' ? 'Low budget' : state.presetKey === 'ecoFirst' ? 'Eco first' : 'Urgent';

  return (
    <section className="space-y-3">
      <div><h2 className="text-xl font-bold text-forest">Workbench</h2><p className="text-sm text-muted">Build a card bundle, then drag it to Score it.</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Zone id="slot-item" label="1. Item" hint="Drop an item card here" rejected={rejectedZone === 'slot-item'}>
          {currentCategory && <SlotCard type="item" payload={currentCategory.id} label={currentCategory.name} variant="item" />}
        </Zone>
        <Zone id="slot-problem" label="2. Problem" hint="Drop a symptom card here" rejected={rejectedZone === 'slot-problem'}>
          {state.symptomId && <SlotCard type="symptom" payload={state.symptomId} label={titleize(state.symptomId)} variant="problem" />}
        </Zone>
        <Zone id="slot-severity" label="3. Severity" hint="Drop a severity card here" rejected={rejectedZone === 'slot-severity'}>
          {state.severity && <SlotCard type="severity" payload={state.severity} label={titleize(state.severity)} variant="severity" />}
        </Zone>
        <Zone id="slot-safety" label="4. Safety" hint="Drop applicable flags here" rejected={rejectedZone === 'slot-safety'}>
          <div className="space-y-2">{flagLabels.map((label, index) => <SlotCard key={label} type="flag" payload={state.flags[index]} label={label} variant="flag" />)}</div>
        </Zone>
        <Zone id="slot-priorities" label="5. Priorities" hint="Drop a priority card here" rejected={rejectedZone === 'slot-priorities'} className="sm:col-span-2">
          <SlotCard type="preset" payload={state.presetKey} label={presetLabel} sublabel="Your scoring weights" variant="preset" />
        </Zone>
      </div>
      {currentCategory && <label className="block text-sm font-semibold text-ink">Replacement price (₹)
        <input type="number" min="1" value={state.price} onChange={(event) => dispatch({ type: 'SET_PRICE', payload: event.target.value })}
          className="mt-1 block w-full rounded-lg border border-line px-3 py-2 text-ink" aria-label="Replacement price in rupees" />
      </label>}
      <DataCard id="bundle" type="bundle" payload={null} label="Your decision bundle"
        sublabel={currentCategory ? `${currentCategory.name} · ${state.symptomId ? titleize(state.symptomId) : 'problem not set'} · ${presetLabel}` : 'Start by adding an item'}
        variant="bundle" dimmed={!currentCategory} />
    </section>
  );
}
