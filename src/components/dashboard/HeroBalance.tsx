import GlassCard from "@/components/ui/GlassCard";
import type { BalanceSummary } from "@/types";

interface HeroBalanceProps {
  summary: BalanceSummary;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Hero panel displaying the total consolidated balance,
 * daily change, monthly income and monthly expenses.
 */
export default function HeroBalance({ summary }: HeroBalanceProps) {
  const isPositive = summary.dailyChange >= 0;

  return (
    <GlassCard className="relative overflow-hidden animate-fade-in">
      {/* Background glow orb */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Label */}
        <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-2">
          Balance Total
        </p>

        {/* Main balance */}
        <h1 className="text-5xl font-bold text-white tracking-tight mb-3">
          {formatCurrency(summary.totalBalance)}
        </h1>

        {/* Daily change */}
        <div className="flex items-center gap-2 mb-8">
          <span
            className={[
              "flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full border",
              isPositive
                ? "text-emerald-300 bg-emerald-500/15 border-emerald-500/25"
                : "text-rose-300 bg-rose-500/15 border-rose-500/25",
            ].join(" ")}
          >
            <span>{isPositive ? "▲" : "▼"}</span>
            {isPositive ? "+" : ""}
            {formatCurrency(summary.dailyChange)} ({summary.dailyChangePercent}
            %)
          </span>
          <span className="text-white/30 text-xs">vs. ayer</span>
        </div>

        {/* Monthly stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.06]">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
              Ingresos del mes
            </p>
            <p className="text-emerald-400 text-xl font-semibold">
              {formatCurrency(summary.monthlyIncome)}
            </p>
          </div>
          <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.06]">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
              Egresos del mes
            </p>
            <p className="text-rose-400 text-xl font-semibold">
              {formatCurrency(summary.monthlyExpenses)}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
