import items from '../../data/items.json';
import { presets, safetyFlags, severity } from '../../config/scoring.js';
import { useCanvasContext } from '../../state/useCanvasContext.js';
import DataCard from './DataCard.jsx';
import Zone from './Zone.jsx';

const titleize = (value) => value[0].toUpperCase() + value.slice(1);

export default function Tray({ rejectedZone }) {
  const { state, currentCategory } = useCanvasContext();
  const selectedItem = Boolean(state.itemId);
  const selectedSymptom = Boolean(state.symptomId);

  return (
    <Zone id="tray" label="Card tray" hint="Drag cards into matching workbench slots." rejected={rejectedZone === 'tray'}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <DataCard key={item.id} id={`item-${item.id}`} type="item" payload={item.id}
            label={item.name} sublabel={`New: ₹${item.replacePrice.toLocaleString('en-IN')}`}
            variant="item" dimmed={state.itemId === item.id} />
        ))}
      </div>

      {selectedItem && (
        <div className="mt-4 space-y-3 border-t border-line pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">What is the problem?</p>
          <DataCard id="unwanted" type="unwanted" payload="unwanted" label="Unwanted item"
            sublabel="There is no fault to fix; find its next use instead." variant="problem"
            dimmed={state.intent === 'unwanted'} />
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(currentCategory.symptoms).map(([id]) => (
              <DataCard key={id} id={`symptom-${id}`} type="symptom" payload={id}
                label={titleize(id)} variant="problem" dimmed={state.symptomId === id || state.intent === 'unwanted'} />
            ))}
          </div>
          {selectedSymptom && state.intent !== 'unwanted' && (
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(severity.fixability).map((id) => (
                <DataCard key={id} id={`severity-${id}`} type="severity" payload={id}
                  label={titleize(id)} variant="severity" dimmed={state.severity === id} />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedItem && (
        <div className="mt-4 space-y-3 border-t border-line pt-3">
          {currentCategory.applicableFlags.length > 0 && <>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Safety flags</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {safetyFlags.filter((flag) => currentCategory.applicableFlags.includes(flag.id)).map((flag) => (
                <DataCard key={flag.id} id={`flag-${flag.id}`} type="flag" payload={flag.id}
                  label={flag.label} sublabel={flag.warning} variant="flag"
                  dimmed={state.flags.includes(flag.id)} />
              ))}
            </div>
          </>}
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Priorities</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {Object.keys(presets).map((id) => (
              <DataCard key={id} id={`preset-${id}`} type="preset" payload={id}
                label={id === 'lowBudget' ? 'Low budget' : id === 'ecoFirst' ? 'Eco first' : 'Urgent'}
                variant="preset" dimmed={state.presetKey === id} />
            ))}
          </div>
        </div>
      )}
    </Zone>
  );
}
