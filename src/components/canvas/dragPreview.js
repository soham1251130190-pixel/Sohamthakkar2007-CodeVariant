import items from '../../data/items.json';
import { safetyFlags } from '../../config/scoring.js';
import { optionTemplates } from '../../data/templates.js';

const PRESET_LABELS = {
  lowBudget: 'Low budget',
  urgent: 'Urgent',
  ecoFirst: 'Eco first',
};

function titleize(value = '') {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : 'Card';
}

/** Returns the compact, presentation-only label used by the drag chip. */
export function getDragPreview(card) {
  const { type, payload } = card ?? {};
  if (type === 'item') {
    const name = items.find((item) => item.id === payload)?.name ?? titleize(payload);
    return { label: name.replace(' or cable', ''), score: null };
  }
  if (type === 'option') {
    return { label: optionTemplates[payload?.id]?.label ?? titleize(payload?.id), score: payload?.score ?? null };
  }
  if (type === 'flag') return { label: safetyFlags.find((flag) => flag.id === payload)?.label ?? titleize(payload), score: null };
  if (type === 'preset') return { label: PRESET_LABELS[payload] ?? titleize(payload), score: null };
  if (type === 'bundle') return { label: 'Bundle', score: null };
  if (type === 'unwanted') return { label: 'Unwanted', score: null };
  if (type === 'ruledOut') return { label: optionTemplates[payload]?.label ?? 'Ruled out', score: null };
  if (type === 'history') return { label: 'History', score: null };
  return { label: titleize(payload), score: null };
}

function getClientPoint(event) {
  const source = event?.nativeEvent ?? event;
  const touch = source?.touches?.[0] ?? source?.changedTouches?.[0];
  if (touch) return { x: touch.clientX, y: touch.clientY, isTouch: true };
  if (typeof source?.clientX === 'number' && typeof source?.clientY === 'number') {
    return { x: source.clientX, y: source.clientY, isTouch: false };
  }
  return null;
}

/** Centres the overlay on a pointer; keyboard drags retain DnD Kit's default geometry. */
export function centreOverlayOnPointer({ activatorEvent, activeNodeRect, transform }) {
  const point = getClientPoint(activatorEvent);
  if (!point || !activeNodeRect) return transform;
  const halfChip = window.innerWidth <= 420 ? 36 : 44;
  return {
    ...transform,
    x: transform.x + point.x - activeNodeRect.left - halfChip,
    y: transform.y + point.y - activeNodeRect.top - halfChip - (point.isTouch ? 40 : 0),
  };
}
