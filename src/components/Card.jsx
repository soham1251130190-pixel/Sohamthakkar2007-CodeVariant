export default function Card({
  children,
  className = '',
  ...props
}) {
  return (
    <div
      className={`bg-mint border border-line rounded-2xl p-5 sm:p-6 shadow-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
