import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Base primitive for all glass-effect panels in the dashboard.
 * Provides consistent backdrop-blur, border and background.
 */
export default function GlassCard({
  children,
  className = "",
  hoverable = false,
  padding = "md",
}: GlassCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/[0.07]",
        "backdrop-blur-xl shadow-xl shadow-black/20",
        hoverable &&
          "transition-all duration-300 hover:bg-white/[0.11] hover:border-white/20 hover:shadow-black/30 cursor-pointer",
        paddingMap[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
