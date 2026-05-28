"use client";

import { useState } from "react";
import Confetti from "./Confetti";

type MobileMoneySimulatorProps = {
  methodId: string;
  methodLabel: string;
  amount: string;
  onSuccess: () => void;
  onCancel: () => void;
};

type PaymentStep = "phone" | "network-wait" | "pin-dialog" | "success";

export default function MobileMoneySimulator({
  methodId,
  methodLabel,
  amount,
  onSuccess,
  onCancel,
}: MobileMoneySimulatorProps) {
  const [step, setStep] = useState<PaymentStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [confettiActive, setConfettiActive] = useState(false);

  // Logo operator colors
  const isTMoney = methodId === "tmoney";
  const operatorColorClass = isTMoney
    ? "from-yellow-400 to-amber-500 text-slate-900 border-yellow-300"
    : "from-blue-600 to-indigo-700 text-white border-blue-400";
  
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone number: toggle check for Togolese formats (8 or 9 digits)
    const rawDigits = phoneNumber.replace(/\s+/g, "");
    if (!/^\+?228?\d{8}$|^\d{8}$/.test(rawDigits)) {
      setError("Veuillez saisir un numéro de téléphone valide à 8 chiffres (ex: 90123456).");
      return;
    }

    setStep("network-wait");
    setTimeout(() => {
      setStep("pin-dialog");
    }, 2000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError("Le code PIN doit comporter 4 chiffres.");
      return;
    }

    setStep("network-wait");
    
    // Simulate payment validation network delay
    setTimeout(() => {
      setStep("success");
      setConfettiActive(true);
      
      // Stop confetti and trigger main success after celebration
      setTimeout(() => {
        onSuccess();
      }, 3500);
    }, 2200);
  };

  return (
    <div className="glass-card grid-glow max-w-lg mx-auto rounded-[2rem] overflow-hidden p-6 md:p-8">
      {/* Confetti Explosion Component */}
      <Confetti active={confettiActive} />

      {/* Header with Sim Logo */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-cyan-200">Passerelle de Paiement</span>
          <h2 className="text-2xl font-bold text-white mt-1">Lomé Money Gateway</h2>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-md bg-gradient-to-r ${operatorColorClass}`}>
          {methodLabel}
        </div>
      </div>

      {step === "phone" && (
        <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-6">
          <div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pour recharger votre compte de <strong className="text-white">{amount}</strong> avec <strong className="text-cyan-300">{methodLabel}</strong>, veuillez saisir votre numéro de compte mobile money.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Numéro de téléphone Togo (+228)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold border-r border-white/10 pr-3">
                +228
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d+]/g, ""))}
                placeholder="90 12 34 56"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/50 py-4 pl-20 pr-5 text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-lg tracking-wider"
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Formats acceptés : T-Money (90/91/92/93/70...) ou Flooz (96/97/98/99...).
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className={`flex-1 rounded-full bg-gradient-to-r ${isTMoney ? "from-yellow-500 to-amber-500 text-slate-950 font-bold" : "from-violet-600 to-cyan-400 text-white font-semibold"} py-3.5 hover:scale-[1.02] shadow-[0_8px_25px_rgba(2,6,23,0.3)]`}
            >
              Envoyer la Demande
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-white/10 px-6 py-3.5 text-sm font-medium text-slate-300 hover:border-red-400/50 hover:bg-red-400/5"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {step === "network-wait" && (
        <div className="mt-8 py-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative flex items-center justify-center h-20 w-20">
            <div className={`absolute inset-0 rounded-full border-4 border-white/5 border-t-cyan-400 animate-spin`} />
            <div className="h-10 w-10 text-cyan-200 opacity-60">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.571V9a4 4 0 00-8 0v2.571a9.06 9.06 0 011.5 5.418m11.385-11.385a9.07 9.07 0 011.5 5.418v2.571c0 3.517-1.009 6.799-2.753 9.571m-3 0c-1.8 0-3.415-.836-4.478-2.132m0 0A13.949 13.949 0 0112 16.5c1.82 0 3.53.35 5.103.984m-9.582-.45c.44-.09.89-.14 1.348-.14a13.9 13.9 0 011.348.14M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white">Connexion aux serveurs {methodLabel}...</h4>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Simulation d&apos;envoi du paquet USSD à Lomé. Veuillez garder votre téléphone de test à proximité.
            </p>
          </div>
        </div>
      )}

      {step === "pin-dialog" && (
        <form onSubmit={handlePinSubmit} className="mt-6 space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
            <strong>SIMULATION USSD :</strong> Le réseau {methodLabel} a envoyé une demande de confirmation. Veuillez entrer votre code PIN de démonstration à 4 chiffres (ex: 1234) pour confirmer le débit fictif.
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">
              Saisir le Code PIN Secret
            </label>
            <div className="flex justify-center gap-3">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="••••"
                required
                className="w-32 text-center rounded-2xl border border-white/10 bg-slate-950/70 py-4 text-white text-3xl tracking-[0.4em] focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 py-3.5 font-semibold text-white hover:scale-[1.02] shadow-lg"
            >
              Confirmer le Paiement
            </button>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="rounded-full border border-white/10 px-6 py-3.5 text-sm font-medium text-slate-300 hover:border-slate-400"
            >
              Retour
            </button>
          </div>
        </form>
      )}

      {step === "success" && (
        <div className="mt-8 py-6 flex flex-col items-center justify-center text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <svg className="h-10 w-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-emerald-400">Recharge Réussie</span>
            <h4 className="text-2xl font-black text-white mt-1">{amount} Débloqués !</h4>
            <p className="text-xs text-slate-300 mt-3 max-w-sm mx-auto leading-relaxed">
              Le paiement de test a été validé avec succès par {methodLabel}. Vos Skill-Tokens ont été crédités.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
