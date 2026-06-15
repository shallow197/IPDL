"use client";

import React, { use } from "react";
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
  Calendar,
  Clipboard,
  Check
} from "lucide-react";
import {
  RESEARCHERS,
  PUBLICATIONS,
  DATASETS,
  AXES,
  CENTERS,
} from "@/data/ummiscoData";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import { scholarUrl } from "@/lib/scholar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ResearcherProfilePage({ params }: PageProps) {
  const { id } = use(params);

  // Find researcher
  const researcher = RESEARCHERS.find((r) => r.id === id);

  if (!researcher) {
    notFound();
  }

  // Use researcher's publications if available, otherwise filter from global PUBLICATIONS
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
    PUBLICATIONS.filter((p) =>
      p.researcherIds.includes(researcher.id)
    );

  // Filter their datasets
  const researcherDatasets = DATASETS.filter((d) => d.creatorId === researcher.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/equipe"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-8 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à l&apos;équipe</span>
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
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Centre</span>
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
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[12px]">ORCID iD</span>
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
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-900/30 px-2.5 py-0.5 text-[11px] font-bold text-blue-400">
                {researcher.publicationsCount} publications
              </span>
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
          </div>
        </div>

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
                      href="/publications"
                      className="inline-flex items-center gap-1 text-[13px] text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      <span>Consulter</span>
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
                  Aucune publication scientifique enregistrée pour le moment.
                </div>
              )}
            </div>
          </div>

          {/* Datasets */}
          <div className="space-y-6">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-900 pb-3">
              <Database className="h-5 w-5 text-blue-500" />
              Datasets déposés ({researcherDatasets.length})
            </h2>

            <div className="space-y-4">
              {researcherDatasets.map((dataset) => {
                const isPublic = dataset.accessLevel === "public";
                const isProtected = dataset.accessLevel === "protected";
                const isPrivate = dataset.accessLevel === "private";

                return (
                  <div key={dataset.id} className="rounded-xl border border-slate-900/60 bg-slate-950 p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-slate-200 leading-snug">{dataset.title}</h3>
                      
                      {/* Access status badge */}
                      <div className="flex-none">
                        {isPublic && (
                          <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-2 py-0.5 text-[11px] font-bold text-green-400 border border-green-900/30 uppercase tracking-wider">
                            <Eye className="h-2 w-2" /> Public
                          </span>
                        )}
                        {isProtected && (
                          <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-900/30 uppercase tracking-wider">
                            <Lock className="h-2.5 w-2.5" /> Protégé
                          </span>
                        )}
                        {isPrivate && (
                          <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-400 border border-red-900/30 uppercase tracking-wider">
                            <Shield className="h-2.5 w-2.5" /> Privé
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[14px] text-slate-500 leading-normal line-clamp-2">
                      {dataset.description}
                    </p>
                    <div className="text-[13px] text-slate-500 flex justify-between pt-2">
                      <span>Taille : {dataset.size}</span>
                      <span>Téléchargements : {dataset.downloads}</span>
                    </div>
                  </div>
                );
              })}

              {researcherDatasets.length === 0 && (
                <div className="text-sm text-slate-500 italic py-4">
                  Aucun dataset de recherche déposé par ce chercheur.
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
}
