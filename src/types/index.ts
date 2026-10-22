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
  cutoffDate: string;
  paymentDue: number;
  color: string;
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
  amount: number;
  category: TransactionCategory;
  date: string;
  icon: string;
}

// ─── Upcoming Payment Types ───────────────────────────────────────────────────
export type PaymentUrgency = "critical" | "warning" | "safe";

export interface UpcomingPayment {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  icon: string;
  cardName?: string;
}

// ─── Cuentas por cobrar (Presté dinero) ──────────────────────────────────────
export interface Receivable {
  id: string;
  person: string;
  amount: number;
  date: string;
  notes?: string;
}

// ─── Deudas informales (Debo dinero sin tarjeta) ─────────────────────────────
export interface InformalDebt {
  id: string;
  person: string;
  amount: number;
  date: string;
  notes?: string;
}

// ─── Movement (New Record Modal) ─────────────────────────────────────────────
export type MovementType =
  | "expense"
  | "cash_income"
  | "receivable"
  | "informal_debt";

interface BaseMovement {
  amount: number;
}
export interface ExpenseMovement extends BaseMovement {
  type: "expense";
  concept: string;
}
export interface CashIncomeMovement extends BaseMovement {
  type: "cash_income";
  description: string;
}
export interface ReceivableMovement extends BaseMovement {
  type: "receivable";
  person: string;
}
export interface InformalDebtMovement extends BaseMovement {
  type: "informal_debt";
  person: string;
}
export type MovementData =
  | ExpenseMovement
  | CashIncomeMovement
  | ReceivableMovement
  | InformalDebtMovement;

// ─── Dynamic Balance (computed from state) ───────────────────────────────────
export interface DynamicBalance {
  total: number;
  cash: number;
  totalReceivables: number;
  totalCardDebt: number;
  totalInformalDebts: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}
