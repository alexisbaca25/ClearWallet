"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { WalletCard, CardNetwork, CardType } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────
const CARD_COLORS: { label: string; value: string; preview: string }[] = [
  { label: "Violeta", value: "from-violet-600/80 to-indigo-800/80",  preview: "from-violet-600 to-indigo-800" },
  { label: "Rosa",    value: "from-rose-600/80 to-pink-900/80",       preview: "from-rose-600 to-pink-900" },
  { label: "Púrpura", value: "from-purple-700/80 to-fuchsia-900/80",  preview: "from-purple-700 to-fuchsia-900" },
  { label: "Cielo",   value: "from-sky-600/80 to-cyan-900/80",        preview: "from-sky-600 to-cyan-900" },
  { label: "Verde",   value: "from-emerald-600/80 to-teal-900/80",    preview: "from-emerald-600 to-teal-900" },
  { label: "Ámbar",   value: "from-amber-600/80 to-orange-900/80",    preview: "from-amber-600 to-orange-900" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/25 px-4 py-3 text-sm outline-none focus:border-violet-500/50 focus:bg-white/[0.09] transition-all";

const labelCls =
  "block text-white/45 text-xs font-medium mb-1.5 uppercase tracking-wider";

const selectCls =
  "w-full rounded-xl bg-[#12122a] border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer";

const msiInputCls =
  "w-full rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 px-3 py-2.5 text-sm outline-none focus:border-violet-500/40 focus:bg-white/[0.08] transition-all";

const msiLabelCls =
  "block text-white/35 text-xs font-medium mb-1 uppercase tracking-wider";

// ─── Form state ───────────────────────────────────────────────────────────────
interface FormState {
  name: string;
  lastFour: string;
  type: CardType;
  network: CardNetwork;
  balance: string;
  creditLimit: string;
  cutoffDate: string;
  paymentLimitDate: string;
  paymentDue: string;
  color: string;
}

// ─── MSI state ────────────────────────────────────────────────────────────────
interface MsiState {
  show: boolean;
  total: string;
  plazo: string;
  mesesPagados: string;
}

const initialForm: FormState = {
  name: "",
  lastFour: "",
  type: "debit",
  network: "visa",
  balance: "",
  creditLimit: "",
  cutoffDate: "",
  paymentLimitDate: "",
  paymentDue: "",
  color: CARD_COLORS[0].value,
};

const initialMsi: MsiState = {
  show: false,
  total: "",
  plazo: "",
  mesesPagados: "",
};

// ─── MSI Calculator ───────────────────────────────────────────────────────────
interface MsiResult {
  mensualidad: number | null;
  deudaRestante: number | null;
  mesesPendientes: number | null;
  isValid: boolean;
}

function calcMsi(msi: MsiState): MsiResult {
  const total   = parseFloat(msi.total);
  const plazo   = parseInt(msi.plazo, 10);
  const pagados = parseInt(msi.mesesPagados, 10);

  const isValid =
    !isNaN(total)   && total > 0 &&
    !isNaN(plazo)   && plazo > 0 &&
    !isNaN(pagados) && pagados >= 0 &&
    pagados <= plazo;

  if (!isValid) return { mensualidad: null, deudaRestante: null, mesesPendientes: null, isValid: false };

  const mensualidad    = total / plazo;
  const deudaRestante  = total - mensualidad * pagados;
  const mesesPendientes = plazo - pagados;

  return { mensualidad, deudaRestante, mesesPendientes, isValid: true };
}

function formatMXN(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: WalletCard) => void;
}

/**
 * Modal for adding a new debit or credit card.
 * Includes:
 *   - Fecha de corte + Fecha límite de pago (side by side)
 *   - Collapsible MSI panel with real-time debt calculator
 */
export default function AddCardModal({ isOpen, onClose, onSave }: AddCardModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [msi,  setMsi]  = useState<MsiState>(initialMsi);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setMsiField = (field: keyof Omit<MsiState, "show">, value: string) => {
    setMsi((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMsi = () =>
    setMsi((prev) => ({ ...prev, show: !prev.show }));

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim())                                errs.name     = "Requerido";
    if (!form.lastFour.trim() || form.lastFour.length !== 4) errs.lastFour = "Debe tener 4 dígitos";
    if (!form.cutoffDate)                                 errs.cutoffDate = "Requerido";
    if (!form.balance)                                    errs.balance  = "Requerido";
    if (form.type === "credit" && !form.creditLimit)      errs.creditLimit = "Requerido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!validate()) return;

    const isCredit  = form.type === "credit";
    const balanceNum = parseFloat(form.balance) || 0;

    const card: WalletCard = {
      id:          `card-${Date.now()}`,
      name:        form.name.trim(),
      network:     form.network,
      type:        form.type,
      lastFour:    form.lastFour,
      balance:     isCredit ? -balanceNum : balanceNum,
      creditLimit: isCredit ? (parseFloat(form.creditLimit) || 0) : undefined,
      cutoffDate:  form.cutoffDate,
      paymentDue:  isCredit ? (parseFloat(form.paymentDue) || balanceNum) : 0,
      color:       form.color,
    };

    onSave(card);
    setForm(initialForm);
    setMsi(initialMsi);
    setErrors({});
  };

  const handleClose = () => {
    setForm(initialForm);
    setMsi(initialMsi);
    setErrors({});
    onClose();
  };

  // ── MSI calculation (real-time) ─────────────────────────────────────────────
  const msiResult = calcMsi(msi);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Añadir Tarjeta" maxWidth="md">
      <div className="flex flex-col gap-4">

        {/* ── Nombre ──────────────────────────────────────────────────────── */}
        <div>
          <label className={labelCls}>Nombre de la tarjeta</label>
          <input
            className={inputCls}
            placeholder="ej. BBVA Débito, Nu Crédito..."
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* ── Últimos 4 dígitos ────────────────────────────────────────────── */}
        <div>
          <label className={labelCls}>Últimos 4 dígitos</label>
          <input
            className={inputCls}
            placeholder="1234"
            maxLength={4}
            value={form.lastFour}
            onChange={(e) => setField("lastFour", e.target.value.replace(/\D/g, ""))}
          />
          {errors.lastFour && <p className="text-rose-400 text-xs mt-1">{errors.lastFour}</p>}
        </div>

        {/* ── Tipo + Red ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Tipo</label>
            <select
              className={selectCls}
              value={form.type}
              onChange={(e) => setField("type", e.target.value)}
            >
              <option value="debit">Débito</option>
              <option value="credit">Crédito</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Red</label>
            <select
              className={selectCls}
              value={form.network}
              onChange={(e) => setField("network", e.target.value)}
            >
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="amex">Amex</option>
            </select>
          </div>
        </div>

        {/* ── Saldo ────────────────────────────────────────────────────────── */}
        <div>
          <label className={labelCls}>
            {form.type === "credit" ? "Monto que debes actualmente" : "Saldo disponible"}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
            <input
              className={inputCls + " pl-8"}
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
              value={form.balance}
              onChange={(e) => setField("balance", e.target.value)}
            />
          </div>
          {errors.balance && <p className="text-rose-400 text-xs mt-1">{errors.balance}</p>}
        </div>

        {/* ── Límite de crédito (solo crédito) ─────────────────────────────── */}
        {form.type === "credit" && (
          <div>
            <label className={labelCls}>Límite de crédito</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
              <input
                className={inputCls + " pl-8"}
                placeholder="0.00"
                type="number"
                min="0"
                step="0.01"
                value={form.creditLimit}
                onChange={(e) => setField("creditLimit", e.target.value)}
              />
            </div>
            {errors.creditLimit && <p className="text-rose-400 text-xs mt-1">{errors.creditLimit}</p>}
          </div>
        )}

        {/* ── Fechas: Corte + Límite de pago ───────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Fecha de corte</label>
            <input
              className={inputCls + " [color-scheme:dark]"}
              type="date"
              value={form.cutoffDate}
              onChange={(e) => setField("cutoffDate", e.target.value)}
            />
            {errors.cutoffDate && <p className="text-rose-400 text-xs mt-1">{errors.cutoffDate}</p>}
          </div>
          <div>
            <label className={labelCls}>Fecha límite de pago</label>
            <input
              className={inputCls + " [color-scheme:dark]"}
              type="date"
              value={form.paymentLimitDate}
              onChange={(e) => setField("paymentLimitDate", e.target.value)}
            />
          </div>
        </div>

        {/* ── Monto a pagar este corte (solo crédito) ──────────────────────── */}
        {form.type === "credit" && (
          <div>
            <label className={labelCls}>Monto a pagar este corte</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
              <input
                className={inputCls + " pl-8"}
                placeholder="Dejar vacío = usa el saldo"
                type="number"
                min="0"
                step="0.01"
                value={form.paymentDue}
                onChange={(e) => setField("paymentDue", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── MSI: Sección colapsable ───────────────────────────────────── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div>
          {/* Toggle */}
          <button
            type="button"
            onClick={toggleMsi}
            className="flex items-center gap-2 text-xs text-violet-400/80 hover:text-violet-300 transition-colors group"
          >
            <span
              className={[
                "w-4 h-4 rounded flex items-center justify-center border transition-all duration-200 text-[10px]",
                msi.show
                  ? "bg-violet-600/40 border-violet-500/50 text-violet-300"
                  : "bg-white/[0.05] border-white/10 text-white/30 group-hover:border-violet-500/30",
              ].join(" ")}
            >
              {msi.show ? "−" : "+"}
            </span>
            <span className="font-medium tracking-wide">
              {msi.show ? "Ocultar deuda a meses" : "Registrar deuda activa a meses (MSI)"}
            </span>
          </button>

          {/* Panel expandible */}
          {msi.show && (
            <div className="mt-3 rounded-xl bg-white/[0.04] border border-white/[0.07] p-4 flex flex-col gap-3">

              {/* ── Inputs MSI ─────────────────────────────────────────── */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className={msiLabelCls}>Monto total</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">$</span>
                    <input
                      className={msiInputCls + " pl-6"}
                      placeholder="1500"
                      type="number"
                      min="0"
                      step="0.01"
                      value={msi.total}
                      onChange={(e) => setMsiField("total", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={msiLabelCls}>Plazo (meses)</label>
                  <input
                    className={msiInputCls}
                    placeholder="12"
                    type="number"
                    min="1"
                    step="1"
                    value={msi.plazo}
                    onChange={(e) => setMsiField("plazo", e.target.value)}
                  />
                </div>
                <div>
                  <label className={msiLabelCls}>Ya pagados</label>
                  <input
                    className={msiInputCls}
                    placeholder="5"
                    type="number"
                    min="0"
                    step="1"
                    value={msi.mesesPagados}
                    onChange={(e) => setMsiField("mesesPagados", e.target.value)}
                  />
                </div>
              </div>

              {/* ── Resultados en tiempo real ───────────────────────────── */}
              {msiResult.isValid ? (
                <div className="rounded-lg bg-violet-600/[0.08] border border-violet-500/20 px-4 py-3 flex flex-col gap-1.5">
                  <ResultRow
                    label="Mensualidad a sumar al corte"
                    value={formatMXN(msiResult.mensualidad!)}
                    color="text-violet-300"
                  />
                  <div className="h-px bg-white/[0.05]" />
                  <ResultRow
                    label="Deuda restante"
                    value={formatMXN(msiResult.deudaRestante!)}
                    color="text-rose-300"
                  />
                  <ResultRow
                    label="Meses pendientes"
                    value={`${msiResult.mesesPendientes} ${msiResult.mesesPendientes === 1 ? "mes" : "meses"}`}
                    color="text-amber-300"
                  />
                </div>
              ) : (
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] px-4 py-3 text-center">
                  <p className="text-white/20 text-xs">
                    Llena los tres campos para ver el cálculo
                  </p>
                </div>
              )}

            </div>
          )}
        </div>

        {/* ── Color de tarjeta ─────────────────────────────────────────────── */}
        <div>
          <label className={labelCls}>Color de tarjeta</label>
          <div className="flex gap-2 flex-wrap">
            {CARD_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => setField("color", c.value)}
                className={[
                  "w-8 h-8 rounded-full bg-gradient-to-br transition-all duration-200",
                  c.preview,
                  form.color === c.value
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#0d0d1f] scale-110"
                    : "opacity-60 hover:opacity-100",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

        {/* ── Acciones ─────────────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05] text-sm font-medium transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-600/25"
          >
            Guardar tarjeta
          </button>
        </div>

      </div>
    </Modal>
  );
}

// ─── Helper: fila de resultado MSI ───────────────────────────────────────────
function ResultRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/40 text-xs">{label}:</span>
      <span className={["text-xs font-bold tabular-nums", color].join(" ")}>{value}</span>
    </div>
  );
}
