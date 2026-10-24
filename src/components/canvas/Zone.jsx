import { useDndContext, useDroppable } from '@dnd-kit/core';
import { acceptedTypes } from '../../config/canvas.js';

export default function Zone({ id, label, hint, rejected = false, children, className = '' }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { active } = useDndContext();
  const activeType = active?.data.current?.type;
  const compatible = activeType && acceptedTypes(id).includes(activeType);

  const stateClass = compatible && isOver
    ? 'border-forest bg-mint ring-2 ring-forest/20'
    : rejected
      ? 'animate-shake border-coral bg-coral/5'
      : 'border-dashed border-line bg-white';

  return (
    <section ref={setNodeRef} aria-label={label} className={`min-h-24 rounded-xl border-2 p-3 transition ${stateClass} ${className}`}>
      <h3 className="font-semibold text-sm text-forest">{label}</h3>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <div className="mt-2">{children}</div>
    </section>
  );
}
