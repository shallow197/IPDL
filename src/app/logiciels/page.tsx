"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, Boxes } from "lucide-react";
import { SOFTWARE_TOOLS } from "@/data/ummiscoData";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LangContext";

export default function LogicielsPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-slate-900 pb-8 mb-12">
          <span className="text-[13px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2 flex items-center gap-2">
            <Boxes className="h-4 w-4 text-violet-400" /> Logiciels open source
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Des outils utilisés dans le monde entier</h1>
          <p className="mt-3 text-slate-400 text-base leading-relaxed max-w-2xl">UMMISCO conçoit et maintient des plateformes de modélisation reconnues internationalement.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOFTWARE_TOOLS.map((tool) => {
              return (
                <div key={tool.id} className="rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    {tool.logoUrl ? (
                      <div className="h-12 w-12 relative flex items-center justify-center bg-slate-900/50 rounded-lg overflow-hidden">
                        <Image
                          src={tool.logoUrl}
                          alt={tool.name}
                          width={48}
                          height={48}
                          className="object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-slate-800 font-bold text-slate-500">
                        {tool.name.slice(0, 2)}
                      </div>
                    )}
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
      </main>

      <Footer />
    </div>
  );
}
