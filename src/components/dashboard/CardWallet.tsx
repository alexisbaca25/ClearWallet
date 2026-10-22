import type { WalletCard } from "@/types";

interface CardWalletProps {
  cards: WalletCard[];
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

function NetworkLogo({ network }: { network: WalletCard["network"] }) {
  if (network === "visa") {
    return (
      <span className="text-white font-bold italic text-lg tracking-tight">
        VISA
      </span>
    );
  }
  if (network === "mastercard") {
    return (
      <div className="flex items-center -space-x-2">
        <div className="w-6 h-6 rounded-full bg-red-500/80" />
        <div className="w-6 h-6 rounded-full bg-amber-400/80" />
      </div>
    );
  }
  return <span className="text-white font-bold text-sm">AMEX</span>;
}

/**
 * Displays wallet cards in a responsive grid.
 * Each card has a gradient background, network logo, masked number,
 * balance, cut-off date and payment due.
 */
function SingleCard({ card }: { card: WalletCard }) {
  const isCredit = card.type === "credit";
  const usagePercent =
    isCredit && card.creditLimit
      ? Math.min(
          100,
          Math.round((Math.abs(card.balance) / card.creditLimit) * 100)
        )
      : 0;

  return (
    <div
      className={[
        "relative rounded-2xl p-5 overflow-hidden",
        "bg-gradient-to-br",
        card.color,
        "border border-white/15 backdrop-blur-xl",
        "transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl",
        "shadow-lg shadow-black/30",
      ].join(" ")}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-white/50 text-xs uppercase tracking-widest">
            {card.type}
          </p>
          <p className="text-white font-semibold text-sm mt-0.5">{card.name}</p>
        </div>
        <NetworkLogo network={card.network} />
      </div>

      {/* Card number */}
      <p className="text-white/70 font-mono text-sm tracking-[0.25em] mb-5">
        •••• •••• •••• {card.lastFour}
      </p>

      {/* Balance */}
      <p className="text-white text-2xl font-bold mb-1">
        {isCredit ? "−" : ""}
        {formatCurrency(card.balance)}
      </p>
      <p className="text-white/40 text-xs mb-4">
        {isCredit ? "Saldo utilizado" : "Saldo disponible"}
      </p>

      {/* Credit usage bar */}
      {isCredit && card.creditLimit && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Límite: {formatCurrency(card.creditLimit)}</span>
            <span>{usagePercent}% usado</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={[
                "h-full rounded-full transition-all duration-700",
                usagePercent > 80
                  ? "bg-rose-400"
                  : usagePercent > 50
                    ? "bg-amber-400"
                    : "bg-emerald-400",
              ].join(" ")}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-white/10 pt-3">
        <div>
          <p className="text-white/30 text-xs">Corte</p>
          <p className="text-white/80 text-xs font-medium">
            {formatDate(card.cutoffDate)}
          </p>
        </div>
        {isCredit && card.paymentDue > 0 && (
          <div className="text-right">
            <p className="text-white/30 text-xs">A pagar</p>
            <p className="text-amber-300 text-xs font-semibold">
              {formatCurrency(card.paymentDue)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Card wallet section — renders a responsive grid of wallet cards.
 */
export default function CardWallet({ cards }: CardWalletProps) {
  return (
    <section className="animate-slide-up">
      <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
        Mis Tarjetas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <SingleCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
