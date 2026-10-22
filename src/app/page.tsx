import HeroBalance from "@/components/dashboard/HeroBalance";
import CardWallet from "@/components/dashboard/CardWallet";
import CashFlow from "@/components/dashboard/CashFlow";
import UpcomingPayments from "@/components/dashboard/UpcomingPayments";

import {
  mockBalanceSummary,
  mockWalletCards,
  mockTransactions,
  mockUpcomingPayments,
} from "@/data/mockData";

/**
 * Main dashboard page.
 * Layout: sidebar (hero + upcoming) | main area (cards + cash flow)
 */
export default function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a14]">

      {/* ── Background ambient orbs ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-700/25 blur-[120px]" />
        <div className="absolute top-[30%] right-[-8%] w-[400px] h-[400px] rounded-full bg-indigo-800/20 blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[30%] w-[450px] h-[450px] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      {/* ── App shell ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Top navbar ──────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0a0a14]/60 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-white text-xs font-bold">CW</span>
            </div>
            <span className="text-white font-semibold tracking-tight text-lg">
              Clear<span className="text-violet-400">Wallet</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {["Dashboard", "Tarjetas", "Transacciones", "Reportes"].map((item) => (
              <button
                key={item}
                className={[
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  item === "Dashboard"
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              🔔
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              AB
            </div>
          </div>
        </header>

        {/* ── Main content grid ────────────────────────────────────────────────── */}
        <main className="flex-1 p-6">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">

              {/* ── Left sidebar ─────────────────────────────────────────────── */}
              <aside className="flex flex-col gap-6">
                <HeroBalance summary={mockBalanceSummary} />
                <UpcomingPayments payments={mockUpcomingPayments} />
              </aside>

              {/* ── Right main area ───────────────────────────────────────────── */}
              <div className="flex flex-col gap-6">
                <CardWallet cards={mockWalletCards} />
                <CashFlow transactions={mockTransactions} />
              </div>

            </div>
          </div>
        </main>

        {/* ── Footer ──────────────────────────────────────────────────────────── */}
        <footer className="text-center py-4 text-white/20 text-xs border-t border-white/[0.04]">
          ClearWallet © {new Date().getFullYear()} — Solo para uso personal
        </footer>
      </div>
    </div>
  );
}
