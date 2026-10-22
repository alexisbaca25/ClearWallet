// ─── Wallet Card Types ────────────────────────────────────────────────────────
export type CardNetwork = "visa" | "mastercard" | "amex";
export type CardType = "debit" | "credit";

export interface WalletCard {
  id: string;
  name: string;
  network: CardNetwork;
  type: CardType;
  lastFour: string;
  balance: number;
  creditLimit?: number;
  cutoffDate: string;   // ISO date string
  paymentDue: number;   // amount to pay this cycle
  color: string;        // CSS gradient string
}

// ─── Transaction Types ────────────────────────────────────────────────────────
export type TransactionCategory =
  | "salary"
  | "freelance"
  | "investment"
  | "food"
  | "transport"
  | "housing"
  | "entertainment"
  | "health"
  | "shopping"
  | "utilities";

export interface Transaction {
  id: string;
  description: string;
  amount: number;       // positive = income, negative = expense
  category: TransactionCategory;
  date: string;         // ISO date string
  icon: string;         // emoji icon
}

// ─── Upcoming Payment Types ───────────────────────────────────────────────────
export type PaymentUrgency = "critical" | "warning" | "safe";

export interface UpcomingPayment {
  id: string;
  name: string;
  amount: number;
  dueDate: string;      // ISO date string
  icon: string;
  cardName?: string;
}

// ─── Dashboard Summary ────────────────────────────────────────────────────────
export interface BalanceSummary {
  totalBalance: number;
  dailyChange: number;       // absolute change
  dailyChangePercent: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}
