import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, pointerWithin, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import { resolveAction } from '../../config/canvas.js';
import { useCanvasContext } from '../../state/useCanvasContext.js';
import { canScore } from '../../state/canvasReducer.js';
import { makeCanvasAction } from '../../engine/canvasActions.js';
import ScorePanel from './ScorePanel.jsx';
import Tray from './Tray.jsx';
import Workbench from './Workbench.jsx';
import { centreOverlayOnPointer, getDragPreview } from './dragPreview.js';

function pointerFirstCollision(args) {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
}

export default function Canvas() {
  const { state, dispatch, currentCategory } = useCanvasContext();
  const [activeCard, setActiveCard] = useState(null);
  const [rejectedZone, setRejectedZone] = useState(null);
  const [successZone, setSuccessZone] = useState(null);
  const [showIntroHint, setShowIntroHint] = useState(true);
  const dragging = useRef(false);
  const touchMoveBlocker = useRef(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const releaseTouchScrollBlock = () => {
    if (touchMoveBlocker.current) {
      window.removeEventListener('touchmove', touchMoveBlocker.current);
      touchMoveBlocker.current = null;
    }
    dragging.current = false;
  };

  useEffect(() => () => releaseTouchScrollBlock(), []);

  const handleDragStart = ({ active }) => {
    dragging.current = true;
    const preventPageScroll = (event) => {
      if (dragging.current) event.preventDefault();
    };
    touchMoveBlocker.current = preventPageScroll;
    window.addEventListener('touchmove', preventPageScroll, { passive: false });
    navigator.vibrate?.(10);
    setActiveCard({ id: active.id, ...active.data.current, preview: getDragPreview(active.data.current) });
    setRejectedZone(null);
    setSuccessZone(null);
  };

  const handleDragEnd = ({ active, over }) => {
    releaseTouchScrollBlock();
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
    dispatch(makeCanvasAction(action, card.payload, { itemName: currentCategory?.name ?? 'item', state }));
    setSuccessZone(over.id);
    setShowIntroHint(false);
    window.setTimeout(() => setSuccessZone(null), 380);
  };

  const handleDragCancel = () => {
    releaseTouchScrollBlock();
    setActiveCard(null);
  };

  return (
    <DndContext sensors={sensors} modifiers={[centreOverlayOnPointer]} collisionDetection={pointerFirstCollision} autoScroll onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="space-y-6">
        {showIntroHint && <p className="rounded-lg border border-forest/20 bg-mint px-3 py-2 text-sm font-medium text-forest">No buttons here. Drag cards into the zones.</p>}
        <Tray rejectedZone={rejectedZone} successZone={successZone} isDragging={Boolean(activeCard)} />
        <Workbench rejectedZone={rejectedZone} successZone={successZone} />
        <ScorePanel rejectedZone={rejectedZone} successZone={successZone} isDragging={Boolean(activeCard)} />
        <p className="sr-only" aria-live="polite" aria-atomic="true">{state.liveMessage}</p>
      </div>
      <DragOverlay dropAnimation={null}>{activeCard && <div className="drag-preview-chip drag-preview-chip-active"><div className="drag-preview-label"><span className="drag-preview-initial">{activeCard.preview.label[0]}</span><span className="drag-preview-text">{activeCard.preview.label}</span></div>{activeCard.preview.score !== null && <span className="drag-preview-score">{activeCard.preview.score}</span>}</div>}</DragOverlay>
    </DndContext>
  );
}
