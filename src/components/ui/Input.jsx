import { useId } from "react";

export default function Input({
  label,
  helper,
  error,
  className = "",
  inputClassName = "",
  id,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-white/80"
        >
          {label}
        </label>
      )}
      <input
        id={fieldId}
        className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[rgba(122,162,255,0.45)] ${
          error
            ? "border-rose-200/60 focus:border-rose-200/70"
            : "border-white/15 focus:border-white/40"
        } ${inputClassName}`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-rose-200">{error}</p>
      ) : helper ? (
        <p className="text-xs text-white/50">{helper}</p>
      ) : null}
    </div>
  );
}
