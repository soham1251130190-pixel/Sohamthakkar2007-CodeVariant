import items from '../../data/items.json';
import { presets, safetyFlags, severity } from '../../config/scoring.js';
import { useRef } from 'react';
import { useCanvasContext } from '../../state/useCanvasContext.js';
import DataCard from './DataCard.jsx';
import RevealSection, { StaggeredCards } from './RevealSection.jsx';
import Zone from './Zone.jsx';

const titleize = (value) => value[0].toUpperCase() + value.slice(1);

export default function Tray({ rejectedZone, successZone, isDragging }) {
  const { state, currentCategory } = useCanvasContext();
  const revealedKeys = useRef(new Set());
  const selectedItem = Boolean(state.itemId);
  const selectedSymptom = Boolean(state.symptomId);

  return (
    <Zone id="tray" label="Card tray" hint="Drag cards into matching workbench slots." rejected={rejectedZone === 'tray'} success={successZone === 'tray'}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <DataCard key={item.id} id={`item-${item.id}`} type="item" payload={item.id}
            label={item.name} sublabel={`New: ₹${item.replacePrice.toLocaleString('en-IN')}`}
            variant="item" dimmed={state.itemId === item.id} />
        ))}
      </div>

      {selectedItem && <RevealSection key={`problem-${state.itemId}`} revealKey={`problem-${state.itemId}`} revealedKeys={revealedKeys} isDragging={isDragging} caption="Item set. Now drag a problem card into its slot." className="mt-4 border-t border-line pt-3">
        {(animate) => <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">What is the problem?</p>
          <StaggeredCards animate={animate} className="space-y-2">
            <DataCard id="unwanted" type="unwanted" payload="unwanted" label="Unwanted item"
              sublabel="There is no fault to fix; find its next use instead." variant="problem"
              dimmed={state.intent === 'unwanted'} />
          </StaggeredCards>
          <StaggeredCards animate={animate} className="grid gap-2 sm:grid-cols-2">
            {Object.entries(currentCategory.symptoms).map(([id]) => (
              <DataCard key={id} id={`symptom-${id}`} type="symptom" payload={id}
                label={titleize(id)} variant="problem" dimmed={state.symptomId === id || state.intent === 'unwanted'} />
            ))}
          </StaggeredCards>
        </div>}
      </RevealSection>}

      {selectedSymptom && state.intent !== 'unwanted' && <RevealSection key={`severity-${state.itemId}-${state.symptomId}`} revealKey={`severity-${state.itemId}-${state.symptomId}`} revealedKeys={revealedKeys} isDragging={isDragging} caption="Problem set. Now drag a severity card into its slot." className="mt-4 border-t border-line pt-3">
        {(animate) => <StaggeredCards animate={animate} className="grid grid-cols-3 gap-2">
          {Object.keys(severity.fixability).map((id) => (
            <DataCard key={id} id={`severity-${id}`} type="severity" payload={id}
              label={titleize(id)} variant="severity" dimmed={state.severity === id} />
          ))}
        </StaggeredCards>}
      </RevealSection>}

      {selectedItem && <RevealSection key={`choices-${state.itemId}`} revealKey={`choices-${state.itemId}`} revealedKeys={revealedKeys} isDragging={isDragging} caption="Drag safety flags or priorities into their matching slots." className="mt-4 border-t border-line pt-3">
        {(animate) => <div className="space-y-3">
          {currentCategory.applicableFlags.length > 0 && <>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Safety flags</p>
            <StaggeredCards animate={animate} className="grid gap-2 sm:grid-cols-2">
              {safetyFlags.filter((flag) => currentCategory.applicableFlags.includes(flag.id)).map((flag) => (
                <DataCard key={flag.id} id={`flag-${flag.id}`} type="flag" payload={flag.id}
                  label={flag.label} sublabel={flag.warning} variant="flag"
                  dimmed={state.flags.includes(flag.id)} />
              ))}
            </StaggeredCards>
          </>}
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Priorities</p>
          <StaggeredCards animate={animate} className="grid gap-2 sm:grid-cols-3">
            {Object.keys(presets).map((id) => (
              <DataCard key={id} id={`preset-${id}`} type="preset" payload={id}
                label={id === 'lowBudget' ? 'Low budget' : id === 'ecoFirst' ? 'Eco first' : 'Urgent'}
                variant="preset" dimmed={state.presetKey === id} />
            ))}
          </StaggeredCards>
        </div>}
      </RevealSection>}
    </Zone>
  );
}
