import { useDndContext, useDroppable } from '@dnd-kit/core';
import { acceptedTypes } from '../../config/canvas.js';

export default function Zone({ id, label, hint, icon, rejected = false, success = false, disabled = false, action = false, hideHeading = false, children, className = '' }) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  const { active } = useDndContext();
  const activeType = active?.data.current?.type;
  const compatible = !disabled && activeType && acceptedTypes(id).includes(activeType);

  const stateClass = compatible && isOver
    ? 'border-forest bg-mint ring-2 ring-forest/20'
    : success
      ? 'animate-drop-success border-forest bg-mint'
    : rejected
      ? 'animate-shake border-amber bg-amber/10'
      : disabled
        ? 'border-forest/20 bg-mint/20 opacity-60'
        : 'border-dashed border-forest/45 bg-mint/20';

  return (
    <section ref={setNodeRef} aria-label={label} aria-disabled={disabled} tabIndex={disabled ? -1 : 0} className={`${action ? 'min-h-11 flex items-center gap-2 px-3 py-2' : 'min-h-24 p-3'} rounded-xl border-2 transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-forest ${stateClass} ${className}`}>
      {icon && <span aria-hidden="true" className="text-base leading-none text-forest">{icon}</span>}
      {!hideHeading && <h3 className="font-semibold text-sm text-forest">{label}</h3>}
      {hint && <p className={hideHeading || action ? 'sr-only' : 'mt-1 text-xs text-muted'}>{hint}</p>}
      <div className="mt-2">{children}</div>
    </section>
  );
}
