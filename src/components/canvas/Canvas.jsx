import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import { resolveAction } from '../../config/canvas.js';
import { useCanvasContext } from '../../state/useCanvasContext.js';
import { canScore } from '../../state/canvasReducer.js';
import { makeCanvasAction } from '../../engine/canvasActions.js';
import ScorePanel from './ScorePanel.jsx';
import Tray from './Tray.jsx';
import Workbench from './Workbench.jsx';

export default function Canvas() {
  const { state, dispatch, currentCategory } = useCanvasContext();
  const [activeCard, setActiveCard] = useState(null);
  const [rejectedZone, setRejectedZone] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = ({ active }) => {
    setActiveCard({ id: active.id, ...active.data.current });
    setRejectedZone(null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveCard(null);
    if (!over) return;
    const card = active.data.current;
    const action = resolveAction(card.type, over.id);
    if (!action) {
      setRejectedZone(over.id);
      window.setTimeout(() => setRejectedZone(null), 380);
      dispatch({ type: 'SET_LIVE_MSG', payload: `${card.type} cannot be dropped on this zone` });
      return;
    }
    if (action === 'SCORE' && !canScore(state)) {
      setRejectedZone(over.id);
      window.setTimeout(() => setRejectedZone(null), 380);
      dispatch({ type: 'SET_LIVE_MSG', payload: 'Add an item and a problem first' });
      return;
    }
    dispatch(makeCanvasAction(action, card.payload, { itemName: currentCategory?.name ?? 'item' }));
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveCard(null)}>
      <div className="space-y-6">
        <p className="rounded-lg bg-mint px-3 py-2 text-sm text-forest">Drag cards into the outlined zones. There are no click-to-act controls.</p>
        <Tray rejectedZone={rejectedZone} />
        <Workbench rejectedZone={rejectedZone} />
        <ScorePanel rejectedZone={rejectedZone} />
        <p className="sr-only" aria-live="polite" aria-atomic="true">{state.liveMessage}</p>
      </div>
      <DragOverlay>{activeCard && <div className="rounded-xl border border-forest bg-white px-3 py-2 text-sm font-semibold text-ink shadow-lg">Moving card</div>}</DragOverlay>
    </DndContext>
  );
}
