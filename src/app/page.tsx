"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Database,
  Users,
  ArrowRight,
  FlaskConical,
  Newspaper,
  Handshake,
  MessageSquare,
  Globe2,
  Boxes,
  BookOpen,
  Search,
} from "lucide-react";
import {
  AXES,
  CENTERS,
  RESEARCHERS,
  PUBLICATION,
  DATASETS,
} from "@/data/ummiscoData";
import Footer from "@/components/Footer";
import PartnersBanner from "@/components/PartnersBanner";
import StatsCounter from "@/components/StatsCounter";
import { CENTRE_VISUALS } from "@/components/CentreGlobe";
import GlobeCentres from "@/components/GlobeCentres";
import { useLang } from "@/context/LangContext";

export default function Home() {
  const { t } = useLang();
  const [searchQuery, setSearchQuery] = useState("");

  const q = searchQuery.trim().toLowerCase();

  const filteredResearchers = useMemo(
    () => (q ? RESEARCHERS.filter((r) => r.name.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)).slice(0, 4) : []),
    [q]
  );
  const filteredPubs = useMemo(
    () => (q ? PUBLICATION.filter((p) => p.title.toLowerCase().includes(q) || p.authors.some((a) => a.toLowerCase().includes(q))).slice(0, 4) : []),
    [q]
  );
  const filteredDatasets = useMemo(
    () => (q ? DATASETS.filter((d) => d.title.toLowerCase().includes(q)).slice(0, 3) : []),
    [q]
  );

  const EXPLORE_LINKS = [
    { href: "/publications", titleKey: "nav.publications", descKey: "home.explorePublications", Icon: BookOpen, accent: "text-blue-400", bg: "bg-blue-500/10" },
    { href: "/projets", titleKey: "nav.projets", descKey: "home.exploreProjets", Icon: Boxes, accent: "text-indigo-400", bg: "bg-indigo-500/10" },
    { href: "/datasets", titleKey: "nav.datasets", descKey: "home.exploreDatasets", Icon: Database, accent: "text-green-400", bg: "bg-green-500/10" },
    { href: "/equipe", titleKey: "nav.equipe", descKey: "home.exploreEquipe", Icon: Users, accent: "text-violet-400", bg: "bg-violet-500/10" },
    { href: "/simulations", titleKey: "nav.simulations", descKey: "home.exploreSimulations", Icon: FlaskConical, accent: "text-amber-400", bg: "bg-amber-500/10" },
    { href: "/logiciels", titleKey: "nav.logiciels", descKey: "home.exploreLogiciels", Icon: Boxes, accent: "text-violet-400", bg: "bg-violet-500/10" },
    { href: "/actualites", titleKey: "nav.actualites", descKey: "home.exploreActualites", Icon: Newspaper, accent: "text-rose-400", bg: "bg-rose-500/10" },
    { href: "/partenaires", titleKey: "nav.partenaires", descKey: "home.explorePartenaires", Icon: Handshake, accent: "text-cyan-400", bg: "bg-cyan-500/10" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-900">
        <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-600/15 blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-green-600/15 blur-[110px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 -z-10 h-56 w-56 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — badge, title, CTAs, search */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3.5 py-1 text-sm text-slate-400 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              {t("hero.badge")}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-[3.25rem] leading-[1.05]">
              {t("hero.title1")}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>{" "}
              {t("hero.title2")}
            </h1>

            <div className="flex flex-wrap gap-3">
              <Link href="/publications" style={{ color: "#ffffff" }} className="inline-flex items-center gap-2 rounded-lg bg-ummisco-blue px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all">
                <BookOpen className="h-4 w-4" /> {t("nav.publications")}
              </Link>
              <Link href="/equipe" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-500 transition-all">
                <Users className="h-4 w-4" /> {t("nav.equipe")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="relative rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl focus-within:border-blue-500/50 transition-all duration-300">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  placeholder={t("hero.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-full bg-transparent text-base text-slate-200 placeholder-slate-500 focus:outline-none"
                />
              </div>

              {q && (
                <div className="absolute top-full left-0 right-0 mt-3 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-md shadow-2xl p-6 text-left z-30 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <span className="text-[13px] mono-text uppercase tracking-wider text-slate-500 font-bold">{t("hero.searchRealtime")}</span>
                    <button onClick={() => setSearchQuery("")} className="text-[13px] text-slate-400 hover:text-slate-200">{t("hero.searchClear")}</button>
                  </div>
                  <div className="space-y-6">
                    {filteredResearchers.length > 0 && (
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Users className="h-3 w-3" /> {t("hero.searchResearchers")}</h4>
                        <div className="space-y-2">{filteredResearchers.map((r) => (<Link key={r.id} href={`/chercheurs/${r.id}`} className="block p-2 rounded-lg hover:bg-slate-800/60 transition-colors"><div className="text-sm font-bold text-slate-200">{r.name}</div><div className="text-[13px] text-slate-500">{r.title}</div></Link>))}</div>
                      </div>
                    )}
                    {filteredPubs.length > 0 && (
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> {t("hero.searchPublications")}</h4>
                        <div className="space-y-2">{filteredPubs.map((p) => (<Link key={p.id} href="/publications" className="block p-2 rounded-lg hover:bg-slate-800/60 transition-colors"><div className="text-sm font-bold text-slate-200 line-clamp-1">{p.title}</div><div className="text-[13px] text-slate-500">{p.authors.join(", ")} ({p.year})</div></Link>))}</div>
                      </div>
                    )}
                    {filteredDatasets.length > 0 && (
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Database className="h-3 w-3" /> {t("hero.searchDatasets")}</h4>
                        <div className="space-y-2">{filteredDatasets.map((d) => (<Link key={d.id} href="/datasets" className="block p-2 rounded-lg hover:bg-slate-800/60 transition-colors"><div className="text-sm font-bold text-slate-200">{d.title}</div><div className="text-[13px] text-slate-500">{d.size} · {d.accessLevel}</div></Link>))}</div>
                      </div>
                    )}
                    {filteredResearchers.length === 0 && filteredPubs.length === 0 && filteredDatasets.length === 0 && (
                      <div className="text-sm text-slate-500 text-center py-4">{t("hero.searchNoResult")} «&nbsp;{searchQuery}&nbsp;».</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT — group photo with overlays */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="relative hidden lg:block">
            {/* Glow ring */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-blue-500/25 via-green-500/10 to-violet-500/20 blur-lg" />

            <div className="relative rounded-2xl overflow-hidden border border-slate-800/60 shadow-2xl">
              <img
                src="/photo_de_groupe/membres.png"
                alt="Équipe UMMISCO"
                className="w-full object-cover object-top"
                style={{ maxHeight: "420px" }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Équipe UMMISCO · 2024</p>
              </div>
            </div>


          </motion.div>

        </div>
      </section>

      {/* ── INTRO / PRÉSENTATION ──────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900 relative overflow-hidden">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 -z-10 h-80 w-80 rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <div className="mb-6 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
              <img src="/themes/allthemes.png" alt="Axes thématiques UMMISCO" className="w-full h-48 object-cover" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              {t("home.aboutTitle")}
            </h2>
            <p className="mt-6 text-slate-400 text-base leading-relaxed">
              {t("home.aboutDesc")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/equipe" style={{ color: "#ffffff" }} className="inline-flex items-center gap-2 rounded-lg bg-ummisco-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-ummisco-blue/90 active:scale-95 transition-all">
                <Users className="h-4 w-4" /> {t("home.teamLink")}
              </Link>
              <Link href="/axes" className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all">
                {t("home.axesLink")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Stats panel */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/10 p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-6">
              <StatsCounter value={94} label={t("stats.researchers")} />
              <StatsCounter value={5} label={t("stats.centers")} />
              <StatsCounter value={29} label={t("stats.projects")} />
              <StatsCounter value={4} label={t("stats.axes")} />
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-3 text-[13px] text-slate-500">
              <Globe2 className="h-4 w-4 text-blue-400 flex-none" />
              <span>{t("home.presence")}</span>
            </div>
            {/* Logos tutelles */}
            <div className="mt-5 pt-5 border-t border-slate-800">
              <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-3">{t("home.tutelles")}</p>
              <div className="flex items-center gap-4 flex-wrap">
                {[
                  { src: "/logos/logo_ird.webp", alt: "IRD" },
                  { src: "/logos/logo_sorbonne.png", alt: "Sorbonne" },
                  { src: "/logos/logo_ucad.png", alt: "UCAD" },
                  { src: "/logos/logo_uca.png", alt: "UCA" },
                  { src: "/logos/logo_uy1.jpg", alt: "UY1" },
                ].map(({ src, alt }) => (
                  <div key={alt} className="h-9 w-16 rounded p-1 flex items-center justify-center shadow-sm" style={{ backgroundColor: "#ffffff" }}>
                    <img src={src} alt={alt} className="h-full w-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GLOBE INTERACTIF DES CENTRES ──────────────────────────────────── */}
      <section id="centres" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-900/10 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[28rem] w-[28rem] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <span className="text-[13px] mono-text uppercase tracking-widest text-green-400 font-bold mb-3 flex items-center gap-2"><Globe2 className="h-4 w-4" /> {t("home.networkTitle")}</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">{t("home.centersTitle")}</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {CENTERS.map((c) => (
                <Link key={c.id} href={`/centres/${c.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CENTRE_VISUALS[c.id]?.color ?? "#60a5fa" }} />
                  {c.name.replace("Centre ", "")}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <GlobeCentres />
          </div>
        </div>
      </section>

      {/* ── AXES / THÈMES ─────────────────────────────────────────────────── */}
      <section id="axes" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-900/10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">{t("axes.title")}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AXES.map((axis) => {
              const axisImage: Record<string, string> = {
                agents: "/themes/modelisation.png",
                ia: "/themes/intelligence.png",
                capteurs: "/themes/capteurs.png",
                participatif: "/themes/science_citoyenne.png",
              };
              return (
                <Link
                  key={axis.id}
                  href={`/publications?axe=${axis.id}`}
                  className="group text-left rounded-xl border border-slate-800 bg-slate-900/10 hover:border-blue-500/50 hover:bg-slate-900/40 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="h-36 w-full overflow-hidden flex-none">
                    <img
                      src={axisImage[axis.id]}
                      alt={axis.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 leading-snug group-hover:text-white">{axis.name}</h3>
                      <p className="mt-2 text-[12px] text-slate-500 leading-relaxed line-clamp-3">{axis.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-500 group-hover:text-blue-400 font-semibold uppercase tracking-wider mt-4 transition-colors">
                      <BookOpen className="h-3 w-3" />
                      <span>Voir les publications</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EXPLORE THE PLATFORM ──────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-900/10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <span className="text-[13px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">{t("home.platformTitle")}</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">{t("home.platformSubtitle")}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EXPLORE_LINKS.map((item) => {
              const Icon = item.Icon;
              return (
                <Link key={item.href} href={item.href} className="group rounded-xl border border-slate-800 bg-slate-900/10 p-6 hover:border-slate-700 hover:bg-slate-900/30 transition-all flex flex-col">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} ${item.accent} mb-4`}><Icon className="h-5 w-5" /></span>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{t(item.titleKey)}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">{t(item.descKey)}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-400 group-hover:text-slate-200">{t("home.discover")} <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <PartnersBanner />
      <Footer />
    </div>
  );
}
