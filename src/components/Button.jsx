export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl min-h-[44px] min-w-[44px] px-5 py-2.5 text-base transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-forest text-white hover:bg-[#0c4a3e] active:bg-[#093930] focus-visible:ring-forest',
    accent:
      'bg-amber text-ink hover:bg-[#d99632] active:bg-[#ca8b29] focus-visible:ring-amber',
    outline:
      'border-2 border-forest text-forest bg-transparent hover:bg-forest/10 active:bg-forest/20 focus-visible:ring-forest',
  };

  const variantClass = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
