"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ExternalLink, BookOpen, Database } from "lucide-react";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import { RESEARCHERS, PUBLICATIONS, DATASETS, AXES } from "@/data/ummiscoData";
import { useLang } from "@/context/LangContext";

const FILTER_AXES = [{ id: "all", name: "Tous les axes" }, ...AXES];

export default function EquipePage() {
  const { t } = useLang();
  const [axeFilter, setAxeFilter] = useState("all");

  const filtered =
    axeFilter === "all"
      ? RESEARCHERS
      : RESEARCHERS.filter((r) => r.axes.includes(axeFilter));

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-slate-900 pb-8 mb-10">
          <span className="text-[13px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
            {t("researchers.sectionTag")}
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{t("researchers.title")}</h1>
          <p className="mt-2 text-slate-400 text-base">
            {filtered.length} membre(s) répartis dans les 5 centres internationaux d&apos;UMMISCO (UMI 209).
          </p>
          <div aria-hidden className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
        </div>

        {/* Axis filter */}
        <div className="flex gap-2 flex-wrap mb-10">
          {FILTER_AXES.map((a) => (
            <button
              key={a.id}
              onClick={() => setAxeFilter(a.id)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-semibold uppercase tracking-wider border transition-all ${
                axeFilter === a.id
                  ? "bg-blue-600/20 text-blue-400 border-blue-900/40"
                  : "border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const pubCount = r.publications?.length ?? PUBLICATIONS.filter((p) => p.researcherIds.includes(r.id)).length;
            const dsCount = DATASETS.filter((d) => d.creatorId === r.id).length;
            return (
              <div key={r.id} className="rounded-xl border border-slate-900 bg-slate-950 p-6 flex flex-col hover:border-slate-800 transition-colors group">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <Avatar
                    name={r.name}
                    src={r.photoUrl}
                    seed={r.avatarSeed}
                    size={56}
                    className="group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">{r.name}</h3>
                    <p className="text-[13px] text-slate-500 mt-0.5 leading-snug">{r.title}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-[14px] text-slate-400 leading-relaxed line-clamp-3 font-serif mb-4 flex-1">
                  {r.bio}
                </p>

                {/* Axes tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {r.axes.map((a) => (
                    <span key={a} className="text-[11px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">
                      {AXES.find((ax) => ax.id === a)?.name.split(" ")[0]}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-[13px] text-slate-500 border-t border-slate-900 pt-3 mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {pubCount} publications
                  </span>
                  <span className="flex items-center gap-1">
                    <Database className="h-3 w-3" /> {dsCount} datasets
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 text-[13px] text-slate-500 hover:text-slate-200 transition-colors">
                    <Mail className="h-3 w-3" /> Contact
                  </a>
                  <Link href={`/chercheurs/${r.id}`} className="inline-flex items-center gap-1 text-[13px] text-blue-400 hover:text-blue-300 font-semibold">
                    {t("researchers.viewProfile")}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500 text-base">{t("common.noData")}</div>
        )}
      </main>
      <Footer />
    </div>
  );
}
