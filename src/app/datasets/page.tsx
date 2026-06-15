"use client";

import React, { useState, useEffect } from "react";
import { Download, Lock, Eye, Shield, Filter, Database, Loader2, KeyRound, Send, X, Check } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useNotification } from "@/context/NotificationContext";
import type { DBDataset } from "@/lib/db";

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

export default function DatasetsPage() {
  const { isAuthenticated, token } = useAuth();
  const { t } = useLang();
  const { notify } = useNotification();

  const [datasets, setDatasets] = useState<DBDataset[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  // ACL access request flow
  const [requestModal, setRequestModal] = useState<DBDataset | null>(null);
  const [requestReason, setRequestReason] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

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

  useEffect(() => {
    fetch("/api/datasets", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => setDatasets(d))
      .catch(() => setDatasets([]))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = filter === "all" ? datasets : datasets.filter((d) => d.acces === filter);

  const handleDownload = async (ds: DBDataset) => {
    setDownloading(ds.id);
    try {
      const res = await fetch(`/api/datasets/${ds.id}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const text = await res.text();
        notify(text || "Téléchargement refusé.", "error");
        return;
      }

      // Extract filename from Content-Disposition header
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
      setDatasets((prev) =>
        prev.map((d) => d.id === ds.id ? { ...d, downloads: d.downloads + 1 } : d)
      );
    } finally {
      setDownloading(null);
    }
  };

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

        {/* Filter bar */}
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
                          {t("datasets.createdBy")} · {ds.dateDepot}
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
                        Type : <strong className="text-slate-400">{ds.type.toUpperCase()}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Licence : <strong className="text-slate-400">{ds.licence}</strong>
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
                          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Préparation...</>
                        ) : (
                          <><Download className="h-3.5 w-3.5" /> {t("datasets.download")}</>
                        )}
                      </button>
                    ) : requestedIds.includes(ds.id) ? (
                      <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                        <Check className="h-3 w-3" /> Demande envoyée
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
                </div>
              );
            })}

            {filtered.length === 0 && !loading && (
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
                  <h3 className="text-sm font-bold text-white">Demander l&apos;accès</h3>
                  <p className="text-[10px] text-slate-500">Soumis au directeur (modèle ACL)</p>
                </div>
              </div>
              <button onClick={() => setRequestModal(null)} className="text-slate-500 hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 mb-4">
              <p className="text-xs font-semibold text-slate-200 leading-snug">{requestModal.titre}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">
                Niveau : {t(`datasets.${requestModal.acces}`)}
              </p>
            </div>

            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
              Motif de la demande
            </label>
            <textarea
              rows={4}
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="Décrivez votre projet de recherche et pourquoi cet accès vous est nécessaire…"
              className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50 resize-none"
            />

            <button
              onClick={submitAccessRequest}
              disabled={!requestReason.trim() || requestSubmitting}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all"
            >
              {requestSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Envoi…</>
              ) : (
                <><Send className="h-3.5 w-3.5" /> Soumettre la demande</>
              )}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
