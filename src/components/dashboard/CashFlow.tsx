import GlassCard from "@/components/ui/GlassCard";
import type { InformalDebt, Receivable, Transaction } from "@/types";

interface CashFlowProps {
  transactions: Transaction[];
  receivables: Receivable[];
  informalDebts: InformalDebt[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(Math.abs(value));
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short" }).format(
    new Date(iso + "T12:00:00")
  );
}

// ─── Row components ───────────────────────────────────────────────────────────

function TransactionRow({ t }: { t: Transaction }) {
  const isIncome = t.amount > 0;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-none group">
      <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-base flex-shrink-0 group-hover:bg-white/10 transition-colors">
        {t.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/85 text-sm font-medium truncate">{t.description}</p>
        <p className="text-white/25 text-xs">{formatDate(t.date)}</p>
      </div>
      <p className={["text-sm font-semibold", isIncome ? "text-emerald-400" : "text-rose-400"].join(" ")}>
        {isIncome ? "+" : "−"}
        {formatCurrency(t.amount)}
      </p>
    </div>
  );
}

function ReceivableRow({ r }: { r: Receivable }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-none group">
      <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-base flex-shrink-0">
        🤝
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/85 text-sm font-medium truncate">{r.person}</p>
        <p className="text-sky-400/60 text-xs">Por cobrar · {formatDate(r.date)}</p>
      </div>
      <p className="text-sky-400 text-sm font-semibold">+{formatCurrency(r.amount)}</p>
    </div>
  );
}

function InformalDebtRow({ d }: { d: InformalDebt }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-none group">
      <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-base flex-shrink-0">
        😬
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/85 text-sm font-medium truncate">{d.person}</p>
        <p className="text-amber-400/60 text-xs">Le debo · {formatDate(d.date)}</p>
      </div>
      <p className="text-amber-400 text-sm font-semibold">−{formatCurrency(d.amount)}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-8 flex flex-col items-center text-center">
      <p className="text-white/20 text-sm">{label}</p>
    </div>
  );
}

/**
 * Cash flow panel split into two columns:
 * Left  → Ingresos (income transactions + receivables)
 * Right → Egresos (expense transactions + informal debts)
 */
export default function CashFlow({
  transactions,
  receivables,
  informalDebts,
}: CashFlowProps) {
  const incomes  = transactions.filter((t) => t.amount > 0);
  const expenses = transactions.filter((t) => t.amount < 0);

  const totalIncome =
    incomes.reduce((s, t) => s + t.amount, 0) +
    receivables.reduce((s, r) => s + r.amount, 0);

  const totalExpenses =
    expenses.reduce((s, t) => s + Math.abs(t.amount), 0) +
    informalDebts.reduce((s, d) => s + d.amount, 0);

  const hasIncome  = incomes.length > 0 || receivables.length > 0;
  const hasExpense = expenses.length > 0 || informalDebts.length > 0;

  return (
    <section className="animate-slide-up">
      <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
        Flujo de Efectivo
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Ingresos & Activos ─────────────────────────────────────────── */}
        <GlassCard padding="sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-white/80 text-sm font-semibold">Ingresos & Activos</h3>
            </div>
            <span className="text-emerald-400 text-sm font-bold">
              +{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(totalIncome)}
            </span>
          </div>

          {!hasIncome ? (
            <EmptyState label="Sin ingresos registrados" />
          ) : (
            <>
              {incomes.map((t) => <TransactionRow key={t.id} t={t} />)}
              {receivables.map((r) => <ReceivableRow key={r.id} r={r} />)}
            </>
          )}
        </GlassCard>

        {/* ── Egresos & Pasivos ──────────────────────────────────────────── */}
        <GlassCard padding="sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <h3 className="text-white/80 text-sm font-semibold">Egresos & Pasivos</h3>
            </div>
            <span className="text-rose-400 text-sm font-bold">
              −{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(totalExpenses)}
            </span>
          </div>

          {!hasExpense ? (
            <EmptyState label="Sin egresos registrados" />
          ) : (
            <>
              {expenses.map((t) => <TransactionRow key={t.id} t={t} />)}
              {informalDebts.map((d) => <InformalDebtRow key={d.id} d={d} />)}
            </>
          )}
        </GlassCard>
      </div>
    </section>
  );
}
