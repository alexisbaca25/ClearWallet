"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import type { MovementData, MovementType } from "@/types";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS: { type: MovementType; label: string; icon: string; color: string }[] = [
  { type: "expense",       label: "Gasto",    icon: "💸", color: "text-rose-400"    },
  { type: "cash_income",   label: "Ingreso",  icon: "💵", color: "text-emerald-400" },
  { type: "receivable",    label: "Presté",   icon: "🤝", color: "text-sky-400"     },
  { type: "informal_debt", label: "Debo",     icon: "😬", color: "text-amber-400"   },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/25 px-4 py-3 text-sm outline-none focus:border-violet-500/50 focus:bg-white/[0.09] transition-all";

const labelCls =
  "block text-white/45 text-xs font-medium mb-1.5 uppercase tracking-wider";

// ─── Props ────────────────────────────────────────────────────────────────────
interface NewMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MovementData) => void;
}

/**
 * Universal "New Record" modal.
 * Tabs: Gasto | Ingreso | Presté | Debo
 * Each tab renders only the relevant fields and validates before saving.
 */
export default function NewMovementModal({
  isOpen,
  onClose,
  onSave,
}: NewMovementModalProps) {
  const [activeTab, setActiveTab] = useState<MovementType>("expense");
  const [amount, setAmount]       = useState("");
  const [concept, setConcept]     = useState("");
  const [person, setPerson]       = useState("");
  const [description, setDescription] = useState("");
  const [error, setError]         = useState("");

  const reset = () => {
    setActiveTab("expense");
    setAmount("");
    setConcept("");
    setPerson("");
    setDescription("");
    setError("");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleTabChange = (tab: MovementType) => {
    setActiveTab(tab);
    setError("");
  };

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Ingresa un monto válido mayor a cero.");
      return;
    }

    switch (activeTab) {
      case "expense":
        if (!concept.trim()) { setError("El concepto es requerido."); return; }
        onSave({ type: "expense", amount: parsedAmount, concept: concept.trim() });
        break;

      case "cash_income":
        onSave({
          type: "cash_income",
          amount: parsedAmount,
          description: description.trim() || "Ingreso de efectivo",
        });
        break;

      case "receivable":
        if (!person.trim()) { setError("Indica a quién le prestaste."); return; }
        onSave({ type: "receivable", amount: parsedAmount, person: person.trim() });
        break;

      case "informal_debt":
        if (!person.trim()) { setError("Indica a quién le debes."); return; }
        onSave({ type: "informal_debt", amount: parsedAmount, person: person.trim() });
        break;
    }

    reset();
  };

  const activeTabConfig = TABS.find((t) => t.type === activeTab)!;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nuevo Registro">
      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-1.5 bg-white/[0.04] rounded-xl p-1 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => handleTabChange(tab.type)}
            className={[
              "flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-xs font-medium transition-all duration-200",
              activeTab === tab.type
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-white/35 hover:text-white/60 hover:bg-white/[0.04]",
            ].join(" ")}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Context hint ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
        <span className="text-xl">{activeTabConfig.icon}</span>
        <p className={["text-sm font-medium", activeTabConfig.color].join(" ")}>
          {activeTab === "expense"       && "Resta al balance total"}
          {activeTab === "cash_income"   && "Suma al efectivo y al balance"}
          {activeTab === "receivable"    && "Registra dinero que te deben (activo)"}
          {activeTab === "informal_debt" && "Registra dinero que debes (pasivo)"}
        </p>
      </div>

      {/* ── Form fields ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {/* Concepto (expense only) */}
        {activeTab === "expense" && (
          <div>
            <label className={labelCls}>Concepto</label>
            <input
              className={inputCls}
              placeholder="ej. Gasolina, Supermercado, Renta..."
              value={concept}
              onChange={(e) => { setConcept(e.target.value); setError(""); }}
            />
          </div>
        )}

        {/* Descripción (income only) */}
        {activeTab === "cash_income" && (
          <div>
            <label className={labelCls}>Descripción (opcional)</label>
            <input
              className={inputCls}
              placeholder="ej. Salario, Venta, Transferencia..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}

        {/* Persona (receivable / informal_debt) */}
        {(activeTab === "receivable" || activeTab === "informal_debt") && (
          <div>
            <label className={labelCls}>
              {activeTab === "receivable" ? "¿A quién le prestaste?" : "¿A quién le debes?"}
            </label>
            <input
              className={inputCls}
              placeholder="Nombre de la persona"
              value={person}
              onChange={(e) => { setPerson(e.target.value); setError(""); }}
            />
          </div>
        )}

        {/* Monto — always shown */}
        <div>
          <label className={labelCls}>Monto</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
            <input
              className={inputCls + " pl-8"}
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            ⚠ {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/[0.05] text-sm font-medium transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={[
              "flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-all shadow-lg",
              activeTab === "expense"
                ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/25"
                : activeTab === "cash_income"
                  ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25"
                  : activeTab === "receivable"
                    ? "bg-sky-600 hover:bg-sky-500 shadow-sky-600/25"
                    : "bg-amber-600 hover:bg-amber-500 shadow-amber-600/25",
            ].join(" ")}
          >
            Guardar registro
          </button>
        </div>

      </div>
    </Modal>
  );
}
