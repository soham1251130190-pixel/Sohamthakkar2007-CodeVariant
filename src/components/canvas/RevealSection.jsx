import { Children, useEffect, useRef, useState } from 'react';

export function StaggeredCards({ animate, children, className = '' }) {
  return (
    <div className={className}>
      {Children.toArray(children).map((card, index) => (
        <div key={card.key ?? index} className={animate ? 'reveal-card' : ''} style={animate ? { '--reveal-delay': `${Math.min(index * 60, 360)}ms` } : undefined}>
          {card}
        </div>
      ))}
    </div>
  );
}

/** A once-per-key expanding stage that keeps card animation outside draggable nodes. */
export default function RevealSection({ revealKey, revealedKeys, isDragging, caption, children, className = '' }) {
  const wasRevealed = revealedKeys.current.has(revealKey);
  const [open, setOpen] = useState(wasRevealed);
  const [animate] = useState(!wasRevealed);
  const stageRef = useRef(null);

  useEffect(() => {
    if (wasRevealed || isDragging) return undefined;
    const frame = window.requestAnimationFrame(() => {
      revealedKeys.current.add(revealKey);
      setOpen(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isDragging, revealKey, revealedKeys, wasRevealed]);

  useEffect(() => {
    if (!open || !animate || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      stageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [animate, open]);

  return (
    <section ref={stageRef} className={`reveal-stage ${open ? 'is-open' : ''} ${animate ? 'is-new' : ''} ${className}`}>
      <div className="reveal-grid"><div className="reveal-inner"><div className="reveal-content">
        {caption && <p className={animate ? 'reveal-caption' : 'text-sm font-medium text-forest'}>{caption}</p>}
        {typeof children === 'function' ? children(animate) : children}
      </div></div></div>
    </section>
  );
}
