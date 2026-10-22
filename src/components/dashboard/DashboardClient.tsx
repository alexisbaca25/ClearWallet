"use client";

import { useCallback, useMemo, useState } from "react";

import HeroBalance from "@/components/dashboard/HeroBalance";
import CardWallet from "@/components/dashboard/CardWallet";
import CashFlow from "@/components/dashboard/CashFlow";
import UpcomingPayments from "@/components/dashboard/UpcomingPayments";
import AddCardModal from "@/components/modals/AddCardModal";
import NewMovementModal from "@/components/modals/NewMovementModal";

import type {
  DynamicBalance,
  InformalDebt,
  MovementData,
  Receivable,
  Transaction,
  UpcomingPayment,
  WalletCard,
} from "@/types";

/**
 * Root client component — owns all application state.
 *
 * State shape:
 *   cash          → efectivo disponible (number)
 *   cards         → tarjetas registradas (WalletCard[])
 *   transactions  → movimientos de efectivo (Transaction[])
 *   receivables   → dinero que te deben (Receivable[])
 *   informalDebts → deudas informales sin tarjeta (InformalDebt[])
 *
 * Derived:
 *   balance         → DynamicBalance (memo)
 *   upcomingPayments → derived from credit cards (memo)
 */
export default function DashboardClient() {
  // ── Core state ──────────────────────────────────────────────────────────────
  const [cash, setCash]                 = useState<number>(0);
  const [cards, setCards]               = useState<WalletCard[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [receivables, setReceivables]   = useState<Receivable[]>([]);
  const [informalDebts, setInformalDebts] = useState<InformalDebt[]>([]);

  // ── Modal visibility ────────────────────────────────────────────────────────
  const [isAddCardOpen,      setIsAddCardOpen]      = useState(false);
  const [isNewMovementOpen,  setIsNewMovementOpen]  = useState(false);

  // ── Derived: balance ────────────────────────────────────────────────────────
  const balance = useMemo((): DynamicBalance => {
    const totalReceivables  = receivables.reduce((s, r) => s + r.amount, 0);
    const totalExpenses     = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const totalCardDebt     = cards.reduce((s, c) => s + c.paymentDue, 0);
    const totalInformalDebts = informalDebts.reduce((s, d) => s + d.amount, 0);
    const monthlyIncome     = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);

    return {
      total:              (cash + totalReceivables) - (totalExpenses + totalCardDebt + totalInformalDebts),
      cash,
      totalReceivables,
      totalCardDebt,
      totalInformalDebts,
      totalExpenses,
      monthlyIncome,
      monthlyExpenses:    totalExpenses,
    };
  }, [cash, cards, transactions, receivables, informalDebts]);

  // ── Derived: upcoming payments from credit cards ────────────────────────────
  const upcomingPayments = useMemo((): UpcomingPayment[] =>
    cards
      .filter((c) => c.type === "credit" && c.paymentDue > 0)
      .map((c) => ({
        id:       c.id,
        name:     c.name,
        amount:   c.paymentDue,
        dueDate:  c.cutoffDate,
        icon:     "💳",
        cardName: `****${c.lastFour}`,
      })),
  [cards]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleAddCard = useCallback((card: WalletCard) => {
    setCards((prev) => [card, ...prev]);
    setIsAddCardOpen(false);
  }, []);

  const handleNewMovement = useCallback((data: MovementData) => {
    const today = new Date().toISOString().split("T")[0];

    switch (data.type) {
      case "expense":
        setTransactions((prev) => [
          {
            id:          `txn-${Date.now()}`,
            description: data.concept,
            amount:      -data.amount,
            category:    "food",
            date:        today,
            icon:        "💸",
          },
          ...prev,
        ]);
        break;

      case "cash_income":
        setCash((prev) => prev + data.amount);
        setTransactions((prev) => [
          {
            id:          `txn-${Date.now()}`,
            description: data.description,
            amount:      data.amount,
            category:    "salary",
            date:        today,
            icon:        "💵",
          },
          ...prev,
        ]);
        break;

      case "receivable":
        setReceivables((prev) => [
          { id: `rec-${Date.now()}`, person: data.person, amount: data.amount, date: today },
          ...prev,
        ]);
        break;

      case "informal_debt":
        setInformalDebts((prev) => [
          { id: `debt-${Date.now()}`, person: data.person, amount: data.amount, date: today },
          ...prev,
        ]);
        break;
    }

    setIsNewMovementOpen(false);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a14]">

      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-700/25 blur-[120px]" />
        <div className="absolute top-[30%] right-[-8%] w-[400px] h-[400px] rounded-full bg-indigo-800/20 blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[30%] w-[450px] h-[450px] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Navbar ──────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0a0a14]/60 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-white text-xs font-bold">CW</span>
            </div>
            <span className="text-white font-semibold tracking-tight text-lg">
              Clear<span className="text-violet-400">Wallet</span>
            </span>
          </div>

          {/* Primary CTA */}
          <button
            id="btn-nuevo-registro"
            onClick={() => setIsNewMovementOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-base leading-none font-bold">+</span>
            Nuevo Registro
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold select-none">
            AB
          </div>
        </header>

        {/* ── Main grid ────────────────────────────────────────────────────── */}
        <main className="flex-1 p-6">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">

              {/* Sidebar */}
              <aside className="flex flex-col gap-6">
                <HeroBalance balance={balance} />
                <UpcomingPayments payments={upcomingPayments} />
              </aside>

              {/* Main area */}
              <div className="flex flex-col gap-6">
                <CardWallet
                  cards={cards}
                  onAddCard={() => setIsAddCardOpen(true)}
                />
                <CashFlow
                  transactions={transactions}
                  receivables={receivables}
                  informalDebts={informalDebts}
                />
              </div>

            </div>
          </div>
        </main>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="text-center py-4 text-white/20 text-xs border-t border-white/[0.04]">
          ClearWallet © {new Date().getFullYear()} — Solo para uso personal
        </footer>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onSave={handleAddCard}
      />
      <NewMovementModal
        isOpen={isNewMovementOpen}
        onClose={() => setIsNewMovementOpen(false)}
        onSave={handleNewMovement}
      />
    </div>
  );
}
