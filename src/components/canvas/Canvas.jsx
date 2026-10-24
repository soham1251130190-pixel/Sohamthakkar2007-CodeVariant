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
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [guideDismissed, setGuideDismissed] = useState(false);
  const [ghostPosition, setGhostPosition] = useState(null);
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

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');
    const updatePointerType = () => setIsCoarsePointer(media.matches);
    updatePointerType();
    media.addEventListener('change', updatePointerType);
    return () => media.removeEventListener('change', updatePointerType);
  }, []);

  useEffect(() => {
    if (guideDismissed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let timer;
    const frame = window.requestAnimationFrame(() => {
      const source = document.querySelector('[data-card-id="item-charger"]');
      const target = document.querySelector('[data-zone-id="slot-item"]');
      if (!source || !target) return;
      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const halfChip = window.innerWidth <= 420 ? 36 : 44;
      setGhostPosition({
        startX: sourceRect.left + sourceRect.width / 2 - halfChip,
        startY: sourceRect.top + sourceRect.height / 2 - halfChip,
        endX: targetRect.left + targetRect.width / 2 - halfChip,
        endY: targetRect.top + targetRect.height / 2 - halfChip,
      });
      timer = window.setTimeout(() => setGhostPosition(null), 2500);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [guideDismissed]);

  const handleDragStart = ({ active }) => {
    setGuideDismissed(true);
    setGhostPosition(null);
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
    window.setTimeout(() => setSuccessZone(null), 380);
  };

  const handleDragCancel = () => {
    releaseTouchScrollBlock();
    setActiveCard(null);
  };

  return (
    <DndContext sensors={sensors} modifiers={[centreOverlayOnPointer]} collisionDetection={pointerFirstCollision} autoScroll onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="space-y-6">
        <Tray rejectedZone={rejectedZone} successZone={successZone} isDragging={Boolean(activeCard)} />
        <Workbench rejectedZone={rejectedZone} successZone={successZone} isCoarsePointer={isCoarsePointer} emphasizeHint={!guideDismissed} />
        <ScorePanel rejectedZone={rejectedZone} successZone={successZone} isDragging={Boolean(activeCard)} />
        <p className="sr-only" aria-live="polite" aria-atomic="true">{state.liveMessage}</p>
      </div>
      <DragOverlay dropAnimation={null}>{activeCard && <div className="drag-preview-chip drag-preview-chip-active"><div className="drag-preview-label"><span className="drag-preview-initial">{activeCard.preview.label[0]}</span><span className="drag-preview-text">{activeCard.preview.label}</span></div>{activeCard.preview.score !== null && <span className="drag-preview-score">{activeCard.preview.score}</span>}</div>}</DragOverlay>
      {ghostPosition && <div aria-hidden="true" className="drag-preview-chip first-visit-ghost" style={{ '--ghost-start-x': `${ghostPosition.startX}px`, '--ghost-start-y': `${ghostPosition.startY}px`, '--ghost-end-x': `${ghostPosition.endX}px`, '--ghost-end-y': `${ghostPosition.endY}px` }}><div className="drag-preview-label"><span className="drag-preview-initial">C</span><span className="drag-preview-text">Charger</span></div></div>}
    </DndContext>
  );
}
