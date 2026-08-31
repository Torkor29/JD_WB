"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, CreditCard, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import type { FeatureDemoId } from "@/lib/capabilities";

type Props = {
  id: FeatureDemoId;
  className?: string;
  /** @deprecated ignored — kept for old call sites */
  compact?: boolean;
};

function DemoShell({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line bg-paper-soft px-3.5 py-2.5 sm:px-4">
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
          {eyebrow}
        </p>
        <span className="flex shrink-0 gap-1" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
        </span>
      </div>
      <div className="min-w-0 p-3.5 sm:p-4">{children}</div>
    </div>
  );
}

function PaiementDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % 3), 1800);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <DemoShell eyebrow="Checkout">
      <div className="relative min-h-[176px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0"
          >
            {step === 0 && (
              <div className="flex h-full flex-col justify-between gap-3">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-paper-soft px-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      Prestation
                    </p>
                    <p className="text-xs text-muted">Devis validé</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-ink">180 €</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Total TTC</span>
                  <span className="font-bold text-ink">180 €</span>
                </div>
                <div className="rounded-full bg-ink px-4 py-2.5 text-center text-sm font-semibold text-white">
                  Payer maintenant
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="flex h-full flex-col justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <CreditCard size={16} className="shrink-0 text-accent" />
                  Paiement sécurisé
                </div>
                <div className="rounded-xl border border-line bg-paper-soft px-3 py-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted">
                    Carte
                  </p>
                  <p className="mt-1 truncate font-mono text-sm tracking-widest text-ink">
                    •••• •••• •••• 4242
                  </p>
                </div>
                <div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-paper-mute">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: "12%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.35, ease: "easeInOut" }}
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-muted">
                    Traitement…
                  </p>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white"
                >
                  <Check size={20} />
                </motion.span>
                <p className="mt-3 text-sm font-bold text-ink">
                  Paiement confirmé
                </p>
                <p className="mt-1 text-xs text-muted">Reçu envoyé par e-mail</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </DemoShell>
  );
}

function AppDemo() {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState(0);
  const screens = [
    { title: "Accueil", body: "Vos services, en un tap." },
    { title: "Réservation", body: "Créneau choisi · 10:30" },
    { title: "Confirmé", body: "Rappel envoyé au client." },
  ];

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setScreen((s) => (s + 1) % 3), 1700);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="flex justify-center py-1">
      <div className="relative w-[min(100%,11rem)] overflow-hidden rounded-[1.5rem] border-[3px] border-ink bg-ink p-1.5 shadow-lift">
        <div className="mx-auto mb-1.5 h-1 w-10 rounded-full bg-white/20" />
        <div className="overflow-hidden rounded-[1.1rem] bg-white">
          <div className="flex items-center justify-between gap-2 bg-paper-soft px-3 py-2">
            <Smartphone size={12} className="shrink-0 text-accent" />
            <span className="truncate text-[10px] font-bold text-ink">
              Mon App
            </span>
            <span className="shrink-0 text-[9px] text-muted">9:41</span>
          </div>
          <div className="min-h-[168px] p-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.28 }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-accent">
                  Écran {screen + 1}/3
                </p>
                <p className="mt-2 text-sm font-bold text-ink">
                  {screens[screen].title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {screens[screen].body}
                </p>
                <div className="mt-4 space-y-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full ${
                        i <= screen ? "bg-accent" : "bg-paper-mute"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function WebappDemo() {
  const reduce = useReducedMotion();
  const bars = [42, 68, 55, 80, 62, 90, 74];

  return (
    <DemoShell eyebrow="Dashboard">
      <div className="mb-3 flex min-w-0 items-center gap-2">
        <span className="shrink-0 rounded-md bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">
          Live
        </span>
        <span className="truncate text-xs text-muted">Activité 7 jours</span>
      </div>
      <div className="flex h-24 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="min-w-0 flex-1 rounded-t-md bg-accent/80"
            initial={{ height: 8 }}
            animate={{ height: `${h}%` }}
            transition={{
              duration: 1.1,
              delay: reduce ? 0 : i * 0.07,
              repeat: reduce ? 0 : Infinity,
              repeatType: "mirror",
              repeatDelay: 1.6,
            }}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { k: "Users", v: "128" },
          { k: "RDV", v: "34" },
          { k: "CA", v: "12k" },
        ].map((item) => (
          <div
            key={item.k}
            className="min-w-0 rounded-lg bg-paper-soft px-2 py-2 text-center"
          >
            <p className="truncate text-[10px] text-muted">{item.k}</p>
            <p className="truncate text-sm font-bold text-ink">{item.v}</p>
          </div>
        ))}
      </div>
    </DemoShell>
  );
}

function RdvDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const slots = ["09:00", "10:30", "14:00", "16:30"];
  const days = [
    { d: "Lun", n: 10 },
    { d: "Mar", n: 11 },
    { d: "Mer", n: 12 },
    { d: "Jeu", n: 13 },
    { d: "Ven", n: 14 },
  ];

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % 4), 1500);
    return () => window.clearInterval(id);
  }, [reduce]);

  const dayActive = step >= 1;
  const slotActive = step >= 2;
  const done = step >= 3;

  return (
    <DemoShell eyebrow="Agenda">
      <div className="mb-3 flex min-w-0 items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-ink">Cette semaine</p>
        <span className="shrink-0 text-[11px] text-muted">Mars 2026</span>
      </div>

      <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
        {days.map((day, i) => {
          const active = dayActive && i === 2;
          return (
            <motion.div
              key={day.d}
              animate={{
                backgroundColor: active ? "#1F5EFF" : "#F5F8FC",
                color: active ? "#FFFFFF" : "#0B1F3A",
              }}
              className="min-w-0 rounded-xl px-0.5 py-2 text-center sm:px-1 sm:py-2.5"
            >
              <p className="truncate text-[9px] opacity-70 sm:text-[10px]">
                {day.d}
              </p>
              <p className="mt-0.5 text-sm font-bold">{day.n}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {slots.map((slot, i) => {
          const active = slotActive && i === 1;
          return (
            <motion.div
              key={slot}
              animate={{
                borderColor: active ? "#1F5EFF" : "rgba(11,31,58,0.1)",
                backgroundColor: active ? "#E8F0FF" : "#FFFFFF",
              }}
              className="rounded-lg border px-2 py-2 text-center text-xs font-semibold text-ink"
            >
              {slot}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl bg-paper-soft px-3 py-2.5 text-xs">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="truncate"
          >
            {!dayActive && (
              <span className="text-muted">Choisissez un jour…</span>
            )}
            {dayActive && !slotActive && (
              <span className="font-semibold text-ink">
                Mer. 12 — choisir un créneau
              </span>
            )}
            {slotActive && !done && (
              <span className="font-semibold text-accent">
                Confirmation en cours…
              </span>
            )}
            {done && (
              <span className="font-semibold text-ink">
                ✓ RDV 12 mars · 10:30 — rappel envoyé
              </span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </DemoShell>
  );
}

function FideliteDemo() {
  const reduce = useReducedMotion();
  const [points, setPoints] = useState(6);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setPoints((p) => (p >= 10 ? 3 : p + 1));
    }, 1100);
    return () => window.clearInterval(id);
  }, [reduce]);

  const reward = points >= 10;

  return (
    <DemoShell eyebrow="Wallet">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-ink-soft p-4 text-white">
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/60">
          Carte fidélité
        </p>
        <p className="mt-2 truncate font-display text-lg tracking-tight sm:text-xl">
          Boutique locale
        </p>
        <div className="mt-4 flex gap-1 sm:gap-1.5">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.span
              key={i}
              animate={{
                backgroundColor:
                  i < points ? "#1F5EFF" : "rgba(255,255,255,0.2)",
                scale: i === points - 1 ? 1.1 : 1,
              }}
              transition={{ duration: 0.25 }}
              className="h-2.5 min-w-0 flex-1 rounded-full"
            />
          ))}
        </div>
        <p className="mt-3 truncate text-sm text-white/80">
          {reward
            ? "Récompense débloquée"
            : `${points}/10 — encore un passage`}
        </p>
      </div>
      <div className="mt-3 min-h-[1.25rem] text-center">
        <AnimatePresence>
          {reward ? (
            <motion.p
              key="reward"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs font-semibold text-accent"
            >
              −20 % offerts sur la prochaine visite
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </DemoShell>
  );
}

export function FeatureMotion({ id, className = "" }: Props) {
  return (
    <div className={`mx-auto w-full max-w-md min-w-0 ${className}`}>
      {id === "paiement" && <PaiementDemo />}
      {id === "app" && <AppDemo />}
      {id === "webapp" && <WebappDemo />}
      {id === "rdv" && <RdvDemo />}
      {id === "fidelite" && <FideliteDemo />}
    </div>
  );
}

export function FeatureDemo(props: Props) {
  return <FeatureMotion {...props} />;
}
