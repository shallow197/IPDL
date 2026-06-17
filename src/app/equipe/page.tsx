"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ExternalLink, Search, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import { RESEARCHERS, AXES } from "@/data/ummiscoData";
import { useLang } from "@/context/LangContext";

export default function EquipePage() {
  const { t } = useLang();
  const [axeFilter, setAxeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const FILTER_AXES = [{ id: "all", name: t("researchers.allAxes") }, ...AXES];

  const filtered = RESEARCHERS.filter((r) => {
    const matchesAxe = axeFilter === "all" || r.axes.includes(axeFilter);
    const matchesSearch = !search.trim() || r.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesAxe && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-8 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à l'accueil</span>
        </Link>
        <div className="border-b border-slate-900 pb-8 mb-10">
          <span className="text-[13px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
            {t("researchers.sectionTag")}
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{t("researchers.title")}</h1>
          <p className="mt-2 text-slate-400 text-base">
            {filtered.length} {t("researchers.membersCount")}
          </p>
          <div aria-hidden className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 text-sm text-slate-200 pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500/50 placeholder:text-slate-600"
          />
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

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <a
                    href={`mailto:${r.email}?subject=Contact UMMISCO&body=Bonjour ${r.name},%0A%0AJ'aimerais vous contacter concernant UMMISCO.%0A%0ACordialement`}
                    className="inline-flex items-center gap-1 text-[13px] text-slate-500 hover:text-slate-200 transition-colors"
                  >
                    <Mail className="h-3 w-3" /> {t("researchers.contact")}
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
