interface BadgeProps {
  label: string;
  variant?: "income" | "expense" | "warning" | "info";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  income:  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  expense: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  info:    "bg-sky-500/20 text-sky-300 border-sky-500/30",
};

/**
 * Small pill badge for transaction categories and urgency labels.
 */
export default function Badge({ label, variant = "info" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
      ].join(" ")}
    >
      {label}
    </span>
  );
}
