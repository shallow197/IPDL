"use client";

import React from "react";
import { ExternalLink, Boxes, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SOFTWARE_TOOLS } from "@/data/ummiscoData";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LangContext";

const SOFTWARE_ACCENT: Record<string, string> = {
  gama: "text-blue-400 bg-blue-500/10",
  "comokit-tool": "text-rose-400 bg-rose-500/10",
  ichthyop: "text-cyan-400 bg-cyan-500/10",
  kendrick: "text-violet-400 bg-violet-500/10",
  epicam: "text-amber-400 bg-amber-500/10",
};

export default function LogicielsPage() {
  const { t } = useLang();

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <div className="mb-6">
            <span className="text-[13px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2 flex items-center gap-2">
              <Boxes className="h-4 w-4 text-violet-400" /> Logiciels open source
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Des outils utilisés dans le monde entier</h1>
            <p className="mt-4 max-w-2xl text-slate-400 text-base leading-relaxed">UMMISCO conçoit et maintient des plateformes de modélisation reconnues internationalement.</p>
          </div>
        </div>
      </section>

      {/* ── LOGICIELS ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOFTWARE_TOOLS.map((tool) => {
              const accent = SOFTWARE_ACCENT[tool.id] ?? "text-blue-400 bg-blue-500/10";
              return (
                <div key={tool.id} className="rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent} font-extrabold`}>
                      {tool.name.slice(0, 2)}
                    </span>
                    {tool.since && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">depuis {tool.since}</span>}
                  </div>
                  <h3 className="text-base font-bold text-white">{tool.name}</h3>
                  <p className="mt-2 text-[13px] text-slate-400 leading-relaxed flex-1 line-clamp-4">{tool.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tool.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-900/60 flex items-center gap-4">
                    {tool.website && (
                      <a href={tool.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-400 hover:text-blue-300">
                        <ExternalLink className="h-3 w-3" /> Site
                      </a>
                    )}
                    {tool.github && (
                      <a href={tool.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-400 hover:text-slate-200">
                        <ExternalLink className="h-3 w-3" /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
