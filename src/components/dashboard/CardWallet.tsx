import type { WalletCard } from "@/types";

interface CardWalletProps {
  cards: WalletCard[];
  onAddCard: () => void;
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
  }).format(new Date(iso + "T12:00:00")); // avoid timezone shift
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

function SingleCard({ card }: { card: WalletCard }) {
  const isCredit = card.type === "credit";
  const usagePercent =
    isCredit && card.creditLimit
      ? Math.min(100, Math.round((Math.abs(card.balance) / card.creditLimit) * 100))
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
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-white/50 text-xs uppercase tracking-widest">{card.type}</p>
          <p className="text-white font-semibold text-sm mt-0.5">{card.name}</p>
        </div>
        <NetworkLogo network={card.network} />
      </div>

      <p className="text-white/70 font-mono text-sm tracking-[0.25em] mb-5">
        •••• •••• •••• {card.lastFour}
      </p>

      <p className="text-white text-2xl font-bold mb-1">
        {isCredit ? "−" : ""}
        {formatCurrency(card.balance)}
      </p>
      <p className="text-white/40 text-xs mb-4">
        {isCredit ? "Saldo utilizado" : "Saldo disponible"}
      </p>

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
                usagePercent > 80 ? "bg-rose-400" : usagePercent > 50 ? "bg-amber-400" : "bg-emerald-400",
              ].join(" ")}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center border-t border-white/10 pt-3">
        <div>
          <p className="text-white/30 text-xs">Corte</p>
          <p className="text-white/80 text-xs font-medium">{formatDate(card.cutoffDate)}</p>
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
 * Card wallet section — shows the card grid plus an "Add Card" button.
 * When there are no cards, shows a prominent empty-state prompt.
 */
export default function CardWallet({ cards, onAddCard }: CardWalletProps) {
  return (
    <section className="animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest">
          Mis Tarjetas
        </h2>
        <button
          onClick={onAddCard}
          className="flex items-center gap-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 px-3 py-1.5 rounded-lg transition-all"
        >
          <span className="text-base leading-none">+</span>
          Añadir tarjeta
        </button>
      </div>

      {cards.length === 0 ? (
        /* Empty state */
        <button
          onClick={onAddCard}
          className="w-full rounded-2xl border-2 border-dashed border-white/10 hover:border-violet-500/40 bg-white/[0.02] hover:bg-violet-500/[0.05] transition-all duration-300 py-14 flex flex-col items-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-xl bg-white/[0.06] group-hover:bg-violet-500/15 flex items-center justify-center text-2xl transition-colors">
            💳
          </div>
          <div>
            <p className="text-white/50 text-sm font-medium group-hover:text-white/70 transition-colors">
              No hay tarjetas registradas
            </p>
            <p className="text-white/25 text-xs mt-0.5">
              Haz clic para añadir tu primera tarjeta
            </p>
          </div>
        </button>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <SingleCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </section>
  );
}
