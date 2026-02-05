export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-[rgba(122,162,255,0.45)] disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-[linear-gradient(135deg,var(--sun),var(--flare))] text-slate-950 shadow-[0_18px_45px_rgba(255,107,107,0.35)] hover:-translate-y-0.5",
    outline:
      "border border-white/20 text-white/85 hover:border-white/40 hover:text-white",
    ghost:
      "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white",
    danger:
      "border border-rose-200/30 text-rose-100 hover:border-rose-200/60 hover:text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-3.5 text-base"
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
