interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
  accent?: "violet" | "aqua";
}

export function MetricCard({
  label,
  value,
  hint,
  accent = "violet"
}: MetricCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-offwhite/10 bg-charcoal-900/60 p-7 backdrop-blur-xl transition-colors duration-300 hover:border-offwhite/20">
      <div
        aria-hidden
        className={`absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100 ${
          accent === "aqua"
            ? "bg-aqua/15 opacity-60"
            : "bg-violet/20 opacity-60"
        }`}
      />
      <p className="relative text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
        {label}
      </p>
      <p className="relative mt-5 text-4xl font-semibold tracking-tighter text-offwhite">
        {value}
      </p>
      <p className="relative mt-3 text-sm leading-relaxed text-offwhite-muted">
        {hint}
      </p>
    </article>
  );
}
