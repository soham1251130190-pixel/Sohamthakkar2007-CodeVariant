import { useDndContext, useDroppable } from '@dnd-kit/core';
import { acceptedTypes } from '../../config/canvas.js';

export default function Zone({ id, label, hint, rejected = false, disabled = false, hideHeading = false, children, className = '' }) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  const { active } = useDndContext();
  const activeType = active?.data.current?.type;
  const compatible = !disabled && activeType && acceptedTypes(id).includes(activeType);

  const stateClass = compatible && isOver
    ? 'border-forest bg-mint ring-2 ring-forest/20'
    : rejected
      ? 'animate-shake border-coral bg-coral/5'
      : disabled
        ? 'border-line bg-slate-100 opacity-60'
        : 'border-dashed border-line bg-white';

  return (
    <section ref={setNodeRef} aria-label={label} className={`min-h-24 rounded-xl border-2 p-3 transition ${stateClass} ${className}`}>
      {!hideHeading && <h3 className="font-semibold text-sm text-forest">{label}</h3>}
      {hint && <p className={hideHeading ? 'sr-only' : 'mt-1 text-xs text-muted'}>{hint}</p>}
      <div className="mt-2">{children}</div>
    </section>
  );
}
