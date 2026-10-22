import GlassCard from "@/components/ui/GlassCard";
import type { Transaction } from "@/types";

interface CashFlowProps {
  transactions: Transaction[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(Math.abs(value));
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
  }).format(new Date(iso));
}

interface TransactionRowProps {
  transaction: Transaction;
  type: "income" | "expense";
}

function TransactionRow({ transaction, type }: TransactionRowProps) {
  const isIncome = type === "income";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.05] last:border-none group">
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-white/[0.10] transition-colors">
        {transaction.icon}
      </div>

      {/* Description + date */}
      <div className="flex-1 min-w-0">
        <p className="text-white/85 text-sm font-medium truncate">
          {transaction.description}
        </p>
        <p className="text-white/30 text-xs">{formatDate(transaction.date)}</p>
      </div>

      {/* Amount */}
      <p
        className={[
          "text-sm font-semibold flex-shrink-0",
          isIncome ? "text-emerald-400" : "text-rose-400",
        ].join(" ")}
      >
        {isIncome ? "+" : "−"}
        {formatCurrency(transaction.amount)}
      </p>
    </div>
  );
}

/**
 * Cash flow section split into two columns:
 * recent incomes (left) and recent expenses (right).
 */
export default function CashFlow({ transactions }: CashFlowProps) {
  const incomes = transactions.filter((t) => t.amount > 0);
  const expenses = transactions.filter((t) => t.amount < 0);

  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <section className="animate-slide-up">
      <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
        Flujo de Efectivo
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Incomes */}
        <GlassCard padding="sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-white/80 text-sm font-semibold">
                Ingresos recientes
              </h3>
            </div>
            <span className="text-emerald-400 text-sm font-bold">
              +
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 0,
              }).format(totalIncome)}
            </span>
          </div>
          <div>
            {incomes.map((t) => (
              <TransactionRow key={t.id} transaction={t} type="income" />
            ))}
          </div>
        </GlassCard>

        {/* Expenses */}
        <GlassCard padding="sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <h3 className="text-white/80 text-sm font-semibold">
                Egresos recientes
              </h3>
            </div>
            <span className="text-rose-400 text-sm font-bold">
              −
              {new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 0,
              }).format(totalExpenses)}
            </span>
          </div>
          <div>
            {expenses.map((t) => (
              <TransactionRow key={t.id} transaction={t} type="expense" />
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
