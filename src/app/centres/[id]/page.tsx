"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, Building2, ExternalLink, Users, FolderGit2, Layers, Handshake,
} from "lucide-react";
import {
  CENTERS, RESEARCHERS, PROJECTS, AXES,
} from "@/data/ummiscoData";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import CentreGlobe, { CENTRE_VISUALS } from "@/components/CentreGlobe";

const CENTER_META: Record<string, { flag: string; gradient: string; ring: string; dot: string }> = {
  france: { flag: "🇫🇷", gradient: "from-blue-600/25 to-indigo-700/5", ring: "border-blue-800/40", dot: "bg-blue-400" },
  asie: { flag: "🇻🇳", gradient: "from-rose-600/25 to-red-700/5", ring: "border-rose-800/40", dot: "bg-rose-400" },
  "afrique-ouest": { flag: "🇸🇳", gradient: "from-green-600/25 to-emerald-700/5", ring: "border-green-800/40", dot: "bg-green-400" },
  "afrique-centrale": { flag: "🇨🇲", gradient: "from-amber-600/25 to-orange-700/5", ring: "border-amber-800/40", dot: "bg-amber-400" },
  mediterranee: { flag: "🇲🇦", gradient: "from-violet-600/25 to-purple-700/5", ring: "border-violet-800/40", dot: "bg-violet-400" },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CentrePage({ params }: PageProps) {
  const { id } = use(params);
  const center = CENTERS.find((c) => c.id === id);
  if (!center) notFound();

  const meta = CENTER_META[center.id] ?? CENTER_META.france;
  const members = RESEARCHERS.filter((r) => r.center === center.id);
  const projects = PROJECTS.filter((p) => p.centers.includes(center.id));
  const directors = members.filter((m) => m.role === "directeur_centre" || m.role === "directeur_unite");

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/#centres" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-8 font-semibold">
          <ArrowLeft className="h-4 w-4" /> <span>Tous les centres</span>
        </Link>

        {/* Hero */}
        <div className={`rounded-2xl border bg-gradient-to-br ${meta.gradient} ${meta.ring} p-8 mb-10`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <CentreGlobe
                color={CENTRE_VISUALS[center.id]?.color ?? "#60a5fa"}
                node={CENTRE_VISUALS[center.id]?.node ?? [50, 40]}
                size={96}
                className="flex-none"
              />
              <div>
                <h1 className="text-3xl font-extrabold text-white">{center.name}</h1>
                <p className="text-sm text-slate-300 font-semibold mt-1 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" /> {center.city} · {center.country}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-slate-300 leading-relaxed max-w-3xl">{center.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-950/50 border border-slate-800 px-3.5 py-2 text-[13px]">
              <Building2 className="h-4 w-4 text-slate-400 flex-none" />
              <span className="text-slate-400">Tutelle(s) : <strong className="text-slate-200">{center.tutelle}</strong></span>
            </div>
            {center.director && center.director !== "—" && (
              <div className="inline-flex items-center gap-2 rounded-lg bg-slate-950/50 border border-slate-800 px-3.5 py-2 text-[13px]">
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                <span className="text-slate-400">Direction : <strong className="text-slate-200">{center.director}</strong></span>
              </div>
            )}
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-950/50 border border-slate-800 px-3.5 py-2 text-[13px]">
              <Users className="h-4 w-4 text-slate-400 flex-none" />
              <span className="text-slate-400"><strong className="text-slate-200">{members.length}</strong> membres</span>
            </div>
          </div>
        </div>

        {/* Axes / thèmes du centre */}
        {center.themes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <Layers className="h-4 w-4 text-violet-400" /> Axes de recherche du centre
            </h2>
            <div className="flex flex-wrap gap-2">
              {center.themes.map((th) => {
                const ax = AXES.find((a) => a.id === th);
                return ax ? (
                  <span key={th} className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r ${ax.color}`}>
                    {ax.shortName}
                  </span>
                ) : null;
              })}
            </div>
          </section>
        )}

        {/* Tutelles & partenaires */}
        {center.partners && center.partners.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <Handshake className="h-4 w-4 text-cyan-400" /> Tutelles &amp; partenaires
            </h2>
            <div className="flex flex-wrap gap-2">
              {center.partners.map((p) => (
                <span key={p} className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/30 px-3.5 py-2 text-xs font-semibold text-slate-300">
                  <Building2 className="h-3.5 w-3.5 text-slate-500 flex-none" /> {p}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projets du centre */}
        {projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <FolderGit2 className="h-4 w-4 text-blue-400" /> Projets ({projects.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <div key={p.id} className="rounded-xl border border-slate-900 bg-slate-900/10 p-5">
                  <h3 className="text-sm font-bold text-white">{p.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-wider">{p.domain}</p>
                  <p className="mt-2 text-[13px] text-slate-400 leading-relaxed line-clamp-3">{p.description}</p>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-blue-400 hover:text-blue-300">
                      <ExternalLink className="h-3 w-3" /> En savoir plus
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Membres du centre */}
        <section>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-green-400" /> Membres du centre ({members.length})
          </h2>
          {directors.length > 0 && (
            <p className="text-[13px] text-slate-500 mb-4">
              Direction : {directors.map((d) => d.name).join(", ")}.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <Link key={m.id} href={`/chercheurs/${m.id}`} className="group rounded-xl border border-slate-900 bg-slate-950 p-4 flex items-center gap-3 hover:border-slate-800 transition-colors">
                <Avatar name={m.name} src={m.photoUrl} seed={m.avatarSeed} size={44} className="group-hover:scale-105 transition-transform" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">{m.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{m.title}</p>
                </div>
              </Link>
            ))}
          </div>
          {members.length === 0 && (
            <p className="text-sm text-slate-500 italic">Aucun membre référencé pour ce centre.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
