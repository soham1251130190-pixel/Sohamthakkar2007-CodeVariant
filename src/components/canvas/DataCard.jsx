import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

/**
 * A draggable data card implemented as a div with drag semantics.
 *
 * Props:
 *   id       — unique draggable ID
 *   type     — card type (item | symptom | severity | flag | preset | skill | bundle | option | ruled)
 *   payload  — arbitrary data passed to drop handler
 *   label    — primary text
 *   sublabel — secondary text
 *   badge    — optional badge element
 *   dimmed   — reduce opacity (already placed)
 *   variant  — 'item' | 'problem' | 'severity' | 'flag' | 'preset' | 'bundle' | 'option' | 'default'
 *   className — extra classes
 *   children — optional inner content override
 */
export default function DataCard({
  id,
  type,
  payload,
  label,
  sublabel,
  badge,
  dimmed = false,
  variant = 'default',
  className = '',
  children,
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type, payload },
    disabled: dimmed,
  });

  const translated = CSS.Translate.toString(transform);
  const safeTransform = !isDragging && translated?.startsWith('translate3d') ? translated : undefined;
  const style = {
    transform: safeTransform,
    touchAction: 'auto',
    opacity: isDragging ? 0.4 : dimmed ? 0.45 : 1,
    cursor: 'auto',
  };

  const variantStyles = {
    item:    'border-forest/40 bg-mint/30 text-ink hover:border-forest hover:bg-mint/60',
    problem: 'border-forest/40 bg-mint/30 text-ink hover:border-forest hover:bg-mint/60',
    severity:'border-forest/30 bg-mint/20 text-ink hover:border-forest',
    flag:    'border-forest/40 bg-mint/30 text-ink hover:border-forest hover:bg-mint/60',
    preset:  'border-forest bg-forest text-white hover:bg-forest/90',
    bundle:  'border-forest bg-forest text-white shadow-md',
    option:  'border-forest/25 bg-mint/20 text-ink hover:shadow-sm',
    default: 'border-forest/25 bg-mint/20 text-ink hover:border-forest',
  };

  const base = variantStyles[variant] ?? variantStyles.default;

  return (
    <div
      ref={setNodeRef}
      style={style}
      aria-grabbed={isDragging}
      className={`relative rounded-xl border px-3 py-2.5 pr-14 text-sm transition-colors ${isDragging ? 'border-dashed' : ''} ${base} ${className}`}
    >
      {children ?? (
        <>
          <div className="font-semibold leading-tight">{label}</div>
          {sublabel && (
            <div className="text-[11px] mt-0.5 opacity-70 leading-tight">{sublabel}</div>
          )}
          {badge && <div className="absolute top-1.5 right-1.5">{badge}</div>}
        </>
      )}
      <span
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        aria-label="Drag card"
        tabIndex={0}
        style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
        className="absolute right-1 top-1/2 inline-grid h-11 w-11 -translate-y-1/2 cursor-grab touch-none select-none place-items-center rounded-lg bg-amber/25 text-lg font-bold text-forest transition-colors hover:bg-amber/40 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-forest active:cursor-grabbing"
      >
        <span aria-hidden="true">⠿</span>
      </span>
    </div>
  );
}

