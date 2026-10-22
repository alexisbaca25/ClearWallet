import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import type { UpcomingPayment, PaymentUrgency } from "@/types";

interface UpcomingPaymentsProps {
  payments: UpcomingPayment[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value);
}

function getDaysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(iso);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgency(days: number): PaymentUrgency {
  if (days <= 3) return "critical";
  if (days <= 7) return "warning";
  return "safe";
}

const urgencyStyles: Record<
  PaymentUrgency,
  { dot: string; badge: "expense" | "warning" | "info"; label: string }
> = {
  critical: { dot: "bg-rose-400 animate-pulse", badge: "expense", label: "Urgente" },
  warning:  { dot: "bg-amber-400",              badge: "warning", label: "Próximo" },
  safe:     { dot: "bg-emerald-400",            badge: "info",    label: "A tiempo" },
};

interface PaymentRowProps {
  payment: UpcomingPayment;
  isLast: boolean;
}

function PaymentRow({ payment, isLast }: PaymentRowProps) {
  const days = getDaysUntil(payment.dueDate);
  const urgency = getUrgency(days);
  const styles = urgencyStyles[urgency];

  return (
    <div className="flex gap-4">
      {/* Timeline column */}
      <div className="flex flex-col items-center">
        <div
          className={[
            "w-3 h-3 rounded-full flex-shrink-0 mt-1",
            styles.dot,
          ].join(" ")}
        />
        {!isLast && <div className="w-px flex-1 bg-white/10 mt-1" />}
      </div>

      {/* Content */}
      <div className={["pb-5", isLast ? "" : ""].join(" ")}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">{payment.icon}</span>
          <p className="text-white/85 text-sm font-medium">{payment.name}</p>
          <Badge label={styles.label} variant={styles.badge} />
        </div>

        {payment.cardName && (
          <p className="text-white/30 text-xs mb-1 font-mono">
            {payment.cardName}
          </p>
        )}

        <div className="flex items-center gap-3">
          <p className="text-white font-semibold text-sm">
            {formatCurrency(payment.amount)}
          </p>
          <p
            className={[
              "text-xs font-medium",
              urgency === "critical"
                ? "text-rose-400"
                : urgency === "warning"
                  ? "text-amber-400"
                  : "text-white/40",
            ].join(" ")}
          >
            {days === 0
              ? "¡Hoy!"
              : days === 1
                ? "Mañana"
                : `En ${days} días`}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Upcoming payments panel with a vertical timeline.
 * Urgency color-coded: red (≤3d), amber (≤7d), green (>7d).
 */
export default function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
  const sorted = [...payments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const totalDue = sorted.reduce((sum, p) => sum + p.amount, 0);

  return (
    <section className="animate-slide-up">
      <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
        Próximos Pagos
      </h2>

      <GlassCard>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/50 text-sm">Total comprometido</p>
          <p className="text-white font-bold text-lg">
            {formatCurrency(totalDue)}
          </p>
        </div>

        {/* Timeline */}
        {sorted.length === 0 ? (
          <div className="py-6 flex flex-col items-center gap-2 text-center">
            <span className="text-3xl">✅</span>
            <p className="text-white/30 text-sm">Sin pagos próximos</p>
            <p className="text-white/15 text-xs">
              Añade tarjetas de crédito para verlos aquí
            </p>
          </div>
        ) : (
          <div>
            {sorted.map((payment, index) => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                isLast={index === sorted.length - 1}
              />
            ))}
          </div>
        )}
      </GlassCard>
    </section>
  );
}
