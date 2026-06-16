"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Mail,
  BookOpen,
  Database,
  ExternalLink,
  Shield,
  Eye,
  Lock,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import {
  RESEARCHERS,
  PUBLICATION,
  DATASETS,
  AXES,
  CENTERS,
} from "@/data/ummiscoData";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import { scholarUrl } from "@/lib/scholar";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import SignatureModal from "@/components/signatures/SignatureModal";
import SignatureBadge from "@/components/signatures/SignatureBadge";
import type { DBDataset } from "@/lib/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ResearcherProfilePage({ params }: PageProps) {
  const { t } = useLang();
  const { id } = use(params);
  const { user, isAuthenticated, token } = useAuth();

  // Signature state
  const [showSigModal, setShowSigModal] = useState(false);
  const [freshSig, setFreshSig] = useState<{ id: string; signerName: string; timestamp: string } | null>(null);

  // DB datasets: keep all for deduplication, filter by researcher for display
  const [dbDatasets, setDbDatasets] = useState<DBDataset[]>([]);
  const [allDbIds, setAllDbIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    fetch("/api/datasets", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.ok ? r.json() : [])
      .then((all: DBDataset[]) => {
        setAllDbIds(new Set(all.map((d) => d.id)));
        setDbDatasets(all.filter((d) => d.creatorId === id));
      })
      .catch(() => {});
  }, [id, token]);

  // Find researcher
  const researcher = RESEARCHERS.find((r) => r.id === id);

  if (!researcher) {
    notFound();
  }

  // Directeur peut signer tous les profils, chercheur peut signer le sien
  const canSign = isAuthenticated && (
    user?.role === "directeur" ||
    (user?.role === "chercheur" && user?.id === researcher.id)
  );

  const sigPayload = {
    type: "profile" as const,
    targetId: researcher.id,
    targetLabel: researcher.name,
    data: {
      name: researcher.name,
      title: researcher.title,
      bio: researcher.bio,
      email: researcher.email ?? null,
      orcid: researcher.orcid ?? null,
      center: researcher.center,
      axes: researcher.axes,
    },
  };

  // Use researcher's publications if available, otherwise filter from global PUBLICATION
  const researcherPubs = researcher.publications ?
    researcher.publications.map(pub => ({
      id: `${researcher.id}-${pub.title.substring(0, 20).replace(/\s+/g, '-')}`,
      title: pub.title,
      authors: [],
      researcherIds: [researcher.id],
      year: pub.year || new Date().getFullYear(),
      axis: researcher.axes[0] || "agents",
      abstract: "",
      citationApa: "",
      citationBibtex: "",
      accessLevel: "public" as const,
      doi: undefined,
      journal: undefined,
    })) :
    PUBLICATION.filter((p) =>
      p.researcherIds.includes(researcher.id)
    );

  // Static datasets for this researcher (displayed before DB ones load)
  const staticDatasets = DATASETS.filter((d) => d.creatorId === researcher.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/equipe"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-8 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t("researcher.backToTeam")}</span>
        </Link>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-8 mb-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Photo */}
          <Avatar
            name={researcher.name}
            src={researcher.photoUrl}
            seed={researcher.avatarSeed}
            size={80}
            className="shadow-lg"
          />

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white">{researcher.name}</h1>
              <p className="text-sm text-slate-400 font-medium mt-1">{researcher.title}</p>
            </div>

            {/* Centre de rattachement */}
            {researcher.center && (() => {
              const center = CENTERS.find((c) => c.id === researcher.center);
              return center ? (
                <div className="inline-flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-[13px]">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">{t("researcher.center")}</span>
                  <span className="text-slate-300 font-semibold">{center.name}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500">{center.city}</span>
                </div>
              ) : null;
            })()}

            {/* ORCID ID Badge */}
            {researcher.orcid && (
              <div className="inline-flex items-center gap-2 rounded-lg bg-green-500/5 border border-green-950 px-3.5 py-1.5 text-sm">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[12px]">{t("researcher.orcid")}</span>
                <a
                  href={`https://orcid.org/${researcher.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 font-mono hover:underline inline-flex items-center gap-1"
                >
                  <span>{researcher.orcid}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Axes, publications count & Google Scholar */}
            <div className="flex flex-wrap items-center gap-2">
              {researcher.axes.map((a) => {
                const ax = AXES.find((x) => x.id === a);
                return ax ? (
                  <span key={a} className="text-[11px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {ax.shortName}
                  </span>
                ) : null;
              })}
              <a
                href={scholarUrl({ title: researcher.name })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              >
                <ExternalLink className="h-3 w-3" /> Google Scholar
              </a>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed font-serif max-w-3xl">
              {researcher.bio}
            </p>

            {/* Email contact */}
            {researcher.email && (
              <div className="flex items-center gap-2 text-sm text-slate-400 pt-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <a href={`mailto:${researcher.email}`} className="hover:text-slate-200 underline">
                  {researcher.email}
                </a>
              </div>
            )}

            {/* Signature */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              {canSign && (
                <button
                  onClick={() => setShowSigModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-800/40 bg-blue-600/10 px-3 py-1.5 text-[11px] font-bold text-blue-400 hover:bg-blue-600/20 transition-all"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Signer ce profil
                </button>
              )}
              <SignatureBadge
                targetId={researcher.id}
                freshSignature={freshSig ?? undefined}
                compact
              />
            </div>
          </div>
        </div>

        {/* Badge signature détaillé */}
        <SignatureBadge
          targetId={researcher.id}
          freshSignature={freshSig ?? undefined}
        />

        {/* Publications and Datasets lists split grid */}
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* Publications */}
          <div className="space-y-6">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Publications ({researcherPubs.length})
            </h2>
            
            <div className="space-y-4">
              {researcherPubs.map((pub) => (
                <div key={pub.id} className="rounded-xl border border-slate-900/60 bg-slate-950 p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                      {AXES.find((a) => a.id === pub.axis)?.name}
                    </span>
                    <span className="text-[13px] text-slate-500">{pub.year}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 leading-snug">{pub.title}</h3>
                  {pub.journal && (
                    <p className="text-[13px] text-slate-500 mt-1 italic">{pub.journal}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <Link
                      href={`/publications/${pub.id}`}
                      className="inline-flex items-center gap-1 text-[13px] text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      <span>{t("researcher.consult")}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[13px] text-slate-500 hover:text-slate-300 font-mono"
                      >
                        DOI <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {researcherPubs.length === 0 && (
                <div className="text-sm text-slate-500 italic py-4">
                  {t("researcher.noPubs")}
                </div>
              )}
            </div>
          </div>

          {/* Datasets */}
          {(() => {
            // Exclude static datasets whose ID already exists anywhere in the DB
            const mergedStatic = staticDatasets.filter((d) => !allDbIds.has(d.id)).map((d) => ({
              id: d.id,
              titre: d.title,
              description: d.description,
              acces: d.accessLevel as "public" | "protected" | "private",
              creatorId: d.creatorId,
              size: d.size,
              downloads: d.downloads,
            }));
            const allDatasets = [
              ...dbDatasets.map((d) => ({ ...d, size: undefined as undefined, downloads: undefined as undefined })),
              ...mergedStatic,
            ];

            // Access control per dataset
            const canView = (acces: string) => {
              if (acces === "public") return true;
              if (!isAuthenticated) return false;
              if (acces === "protected") return true;
              // private: only creator, directeur, or responsable_axe
              return user?.id === researcher.id || user?.role === "directeur" || user?.role === "responsable_axe";
            };

            const accessBadge = (acces: string) => {
              if (acces === "public")
                return <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-2 py-0.5 text-[11px] font-bold text-green-400 border border-green-900/30 uppercase tracking-wider"><Eye className="h-2 w-2" /> {t("common.public")}</span>;
              if (acces === "protected")
                return <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-900/30 uppercase tracking-wider"><Lock className="h-2.5 w-2.5" /> {t("common.protected")}</span>;
              return <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-400 border border-red-900/30 uppercase tracking-wider"><Shield className="h-2.5 w-2.5" /> {t("common.private")}</span>;
            };

            return (
              <div className="space-y-6">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
                  <Database className="h-5 w-5 text-blue-500" />
                  {t("researcher.datasetsTitle")} ({allDatasets.length})
                </h2>

                <div className="space-y-4">
                  {allDatasets.map((dataset) => {
                    const viewable = canView(dataset.acces);
                    return (
                      <div key={dataset.id} className="rounded-xl border border-slate-900/60 bg-slate-950 p-5 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-bold text-slate-200 leading-snug">{dataset.titre}</h3>
                          <div className="flex-none">{accessBadge(dataset.acces)}</div>
                        </div>
                        <p className="text-[14px] text-slate-500 leading-normal line-clamp-2">{dataset.description}</p>
                        {"size" in dataset && dataset.size && (
                          <div className="text-[13px] text-slate-500 flex justify-between pt-1">
                            <span>{t("researcher.sizeLabel")} {dataset.size}</span>
                            {"downloads" in dataset && <span>{t("researcher.downloadsLabel")} {dataset.downloads}</span>}
                          </div>
                        )}
                        <div className="pt-2 border-t border-slate-900">
                          {viewable ? (
                            <Link
                              href="/datasets"
                              className="inline-flex items-center gap-1 text-[13px] text-blue-400 hover:text-blue-300 font-semibold"
                            >
                              <span>{t("researcher.consult")}</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[12px] text-slate-600 italic">
                              <Lock className="h-3 w-3" /> Accès restreint
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {allDatasets.length === 0 && (
                    <div className="text-sm text-slate-500 italic py-4">
                      {t("researcher.noDatasets")}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

        </div>

      </main>
      <Footer />

      {/* Modal de signature */}
      {showSigModal && (
        <SignatureModal
          payload={sigPayload}
          onClose={() => setShowSigModal(false)}
          onSigned={(sigId, timestamp) => {
            setFreshSig({ id: sigId, signerName: user?.nom ?? "", timestamp });
          }}
        />
      )}
    </div>
  );
}
