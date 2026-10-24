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
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type, payload },
    disabled: dimmed,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    touchAction: 'none',
    opacity: isDragging ? 0.35 : dimmed ? 0.45 : 1,
    cursor: dimmed ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 50 : undefined,
  };

  const variantStyles = {
    item:    'border-forest/40 bg-white text-ink hover:border-forest hover:bg-mint/30',
    problem: 'border-amber/40 bg-white text-ink hover:border-amber hover:bg-amber/5',
    severity:'border-line bg-white text-ink hover:border-forest',
    flag:    'border-coral/40 bg-white text-ink hover:border-coral hover:bg-coral/5',
    preset:  'border-forest bg-forest text-white hover:bg-forest/90',
    bundle:  'border-forest bg-forest text-white shadow-md',
    option:  'border-line bg-white text-ink hover:shadow-sm',
    default: 'border-line bg-white text-ink hover:border-muted',
  };

  const base = variantStyles[variant] ?? variantStyles.default;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      aria-grabbed={isDragging}
      className={`relative select-none rounded-xl border px-3 py-2.5 text-sm transition-colors ${base} ${className}`}
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
    </div>
  );
}

