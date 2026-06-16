"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  ChevronRight,
  Loader2,
  ExternalLink,
  Download,
} from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useSignature } from "@/hooks/useSignature";
import { useNotification } from "@/context/NotificationContext";
import { PROJECTS } from "@/data/ummiscoData";
import type { DBSignature, DBPublication, DBDataset } from "@/lib/db";

// ─── Types d'attestation disponibles ─────────────────────────────────────────

const ATTESTATION_TYPES = [
  {
    id: "membre_unite",
    label: "Membre de l'unité UMMISCO",
    description:
      "Atteste de votre appartenance active à l'UMI 209 UMMISCO.",
    icon: "🏛️",
  },
  {
    id: "contribution_projet",
    label: "Contribution à un projet",
    description:
      "Atteste de votre rôle dans un projet de recherche UMMISCO.",
    icon: "🔬",
  },
  {
    id: "auteur_publication",
    label: "Auteur d'une publication",
    description: "Certifie votre contribution à une publication scientifique.",
    icon: "📄",
  },
  {
    id: "depot_dataset",
    label: "Dépôt d'un dataset",
    description:
      "Certifie que vous êtes le dépositaire légitime d'un jeu de données.",
    icon: "🗄️",
  },
] as const;

type AttestationType = (typeof ATTESTATION_TYPES)[number]["id"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function AttestationsPage() {
  const { user, token, isAuthenticated } = useAuth();
  const { sign, signing } = useSignature();
  const { notify } = useNotification();

  const [selectedType, setSelectedType] = useState<AttestationType>("membre_unite");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [mySignatures, setMySignatures] = useState<DBSignature[]>([]);
  const [loadingSigs, setLoadingSigs] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Publications et datasets de l'utilisateur courant
  const [myPubs, setMyPubs] = useState<DBPublication[]>([]);
  const [myDatasets, setMyDatasets] = useState<DBDataset[]>([]);

  // Charger les attestations + publications + datasets de l'utilisateur
  useEffect(() => {
    if (!token) return;

    setLoadingSigs(true);
    fetch("/api/signatures", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) =>
        setMySignatures(
          Array.isArray(data)
            ? data.filter((s: DBSignature) => s.type === "attestation")
            : []
        )
      )
      .catch(() => setMySignatures([]))
      .finally(() => setLoadingSigs(false));

    // Publications dont l'utilisateur est auteur
    fetch("/api/publications/mine", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setMyPubs(Array.isArray(data) ? data : []))
      .catch(() => setMyPubs([]));

    // Datasets déposés par l'utilisateur
    fetch("/api/datasets", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data: DBDataset[]) =>
        setMyDatasets(Array.isArray(data) ? data.filter((d) => d.creatorId === user?.id) : [])
      )
      .catch(() => setMyDatasets([]));
  }, [token, user?.id]);

  const projectOptions = PROJECTS.map((p) => ({ id: p.id, label: p.name }));

  const getSubjectOptions = (): { id: string; label: string }[] => {
    if (selectedType === "contribution_projet") return projectOptions;
    if (selectedType === "auteur_publication")
      return myPubs.map((p) => ({ id: p.id, label: p.titre }));
    if (selectedType === "depot_dataset")
      return myDatasets.map((d) => ({ id: d.id, label: d.titre }));
    return [];
  };

  const buildAttestationText = (): string => {
    const name = user?.nom ?? "Chercheur";
    const date = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    switch (selectedType) {
      case "membre_unite":
        return `Je soussigné(e) ${name} atteste être membre actif de l'Unité Mixte Internationale UMI 209 UMMISCO (Unité de Modélisation Mathématique et Informatique des Systèmes Complexes, IRD / Sorbonne Université), en date du ${date}. ${details}`;
      case "contribution_projet":
        return `Je soussigné(e) ${name} atteste avoir contribué au projet de recherche "${subject}" dans le cadre des activités de l'UMI 209 UMMISCO, en date du ${date}. ${details}`;
      case "auteur_publication":
        return `Je soussigné(e) ${name} certifie être auteur(e) de la publication "${subject}", en date du ${date}. ${details}`;
      case "depot_dataset":
        return `Je soussigné(e) ${name} certifie être le(a) dépositaire légitime du dataset "${subject}" et que les données fournies sont conformes aux bonnes pratiques de la science ouverte, en date du ${date}. ${details}`;
      default:
        return "";
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    if (
      (selectedType !== "membre_unite") &&
      !subject.trim()
    ) {
      notify("Veuillez renseigner le sujet de l'attestation.", "error");
      return;
    }

    setGenerating(true);
    try {
      const text = buildAttestationText();
      const attestationId = `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const label =
        ATTESTATION_TYPES.find((t) => t.id === selectedType)?.label ?? selectedType;

      const { id, timestamp } = await sign({
        type: "attestation",
        targetId: attestationId,
        targetLabel: label,
        data: {
          attestationType: selectedType,
          subject: subject || "N/A",
          details,
          text,
          signerName: user.nom,
          signerEmail: user.email,
        },
      });

      notify("Attestation générée et signée.", "success");

      // Reload signatures
      if (token) {
        const res = await fetch("/api/signatures", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMySignatures(
          Array.isArray(data) ? data.filter((s: DBSignature) => s.type === "attestation") : []
        );
      }

      // Redirect to attestation detail
      window.location.href = `/attestations/${id}`;
    } catch {
      notify("Erreur lors de la génération.", "error");
    } finally {
      setGenerating(false);
    }
  };

  // ─── Rendu ──────────────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShieldCheck className="h-12 w-12 text-blue-500 mx-auto" />
            <h1 className="text-xl font-bold text-white">Attestations numériques</h1>
            <p className="text-sm text-slate-400">
              Connectez-vous pour générer des attestations signées.
            </p>
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-all"
            >
              Se connecter
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const subjectOptions = getSubjectOptions();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="border-b border-slate-900 pb-8 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Signatures cryptographiques
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Attestations numériques</h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Générez des attestations officielles signées par votre clé privée Ed25519.
            Chaque signature est vérifiable cryptographiquement par n&apos;importe qui.
          </p>
          <div aria-hidden className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* Formulaire de génération */}
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              Nouvelle attestation
            </h2>

            {/* Types */}
            <div className="grid gap-3 sm:grid-cols-2">
              {ATTESTATION_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setSelectedType(type.id); setSubject(""); }}
                  className={`text-left rounded-xl border p-4 transition-all ${
                    selectedType === type.id
                      ? "border-blue-600/50 bg-blue-600/10"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/20"
                  }`}
                >
                  <div className="text-xl mb-1.5">{type.icon}</div>
                  <p className="text-xs font-bold text-slate-200 leading-snug">{type.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Sujet (optionnel pour "membre") */}
            {selectedType !== "membre_unite" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {selectedType === "contribution_projet" && "Projet"}
                  {selectedType === "auteur_publication" && "Ma publication"}
                  {selectedType === "depot_dataset" && "Mon dataset"}
                </label>

                {subjectOptions.length > 0 ? (
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">-- Sélectionner --</option>
                    {subjectOptions.map((opt) => (
                      <option key={opt.id} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : selectedType === "auteur_publication" ? (
                  <p className="text-xs text-slate-500 italic border border-slate-800 rounded-lg px-3 py-2.5 bg-slate-900/30">
                    Vous n&apos;avez pas encore de publications enregistrées sur le portail.
                    Déposez-en une depuis votre tableau de bord.
                  </p>
                ) : selectedType === "depot_dataset" ? (
                  <p className="text-xs text-slate-500 italic border border-slate-800 rounded-lg px-3 py-2.5 bg-slate-900/30">
                    Vous n&apos;avez pas encore de datasets déposés sur le portail.
                    Déposez-en un depuis votre tableau de bord.
                  </p>
                ) : (
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Intitulé du projet…"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                )}
              </div>
            )}

            {/* Détails optionnels */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Précisions (optionnel)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Rôle spécifique, période, contexte supplémentaire…"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Aperçu */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">
                Aperçu du texte signé
              </p>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                {buildAttestationText()}
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || signing}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {generating || signing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Génération…</>
              ) : (
                <><ShieldCheck className="h-4 w-4" /> Générer et signer</>
              )}
            </button>
          </div>

          {/* Mes attestations */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="h-4 w-4 text-slate-500" />
              Mes attestations signées
              {mySignatures.length > 0 && (
                <span className="ml-auto text-[11px] font-semibold text-slate-500">
                  {mySignatures.length}
                </span>
              )}
            </h2>

            {loadingSigs && (
              <div className="flex justify-center py-8 text-slate-600">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}

            {!loadingSigs && mySignatures.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-600">
                Aucune attestation générée pour l&apos;instant.
              </div>
            )}

            <div className="space-y-3">
              {mySignatures.map((sig) => {
                const data = (() => {
                  try { return JSON.parse(sig.signedData); } catch { return {}; }
                })();
                return (
                  <div
                    key={sig.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/20 p-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-200 leading-snug">
                          {sig.targetLabel}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {formatDate(sig.timestamp)}
                        </p>
                      </div>
                      <span className="flex-none inline-flex items-center gap-1 rounded-full border border-green-700/40 bg-green-500/10 px-2 py-0.5 text-[9px] font-bold text-green-400">
                        <ShieldCheck className="h-2.5 w-2.5" /> Signé
                      </span>
                    </div>

                    {data?.payload?.text && (
                      <p className="mt-2 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {data.payload.text}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-3">
                      <Link
                        href={`/attestations/${sig.id}`}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Voir / Imprimer <ChevronRight className="h-3 w-3" />
                      </Link>
                      <a
                        href={`/api/signatures/verify/${sig.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
                      >
                        Vérifier <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
