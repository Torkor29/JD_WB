"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { FeatureMotionId } from "@/lib/capabilities";

type Props = {
  id: FeatureMotionId;
  className?: string;
  compact?: boolean;
};

function RdvMotion({ compact }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % 4), 1400);
    return () => window.clearInterval(id);
  }, [reduce]);

  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const selected = step >= 1;
  const confirmed = step >= 2;
  const done = step >= 3;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-line bg-white shadow-card ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="mb-2 flex items-center justify-between sm:mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent sm:text-xs">
          Agenda
        </p>
        <span className="text-[10px] text-muted sm:text-[11px]">Mars 2026</span>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] text-muted sm:gap-1 sm:text-[10px]">
        {days.map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-0.5 sm:gap-1">
        {Array.from({ length: 28 }, (_, i) => {
          const day = i + 1;
          const isTarget = day === 12;
          return (
            <motion.div
              key={day}
              animate={
                isTarget && selected
                  ? { scale: 1.06, backgroundColor: "#1F5EFF", color: "#fff" }
                  : { scale: 1, backgroundColor: "#F5F8FC", color: "#0B1F3A" }
              }
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className={`flex aspect-square items-center justify-center rounded-md font-semibold sm:rounded-lg ${
                compact ? "text-[10px]" : "text-[11px]"
              }`}
            >
              {day}
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-2 rounded-xl border border-line bg-paper-soft px-2.5 py-2 text-[11px] sm:mt-3 sm:px-3 sm:py-2.5 sm:text-xs"
        >
          {!selected && <span className="text-muted">Choisissez un créneau…</span>}
          {selected && !confirmed && (
            <span className="font-semibold text-ink">12 mars · 10:30 — Confirmer ?</span>
          )}
          {confirmed && !done && (
            <span className="font-semibold text-accent">Envoi de la confirmation…</span>
          )}
          {done && (
            <span className="font-semibold text-ink">✓ RDV confirmé — rappel envoyé</span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FideliteMotion({ compact }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const [points, setPoints] = useState(6);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setPoints((p) => (p >= 10 ? 3 : p + 1));
    }, 1100);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-white to-accent-soft shadow-card ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent sm:text-xs">
        Wallet
      </p>
      <p className={`mt-2 font-display tracking-tight ${compact ? "text-xl" : "text-2xl"}`}>
        Carte fidélité
      </p>
      <div className="mt-3 flex gap-1 sm:mt-4 sm:gap-1.5">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.span
            key={i}
            animate={{
              backgroundColor: i < points ? "#1F5EFF" : "#EAF0F8",
              scale: i === points - 1 ? 1.12 : 1,
            }}
            className="h-2.5 flex-1 rounded-full sm:h-3"
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted sm:mt-3 sm:text-sm">
        {points}/10 — {points >= 10 ? "Récompense débloquée" : "Encore un passage"}
      </p>
    </div>
  );
}

function DashboardMotion({ compact }: { compact?: boolean }) {
  const bars = [42, 68, 55, 80, 62, 90, 74];
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-white shadow-card ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent sm:text-xs">
        Dashboard
      </p>
      <div className={`mt-3 flex items-end gap-1.5 sm:mt-4 sm:gap-2 ${compact ? "h-16" : "h-24"}`}>
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-md bg-accent/80"
            initial={{ height: 8 }}
            animate={{ height: `${h}%` }}
            transition={{
              duration: 1.2,
              delay: i * 0.08,
              repeat: Infinity,
              repeatType: "mirror",
              repeatDelay: 1.5,
            }}
          />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2">
        {["Users", "Ops", "CA"].map((label) => (
          <div
            key={label}
            className="rounded-lg bg-paper-soft px-2 py-2 text-center text-[10px] font-semibold text-muted"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReservationMotion({ compact }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(1);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setN((v) => (v % 3) + 1), 1300);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-white shadow-card ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent sm:text-xs">
        Événement
      </p>
      <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
        {["Atelier", "Réunion", "Visite"].map((label, i) => (
          <motion.div
            key={label}
            animate={{
              borderColor: n === i + 1 ? "#1F5EFF" : "rgba(11,31,58,0.1)",
              backgroundColor: n === i + 1 ? "#E8F0FF" : "#FFFFFF",
            }}
            className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm sm:py-2.5"
          >
            <span className="font-semibold">{label}</span>
            <span className="text-xs text-muted">{n === i + 1 ? "Réservé" : "Dispo"}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SuiviMotion({ compact }: { compact?: boolean }) {
  const items = [
    { label: "Import données", status: "done" },
    { label: "Règles métier", status: "done" },
    { label: "Alertes", status: "active" },
    { label: "Export", status: "todo" },
  ];
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-white shadow-card ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent sm:text-xs">
        Process
      </p>
      <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
        {items.map((item, i) => (
          <motion.li
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 rounded-xl bg-paper-soft px-3 py-2 text-sm sm:py-2.5"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                item.status === "done"
                  ? "bg-accent text-white"
                  : item.status === "active"
                    ? "bg-accent/20 text-accent"
                    : "bg-white text-muted"
              }`}
            >
              {item.status === "done" ? "✓" : i + 1}
            </span>
            {item.label}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export function FeatureMotion({ id, className = "", compact = false }: Props) {
  return (
    <div className={className}>
      {id === "rdv" && <RdvMotion compact={compact} />}
      {id === "fidelite" && <FideliteMotion compact={compact} />}
      {id === "dashboard" && <DashboardMotion compact={compact} />}
      {id === "reservation" && <ReservationMotion compact={compact} />}
      {id === "suivi" && <SuiviMotion compact={compact} />}
    </div>
  );
}
