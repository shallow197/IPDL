"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Lock, Eye, Shield, Filter, Database, Loader2, KeyRound, Send, X, Check, ShieldCheck, Users, Calendar } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useNotification } from "@/context/NotificationContext";
import type { DBDataset } from "@/lib/db";
import { DATASETS, RESEARCHERS } from "@/data/ummiscoData";
import SignatureModal from "@/components/signatures/SignatureModal";
import SignatureBadge from "@/components/signatures/SignatureBadge";
import type { SignPayload } from "@/hooks/useSignature";

const ACCESS_COLORS: Record<string, string> = {
  public:    "bg-green-500/10 text-green-400 border-green-900/30",
  protected: "bg-blue-500/10 text-blue-400 border-blue-900/30",
  private:   "bg-red-500/10 text-red-400 border-red-900/30",
};

const ACCESS_ICONS: Record<string, React.ElementType> = {
  public:    Eye,
  protected: Lock,
  private:   Shield,
};

// Unified display type for both static and DB datasets
interface DisplayDataset {
  id: string;
  titre: string;
  description: string;
  type: string;
  licence: string;
  acces: "public" | "protected" | "private";
  creatorId: string;
  creatorName: string;
  size: string;
  downloads: number;
  dateDepot: string;
  isStatic: boolean;
}

function toDisplay(d: DBDataset): DisplayDataset {
  return {
    id: d.id,
    titre: d.titre,
    description: d.description,
    type: d.type,
    licence: d.licence,
    acces: d.acces,
    creatorId: d.creatorId,
    creatorName: d.creatorName ?? d.creatorId,
    size: d.size,
    downloads: d.downloads,
    dateDepot: d.dateDepot,
    isStatic: false,
  };
}

function staticToDisplay(d: typeof DATASETS[number]): DisplayDataset {
  const researcher = RESEARCHERS.find((r) => r.id === d.creatorId);
  return {
    id: d.id,
    titre: d.title,
    description: d.description,
    type: d.type ?? "CSV",
    licence: d.licence ?? "CC BY 4.0",
    acces: d.accessLevel,
    creatorId: d.creatorId,
    creatorName: researcher?.name ?? d.creatorId,
    size: d.size,
    downloads: d.downloads,
    dateDepot: `${d.year}-01-01`,
    isStatic: true,
  };
}

function DatasetsContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated, token, user } = useAuth();
  const { t } = useLang();
  const { notify } = useNotification();

  const [dbDatasets, setDbDatasets] = useState<DBDataset[]>([]);
  const [filter, setFilter] = useState<string>(searchParams.get("acces") ?? "all");
  const [creatorFilter, setCreatorFilter] = useState<string>(searchParams.get("creator") ?? "all");
  const [yearFilter, setYearFilter] = useState<string>(searchParams.get("year") ?? "all");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  // ACL access request flow
  const [requestModal, setRequestModal] = useState<DisplayDataset | null>(null);
  const [requestReason, setRequestReason] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

  // Signature flow
  const [sigModal, setSigModal] = useState<SignPayload | null>(null);
  const [freshSigs, setFreshSigs] = useState<Record<string, { id: string; signerName: string; timestamp: string }>>({});

  useEffect(() => {
    fetch("/api/datasets", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.ok ? r.json() : [])
      .then((d: DBDataset[]) => setDbDatasets(d))
      .catch(() => setDbDatasets([]))
      .finally(() => setLoading(false));
  }, [token]);

  // Merge: DB datasets take priority; static ones shown only if not already in DB
  const dbIds = new Set(dbDatasets.map((d) => d.id));
  const staticDisplay = DATASETS
    .filter((d) => !dbIds.has(d.id))
    .map(staticToDisplay);
  const dbDisplay = dbDatasets.map(toDisplay);
  const allDatasets: DisplayDataset[] = [...staticDisplay, ...dbDisplay];

  // Creator and year options
  const creators = Array.from(
    allDatasets.reduce((map, d) => {
      if (!map.has(d.creatorId)) map.set(d.creatorId, d.creatorName);
      return map;
    }, new Map<string, string>())
  );

  const years = [...new Set(allDatasets.map((d) => d.dateDepot.substring(0, 4)))].sort(
    (a, b) => b.localeCompare(a)
  );

  const filtered = allDatasets.filter((d) => {
    if (filter !== "all" && d.acces !== filter) return false;
    if (creatorFilter !== "all" && d.creatorId !== creatorFilter) return false;
    if (yearFilter !== "all" && d.dateDepot.substring(0, 4) !== yearFilter) return false;
    return true;
  });

  const submitAccessRequest = async () => {
    if (!requestModal || !token || !requestReason.trim()) return;
    setRequestSubmitting(true);
    try {
      const res = await fetch("/api/acl/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          permission: requestModal.acces === "private" ? "data.read_private" : "data.read_protected",
          resourceLabel: `Dataset ${requestModal.acces} — ${requestModal.titre}`,
          reason: requestReason,
        }),
      });
      if (res.ok) {
        setRequestedIds((prev) => [...prev, requestModal.id]);
        setRequestModal(null);
        setRequestReason("");
        notify("Demande envoyée — le directeur vous répondra.", "info");
      } else {
        notify("Erreur lors de l'envoi de la demande.", "error");
      }
    } finally {
      setRequestSubmitting(false);
    }
  };

  const handleDownload = async (ds: DisplayDataset) => {
    setDownloading(ds.id);
    try {
      const res = await fetch(`/api/datasets/${ds.id}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const text = await res.text();
        notify(text || t("datasets.downloadDenied"), "error");
        return;
      }

      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match ? match[1] : `dataset_${ds.id}.csv`;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      notify("Téléchargement démarré.", "success");
    } finally {
      setDownloading(null);
    }
  };

  const selectClass =
    "rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 px-2 py-1.5 focus:outline-none focus:border-blue-500/50 cursor-pointer";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-slate-900 pb-8 mb-10">
          <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
            {t("datasets.sectionTag")}
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{t("datasets.title")}</h1>
          <p className="mt-2 text-slate-400 text-sm max-w-2xl">{t("datasets.description")}</p>
          <div aria-hidden className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
        </div>

        {/* Member & year filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <Users className="h-3 w-3" /> Auteur :
          </div>
          <select value={creatorFilter} onChange={(e) => setCreatorFilter(e.target.value)} className={selectClass}>
            <option value="all">Tous</option>
            {creators.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-3">
            <Calendar className="h-3 w-3" /> Année :
          </div>
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className={selectClass}>
            <option value="all">Toutes</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {(creatorFilter !== "all" || yearFilter !== "all" || filter !== "all") && (
            <button
              onClick={() => { setCreatorFilter("all"); setYearFilter("all"); setFilter("all"); }}
              className="ml-2 inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-red-400 transition-colors"
            >
              <X className="h-3 w-3" /> Réinitialiser
            </button>
          )}
        </div>

        {/* Access filter bar */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <Filter className="h-3 w-3" /> {t("datasets.filterAccess")} :
          </div>
          {["all", "public", "protected", "private"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-all ${
                filter === f
                  ? "bg-blue-600/20 text-blue-400 border-blue-900/40"
                  : "border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
              }`}
            >
              {f === "all" ? t("datasets.all") : t(`datasets.${f}`)}
            </button>
          ))}
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-blue-600/10 px-3 py-1.5 text-[10px] font-bold text-blue-400 border border-blue-900/30 hover:bg-blue-600/20 transition-all"
            >
              <Database className="h-3 w-3" /> {t("datasets.submit")}
            </Link>
          )}
        </div>

        {loading && (
          <div className="text-center py-20 text-slate-500 text-sm">{t("common.loading")}</div>
        )}

        {!loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((ds) => {
              const Icon = ACCESS_ICONS[ds.acces];
              const canDownload =
                ds.acces === "public" ||
                (isAuthenticated && ds.acces === "protected");
              const isDownloading = downloading === ds.id;
              const isOwner = !ds.isStatic && user?.id === ds.creatorId;

              return (
                <div
                  key={ds.id}
                  className="rounded-xl border border-slate-900 bg-slate-900/10 p-6 flex flex-col justify-between hover:border-slate-800 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-start border-b border-slate-900/60 pb-3 mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-white leading-snug">{ds.titre}</h3>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          {ds.creatorName} · {ds.dateDepot.substring(0, 4)}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider flex-none ml-2 ${ACCESS_COLORS[ds.acces]}`}
                      >
                        <Icon className="h-2.5 w-2.5" />
                        {t(`datasets.${ds.acces}`)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{ds.description}</p>

                    <div className="flex flex-wrap gap-2 text-[9px] text-slate-500">
                      <span>
                        {t("common.type")} : <strong className="text-slate-400">{ds.type.toUpperCase()}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        {t("common.licence")} : <strong className="text-slate-400">{ds.licence}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {ds.size} · {ds.downloads} {t("datasets.downloads")}
                    </span>

                    {canDownload ? (
                      <button
                        onClick={() => handleDownload(ds)}
                        disabled={isDownloading}
                        className="inline-flex items-center gap-1.5 rounded bg-green-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-green-700 active:scale-95 disabled:opacity-70 transition-all"
                      >
                        {isDownloading ? (
                          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("datasets.preparing")}</>
                        ) : (
                          <><Download className="h-3.5 w-3.5" /> {t("datasets.download")}</>
                        )}
                      </button>
                    ) : requestedIds.includes(ds.id) ? (
                      <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                        <Check className="h-3 w-3" /> {t("datasets.accessRequested")}
                      </span>
                    ) : isAuthenticated ? (
                      <button
                        onClick={() => { setRequestModal(ds); setRequestReason(""); }}
                        className="inline-flex items-center gap-1.5 rounded bg-amber-500/10 border border-amber-900/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 hover:bg-amber-500/20 transition-all"
                      >
                        <KeyRound className="h-3 w-3" /> Demander l&apos;accès
                      </button>
                    ) : (
                      <Link
                        href="/connexion"
                        className="inline-flex items-center gap-1.5 rounded bg-slate-900 border border-slate-800 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-all"
                      >
                        <Lock className="h-3 w-3" />
                        {t("datasets.authRequired")}
                      </Link>
                    )}
                  </div>

                  {/* Signature (créateur DB uniquement) */}
                  {isOwner && (
                    <div className="mt-3 pt-3 border-t border-slate-900/50 flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSigModal({
                          type: "dataset",
                          targetId: ds.id,
                          targetLabel: ds.titre,
                          data: {
                            titre: ds.titre,
                            description: ds.description,
                            type: ds.type,
                            licence: ds.licence,
                            size: ds.size,
                            dateDepot: ds.dateDepot,
                          },
                        })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-800/40 bg-blue-600/10 px-2.5 py-1 text-[10px] font-bold text-blue-400 hover:bg-blue-600/20 transition-all"
                      >
                        <ShieldCheck className="h-3 w-3" /> Signer ce dataset
                      </button>
                      <SignatureBadge targetId={ds.id} freshSignature={freshSigs[ds.id]} compact />
                    </div>
                  )}

                  {!isOwner && !ds.isStatic && (
                    <div className="mt-3">
                      <SignatureBadge targetId={ds.id} compact />
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-2 rounded-xl border border-slate-900 border-dashed p-12 text-center text-slate-500 text-xs">
                {t("common.noData")}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Access request modal */}
      {requestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setRequestModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 flex-none">
                  <KeyRound className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">{t("datasets.requestAccess")}</h3>
                  <p className="text-[10px] text-slate-500">{t("datasets.aclNote")}</p>
                </div>
              </div>
              <button onClick={() => setRequestModal(null)} className="text-slate-500 hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 mb-4">
              <p className="text-xs font-semibold text-slate-200 leading-snug">{requestModal.titre}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">
                {t("common.level")} : {t(`datasets.${requestModal.acces}`)}
              </p>
            </div>

            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              {t("datasets.requestReason")}
            </label>
            <textarea
              rows={4}
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder={t("datasets.reasonPlaceholder")}
              className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50 resize-none"
            />

            <button
              onClick={submitAccessRequest}
              disabled={!requestReason.trim() || requestSubmitting}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all"
            >
              {requestSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {t("common.sending")}</>
              ) : (
                <><Send className="h-3.5 w-3.5" /> {t("datasets.submitRequest")}</>
              )}
            </button>
          </div>
        </div>
      )}

      <Footer />

      {sigModal && (
        <SignatureModal
          payload={sigModal}
          onClose={() => setSigModal(null)}
          onSigned={(sigId, timestamp) => {
            setFreshSigs((prev) => ({
              ...prev,
              [sigModal.targetId]: { id: sigId, signerName: user?.nom ?? "", timestamp },
            }));
          }}
        />
      )}
    </div>
  );
}

export default function DatasetsPage() {
  return (
    <Suspense>
      <DatasetsContent />
    </Suspense>
  );
}
