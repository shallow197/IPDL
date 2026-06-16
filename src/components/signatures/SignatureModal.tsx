"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Key, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSignature, type SignPayload } from "@/hooks/useSignature";
import { useNotification } from "@/context/NotificationContext";

interface Props {
  payload: SignPayload;
  onClose: () => void;
  onSigned: (sigId: string, timestamp: string) => void;
}

export default function SignatureModal({ payload, onClose, onSigned }: Props) {
  const { user } = useAuth();
  const { sign, signing } = useSignature();
  const { notify } = useNotification();
  const [firstUse, setFirstUse] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!user) return;
    const hasKey = !!localStorage.getItem(`ummisco_sig_sk_${user.id}`);
    setFirstUse(!hasKey);
  }, [user]);

  const typeLabels: Record<string, string> = {
    profile: "Profil chercheur",
    dataset: "Dataset",
    publication: "Publication",
    attestation: "Attestation",
  };

  const typeDescriptions: Record<string, string> = {
    profile:
      "Vous certifiez que les informations de ce profil sont exactes et à jour.",
    dataset:
      "Vous certifiez être l'auteur et le dépositaire légitime de ce dataset.",
    publication:
      "Vous certifiez avoir contribué à cette publication en tant qu'auteur.",
    attestation:
      "Vous générez une attestation officielle signée cryptographiquement.",
  };

  const handleSign = async () => {
    if (!confirmed) return;
    try {
      const { id, timestamp } = await sign(payload);
      notify("Document signé avec succès.", "success");
      onSigned(id, timestamp);
      onClose();
    } catch (e) {
      notify(
        e instanceof Error ? e.message : "Erreur lors de la signature.",
        "error"
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">Signature électronique</h2>
              <p className="text-[11px] text-slate-500">{typeLabels[payload.type]}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Cible */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">
              Document à signer
            </p>
            <p className="text-sm font-semibold text-slate-200 leading-snug">
              {payload.targetLabel}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 leading-relaxed">
            {typeDescriptions[payload.type]}
          </p>

          {/* Avertissement première utilisation */}
          {firstUse && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-800/40 bg-amber-500/5 p-3">
              <Key className="h-4 w-4 text-amber-400 flex-none mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-400 mb-0.5">
                  Première utilisation — Nouvelle clé cryptographique
                </p>
                <p className="text-[11px] text-amber-300/70 leading-relaxed">
                  Une paire de clés Ed25519 sera générée et stockée dans votre
                  navigateur. La clé privée ne quitte jamais votre appareil.
                </p>
              </div>
            </div>
          )}

          {/* Signataire */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-slate-600">Signé par :</span>
            <span className="font-semibold text-slate-300">{user?.nom}</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-500">{user?.email}</span>
          </div>

          {/* Checkbox confirmation */}
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <div className="mt-0.5 flex-none">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`h-4 w-4 rounded border transition-all ${
                  confirmed
                    ? "bg-blue-600 border-blue-600"
                    : "border-slate-600 bg-slate-800 group-hover:border-slate-500"
                } flex items-center justify-center`}
              >
                {confirmed && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
            </div>
            <span className="text-[11px] text-slate-400 leading-relaxed">
              Je confirme avoir vérifié les informations et je signe ce document
              de manière irréversible sous ma seule responsabilité.
            </span>
          </label>

          {/* Avertissement irréversibilité */}
          <div className="flex items-start gap-2 text-[10px] text-slate-600">
            <AlertTriangle className="h-3 w-3 flex-none mt-0.5" />
            <span>
              La signature est permanente et horodatée. L&apos;historique complet est
              conservé.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSign}
            disabled={!confirmed || signing}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {signing ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Signature en cours…</>
            ) : (
              <><ShieldCheck className="h-3.5 w-3.5" /> Signer</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
