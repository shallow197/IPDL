"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, X, Printer, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import type { DBSignature } from "@/lib/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface VerifyResult {
  valid: boolean;
  signature: DBSignature;
  message: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function AttestationDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/signatures/verify/${encodeURIComponent(id)}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setResult)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
        Chargement de l&apos;attestation…
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-400">
        <X className="h-8 w-8 text-red-500" />
        <p className="text-sm">Attestation introuvable ou inaccessible.</p>
        <Link href="/attestations" className="text-xs text-blue-400 underline">
          Retour aux attestations
        </Link>
      </div>
    );
  }

  const sig = result.signature;
  const payload = (() => {
    try {
      const parsed = JSON.parse(sig.signedData);
      return parsed.payload ?? {};
    } catch {
      return {};
    }
  })();

  const attestationText: string = payload.text ?? sig.targetLabel;
  const shortSig = sig.signatureHex?.slice(0, 32) + "…" + sig.signatureHex?.slice(-16);
  const shortPk = sig.publicKeyHex?.slice(0, 24) + "…" + sig.publicKeyHex?.slice(-8);
  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/signatures/verify/${sig.id}`;

  return (
    <>
      {/* CSS print global */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-container { max-width: 700px; margin: 0 auto; padding: 40px 20px; }
          .print-border { border: 2px solid #1e3a5f !important; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

        {/* Barre de navigation — masquée à l'impression */}
        <div className="no-print border-b border-slate-900 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto">
          <Link
            href="/attestations"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Mes attestations
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600/10 border border-blue-900/30 px-4 py-2 text-xs font-bold text-blue-400 hover:bg-blue-600/20 transition-all"
          >
            <Printer className="h-3.5 w-3.5" /> Imprimer / PDF
          </button>
        </div>

        {/* Attestation — zone imprimable */}
        <div className="print-container max-w-3xl mx-auto px-4 py-10 sm:px-6">

          {/* Validité */}
          <div className={`no-print mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            result.valid
              ? "border-green-700/40 bg-green-500/5 text-green-400"
              : "border-red-700/40 bg-red-500/5 text-red-400"
          }`}>
            {result.valid
              ? <CheckCircle2 className="h-4 w-4 flex-none" />
              : <AlertCircle className="h-4 w-4 flex-none" />}
            <span className="font-semibold">{result.message}</span>
          </div>

          {/* Document officiel */}
          <div className="print-border rounded-2xl border border-slate-700 bg-slate-900/30 overflow-hidden">

            {/* En-tête UMMISCO */}
            <div className="bg-slate-900/50 border-b border-slate-800 px-8 py-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-blue-400 mb-1">
                  UMI 209 — IRD / Sorbonne Université
                </p>
                <h1 className="text-lg font-extrabold text-white">UMMISCO</h1>
                <p className="text-[11px] text-slate-400">
                  Unité de Modélisation Mathématique et Informatique des Systèmes Complexes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            {/* Corps */}
            <div className="px-8 py-8 space-y-6">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-2">
                  Attestation numérique signée
                </p>
                <h2 className="text-xl font-bold text-white">{sig.targetLabel}</h2>
              </div>

              <hr className="border-slate-800" />

              {/* Texte de l'attestation */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-6">
                <p className="text-sm text-slate-300 leading-7 text-justify">
                  {attestationText}
                </p>
              </div>

              {/* Métadonnées */}
              <div className="grid gap-4 sm:grid-cols-2 text-[11px]">
                <div className="space-y-1">
                  <p className="text-slate-600 uppercase tracking-wider font-bold">Signataire</p>
                  <p className="text-slate-200 font-semibold">{sig.signerName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-600 uppercase tracking-wider font-bold">Date de signature</p>
                  <p className="text-slate-200 font-semibold">{formatDate(sig.timestamp)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-600 uppercase tracking-wider font-bold">Identifiant</p>
                  <p className="font-mono text-slate-400 break-all">{sig.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-600 uppercase tracking-wider font-bold">Algorithme</p>
                  <p className="text-slate-400">Ed25519 (TweetNaCl)</p>
                </div>
              </div>

              <hr className="border-slate-800" />

              {/* Données cryptographiques */}
              <div className="space-y-3 text-[10px]">
                <p className="text-slate-600 uppercase tracking-widest font-bold">
                  Données de vérification
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-600 font-bold w-20 flex-none">Signature</span>
                    <span className="font-mono text-slate-500 break-all leading-relaxed">
                      {shortSig}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-600 font-bold w-20 flex-none">Clé pub.</span>
                    <span className="font-mono text-slate-500 break-all leading-relaxed">
                      {shortPk}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/30 px-3 py-2">
                  <span className="text-slate-600 font-bold flex-none">URL vérif.</span>
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 transition-colors inline-flex items-center gap-1 break-all"
                  >
                    {verifyUrl} <ExternalLink className="h-2.5 w-2.5 flex-none" />
                  </a>
                </div>
              </div>
            </div>

            {/* Pied de page */}
            <div className="border-t border-slate-800 bg-slate-900/30 px-8 py-4 flex items-center justify-between text-[9px] text-slate-600">
              <span>Document généré par le portail UMMISCO · ummisco.fr</span>
              <span className={`font-bold ${result.valid ? "text-green-500" : "text-red-500"}`}>
                {result.valid ? "✓ SIGNATURE VALIDE" : "✗ SIGNATURE INVALIDE"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
