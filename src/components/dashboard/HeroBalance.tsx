import GlassCard from "@/components/ui/GlassCard";
import type { DynamicBalance } from "@/types";

interface HeroBalanceProps {
  balance: DynamicBalance;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value);
}

interface StatRowProps {
  label: string;
  value: number;
  variant: "asset" | "liability";
}

function StatRow({ label, value, variant }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-white/40 text-xs">{label}</span>
      <span
        className={[
          "text-xs font-semibold",
          variant === "asset" ? "text-emerald-400" : "text-rose-400",
        ].join(" ")}
      >
        {variant === "asset" ? "+" : "−"}
        {formatCurrency(value)}
      </span>
    </div>
  );
}

/**
 * Hero panel — displays the total computed balance plus a breakdown
 * of assets (cash + receivables) vs liabilities (expenses + card debt + informal debts).
 * All values are reactive to parent state.
 */
export default function HeroBalance({ balance }: HeroBalanceProps) {
  const isPositive = balance.total >= 0;

  return (
    <GlassCard className="relative overflow-hidden animate-fade-in">
      {/* Background glow orbs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Label */}
        <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-2">
          Balance Total
        </p>

        {/* Main balance */}
        <h1
          className={[
            "text-5xl font-bold tracking-tight mb-3 transition-colors duration-500",
            isPositive ? "text-white" : "text-rose-300",
          ].join(" ")}
        >
          {formatCurrency(balance.total)}
        </h1>

        {/* Status indicator */}
        <div className="flex items-center gap-2 mb-6">
          <span
            className={[
              "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border",
              isPositive
                ? "text-emerald-300 bg-emerald-500/15 border-emerald-500/25"
                : "text-rose-300 bg-rose-500/15 border-rose-500/25",
            ].join(" ")}
          >
            {isPositive ? "▲ Balance positivo" : "▼ Balance negativo"}
          </span>
        </div>

        {/* Assets */}
        <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.05] mb-3">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-2 font-medium">
            Activos
          </p>
          <StatRow label="💵 Efectivo"      value={balance.cash}             variant="asset" />
          <StatRow label="🤝 Por cobrar"    value={balance.totalReceivables} variant="asset" />
        </div>

        {/* Liabilities */}
        <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.05]">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-2 font-medium">
            Pasivos
          </p>
          <StatRow label="💸 Gastos"         value={balance.totalExpenses}    variant="liability" />
          <StatRow label="💳 Deuda tarjetas" value={balance.totalCardDebt}    variant="liability" />
          <StatRow label="😬 Deudas informales" value={balance.totalInformalDebts} variant="liability" />
        </div>
      </div>
    </GlassCard>
  );
}
