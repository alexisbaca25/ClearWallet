import type {
  BalanceSummary,
  Transaction,
  UpcomingPayment,
  WalletCard,
} from "@/types";

// ─── Balance Summary ──────────────────────────────────────────────────────────
export const mockBalanceSummary: BalanceSummary = {
  totalBalance: 84_320.5,
  dailyChange: 1_240.0,
  dailyChangePercent: 1.49,
  monthlyIncome: 32_000.0,
  monthlyExpenses: 12_430.75,
};

// ─── Wallet Cards ─────────────────────────────────────────────────────────────
export const mockWalletCards: WalletCard[] = [
  {
    id: "card-001",
    name: "BBVA Débito",
    network: "visa",
    type: "debit",
    lastFour: "4821",
    balance: 42_180.5,
    cutoffDate: "2026-10-31",
    paymentDue: 0,
    color: "from-violet-600/80 to-indigo-800/80",
  },
  {
    id: "card-002",
    name: "Citibanamex Gold",
    network: "mastercard",
    type: "credit",
    lastFour: "7734",
    balance: -8_540.0,
    creditLimit: 30_000,
    cutoffDate: "2026-10-25",
    paymentDue: 8_540.0,
    color: "from-rose-600/80 to-pink-900/80",
  },
  {
    id: "card-003",
    name: "Nu Crédito",
    network: "mastercard",
    type: "credit",
    lastFour: "2290",
    balance: -2_340.0,
    creditLimit: 15_000,
    cutoffDate: "2026-11-05",
    paymentDue: 2_340.0,
    color: "from-purple-700/80 to-fuchsia-900/80",
  },
  {
    id: "card-004",
    name: "HSBC Advance",
    network: "visa",
    type: "debit",
    lastFour: "6614",
    balance: 12_440.0,
    cutoffDate: "2026-10-31",
    paymentDue: 0,
    color: "from-sky-600/80 to-cyan-900/80",
  },
];

// ─── Recent Transactions ──────────────────────────────────────────────────────
export const mockTransactions: Transaction[] = [
  // Incomes
  {
    id: "txn-001",
    description: "Salario Mensual",
    amount: 25_000,
    category: "salary",
    date: "2026-10-01",
    icon: "💼",
  },
  {
    id: "txn-002",
    description: "Proyecto Freelance",
    amount: 4_800,
    category: "freelance",
    date: "2026-10-08",
    icon: "💻",
  },
  {
    id: "txn-003",
    description: "Dividendos GBM",
    amount: 2_200,
    category: "investment",
    date: "2026-10-15",
    icon: "📈",
  },
  // Expenses
  {
    id: "txn-004",
    description: "Supermercado Chedraui",
    amount: -1_820.5,
    category: "food",
    date: "2026-10-18",
    icon: "🛒",
  },
  {
    id: "txn-005",
    description: "Gasolina",
    amount: -850.0,
    category: "transport",
    date: "2026-10-17",
    icon: "⛽",
  },
  {
    id: "txn-006",
    description: "Renta Departamento",
    amount: -7_500.0,
    category: "housing",
    date: "2026-10-02",
    icon: "🏠",
  },
  {
    id: "txn-007",
    description: "Netflix + Spotify",
    amount: -380.0,
    category: "entertainment",
    date: "2026-10-12",
    icon: "🎬",
  },
  {
    id: "txn-008",
    description: "Farmacia del Ahorro",
    amount: -620.0,
    category: "health",
    date: "2026-10-16",
    icon: "💊",
  },
];

// ─── Upcoming Payments ────────────────────────────────────────────────────────
export const mockUpcomingPayments: UpcomingPayment[] = [
  {
    id: "pay-001",
    name: "Citibanamex Gold",
    amount: 8_540.0,
    dueDate: "2026-10-25",
    icon: "💳",
    cardName: "****7734",
  },
  {
    id: "pay-002",
    name: "Renta Departamento",
    amount: 7_500.0,
    dueDate: "2026-11-01",
    icon: "🏠",
  },
  {
    id: "pay-003",
    name: "Nu Crédito",
    amount: 2_340.0,
    dueDate: "2026-11-05",
    icon: "💳",
    cardName: "****2290",
  },
  {
    id: "pay-004",
    name: "Telmex Internet",
    amount: 599.0,
    dueDate: "2026-11-08",
    icon: "📡",
  },
  {
    id: "pay-005",
    name: "Seguro de Auto",
    amount: 1_450.0,
    dueDate: "2026-11-15",
    icon: "🚗",
  },
];
