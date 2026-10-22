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

const labelCls = "block text-white/45 text-xs font-medium mb-1.5 uppercase tracking-wider";

const selectCls =
  "w-full rounded-xl bg-[#12122a] border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer";

// ─── Form state type ──────────────────────────────────────────────────────────
interface FormState {
  name: string;
  lastFour: string;
  type: CardType;
  network: CardNetwork;
  balance: string;
  creditLimit: string;
  cutoffDate: string;
  paymentDue: string;
  color: string;
}

const initialForm: FormState = {
  name: "",
  lastFour: "",
  type: "debit",
  network: "visa",
  balance: "",
  creditLimit: "",
  cutoffDate: "",
  paymentDue: "",
  color: CARD_COLORS[0].value,
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: WalletCard) => void;
}

/**
 * Modal for adding a new debit or credit card.
 * Validates required fields before calling onSave.
 */
export default function AddCardModal({ isOpen, onClose, onSave }: AddCardModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim())     errs.name     = "Requerido";
    if (!form.lastFour.trim() || form.lastFour.length !== 4) errs.lastFour = "Debe tener 4 dígitos";
    if (!form.cutoffDate)      errs.cutoffDate = "Requerido";
    if (!form.balance)         errs.balance  = "Requerido";
    if (form.type === "credit" && !form.creditLimit) errs.creditLimit = "Requerido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const isCredit = form.type === "credit";
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
    setErrors({});
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Añadir Tarjeta">
      <div className="flex flex-col gap-4">

        {/* Nombre */}
        <div>
          <label className={labelCls}>Nombre de la tarjeta</label>
          <input
            className={inputCls}
            placeholder="ej. BBVA Débito, Nu Crédito..."
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Últimos 4 dígitos */}
        <div>
          <label className={labelCls}>Últimos 4 dígitos</label>
          <input
            className={inputCls}
            placeholder="1234"
            maxLength={4}
            value={form.lastFour}
            onChange={(e) => set("lastFour", e.target.value.replace(/\D/g, ""))}
          />
          {errors.lastFour && <p className="text-rose-400 text-xs mt-1">{errors.lastFour}</p>}
        </div>

        {/* Tipo + Red */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Tipo</label>
            <select
              className={selectCls}
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
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
              onChange={(e) => set("network", e.target.value)}
            >
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="amex">Amex</option>
            </select>
          </div>
        </div>

        {/* Saldo / Monto que debes */}
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
              onChange={(e) => set("balance", e.target.value)}
            />
          </div>
          {errors.balance && <p className="text-rose-400 text-xs mt-1">{errors.balance}</p>}
        </div>

        {/* Límite de crédito (solo crédito) */}
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
                onChange={(e) => set("creditLimit", e.target.value)}
              />
            </div>
            {errors.creditLimit && <p className="text-rose-400 text-xs mt-1">{errors.creditLimit}</p>}
          </div>
        )}

        {/* Fecha de corte */}
        <div>
          <label className={labelCls}>Fecha de corte</label>
          <input
            className={inputCls + " [color-scheme:dark]"}
            type="date"
            value={form.cutoffDate}
            onChange={(e) => set("cutoffDate", e.target.value)}
          />
          {errors.cutoffDate && <p className="text-rose-400 text-xs mt-1">{errors.cutoffDate}</p>}
        </div>

        {/* Monto a pagar (solo crédito) */}
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
                onChange={(e) => set("paymentDue", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Color */}
        <div>
          <label className={labelCls}>Color de tarjeta</label>
          <div className="flex gap-2 flex-wrap">
            {CARD_COLORS.map((c) => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => set("color", c.value)}
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

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05] text-sm font-medium transition-all"
          >
            Cancelar
          </button>
          <button
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
