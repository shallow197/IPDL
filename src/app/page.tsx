"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Database,
  Users,
  ArrowRight,
  Clipboard,
  Check,
  ChevronRight,
  ExternalLink,
  FlaskConical,
  Newspaper,
  Handshake,
  MessageSquare,
  Quote,
  Globe2,
  Boxes,
} from "lucide-react";
import {
  AXES,
  RESEARCHERS,
  PUBLICATION,
  DATASETS,
  CENTERS,
  Publication,
} from "@/data/ummiscoData";
import Footer from "@/components/Footer";
import PartnersBanner from "@/components/PartnersBanner";
import StatsCounter from "@/components/StatsCounter";
import { CENTRE_VISUALS } from "@/components/CentreGlobe";
import GlobeCentres from "@/components/GlobeCentres";
import { useLang } from "@/context/LangContext";
import { scholarUrl, doiUrl, UMMISCO_SCHOLAR_SEARCH } from "@/lib/scholar";

export default function Home() {
  const { t } = useLang();

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAxis, setSelectedAxis] = useState<string | null>(null);
  const [copiedPubId, setCopiedPubId] = useState<string | null>(null);
  const [citationModalPub, setCitationModalPub] = useState<Publication | null>(null);

  const q = searchQuery.trim().toLowerCase();
  const filteredPubs = q ? PUBLICATION.filter((p) => p.title.toLowerCase().includes(q) || p.abstract.toLowerCase().includes(q) || p.authors.some((a) => a.toLowerCase().includes(q))).slice(0, 4) : [];
  const filteredResearchers = q ? RESEARCHERS.filter((r) => r.name.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)).slice(0, 4) : [];
  const filteredDatasets = q ? DATASETS.filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)).slice(0, 4) : [];

  const handleCopyCitation = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPubId(key);
    setTimeout(() => setCopiedPubId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-600/15 blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-green-600/15 blur-[110px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 -z-10 h-56 w-56 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">

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
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Équipe UMMISCO · 2024</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold">Multi-agents</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 border border-green-500/30 text-green-300 font-bold">Environnement</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/30 text-violet-300 font-bold">Santé</span>
                </div>
              </div>
            </div>

            {/* Floating badge — publications count */}
            <div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-sm px-3.5 py-2.5 shadow-xl">
              <BookOpen className="h-4 w-4 text-blue-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-black text-white leading-none">{PUBLICATION.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">{t("nav.publications")}</div>
              </div>
            </div>

            {/* Floating badge — researchers count */}
            <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-sm px-3.5 py-2.5 shadow-xl">
              <Users className="h-4 w-4 text-violet-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-black text-white leading-none">{RESEARCHERS.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">{t("nav.equipe")}</div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── INTRO / PRÉSENTATION ──────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900 relative overflow-hidden">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 -z-10 h-80 w-80 rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-center">
          <div>
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
            <span className="text-[13px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">{t("axes.sectionTag")}</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">{t("axes.title")}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AXES.map((axis) => (
              <button type="button" key={axis.id} onClick={() => setSelectedAxis(selectedAxis === axis.id ? null : axis.id)} className={`text-left cursor-pointer rounded-xl border p-6 transition-all duration-300 flex flex-col justify-between min-h-52 ${selectedAxis === axis.id ? "border-blue-500 bg-slate-900/60 shadow-lg shadow-blue-500/5 -translate-y-1" : "border-slate-800 bg-slate-900/10 hover:border-slate-700 hover:-translate-y-1"}`}>
                <div>
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${axis.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <span className="text-lg font-extrabold text-white">{AXES.indexOf(axis) + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 leading-snug">{axis.name}</h3>
                  <p className="mt-2 text-[13px] text-slate-500 leading-relaxed line-clamp-3">{axis.description}</p>
                </div>
                <div className="flex items-center justify-between text-[13px] text-slate-500 font-semibold uppercase tracking-wider mt-4">
                  <span>{axis.shortName}</span>
                  <ChevronRight className={`h-3 w-3 transition-transform ${selectedAxis === axis.id ? "rotate-90 text-blue-500" : ""}`} />
                </div>
              </button>
            ))}
          </div>
          <AnimatePresence>
            {selectedAxis && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-8 rounded-xl border border-slate-900 bg-slate-900/30 p-6 overflow-hidden">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-blue-500" /> {t("axes.allPublications")}</h4>
                <div className="space-y-4">
                  {PUBLICATION.filter((p) => p.axis === selectedAxis).map((p) => (
                    <div key={p.id} className="border-b border-slate-900/60 pb-3 last:border-b-0 last:pb-0"><div className="text-sm font-bold text-slate-200">{p.title}</div><div className="text-[13px] text-slate-400 mt-1">{p.authors.join(", ")} — {p.year}</div></div>
                  ))}
                  {PUBLICATION.filter((p) => p.axis === selectedAxis).length === 0 && (<div className="text-sm text-slate-500">{t("axes.noPublications2")}</div>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

{/* ── FEATURED PUBLICATION ─────────────────────────────────────────── */}
      <section id="publications" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap gap-4 justify-between items-end">
            <div>
              <span className="text-[13px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">{t("publications.sectionTag")}</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">{t("publications.title")}</h2>
            </div>
            <div className="flex items-center gap-4">
              <a href={UMMISCO_SCHOLAR_SEARCH} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-slate-200"><Quote className="h-3.5 w-3.5" /> Google Scholar <ExternalLink className="h-3 w-3" /></a>
              <Link href="/publications" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300"><span>{t("publications.viewAll")}</span><ArrowRight className="h-3 w-3" /></Link>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PUBLICATION.slice(0, 3).map((pub) => (
              <div key={pub.id} className="rounded-xl border border-slate-900 bg-slate-950 p-6 flex flex-col justify-between shadow-md hover:border-slate-800/80 transition-all">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[12px] font-semibold text-slate-400 border border-slate-800 uppercase tracking-wider">{AXES.find((a) => a.id === pub.axis)?.shortName}</span>
                    <span className="text-[13px] text-slate-500">{pub.year}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug line-clamp-2">{pub.title}</h3>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed line-clamp-3">{pub.abstract}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-900/60">
                  <span className="text-[13px] text-slate-500 italic block truncate mb-3">{pub.authors.join(", ")}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={scholarUrl(pub)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1.5 text-[12px] font-bold text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"><Quote className="h-3 w-3" /> Scholar</a>
                    {doiUrl(pub.doi) && (<a href={doiUrl(pub.doi)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1.5 text-[12px] font-bold text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"><ExternalLink className="h-3 w-3" /> DOI</a>)}
                    <button onClick={() => setCitationModalPub(pub)} className="inline-flex items-center gap-1.5 rounded bg-blue-600/10 px-2.5 py-1.5 text-[12px] font-bold text-blue-400 border border-blue-900/30 hover:bg-blue-600/20 active:scale-95 transition-all"><Clipboard className="h-3 w-3" /> {t("publications.cite")}</button>
                  </div>
                </div>
              </div>
            ))}
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

      {/* ── AI ASSISTANT CALLOUT ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-900 bg-gradient-to-br from-blue-950/40 to-slate-900/20 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-blue-400" /><h3 className="text-lg font-bold text-white">{t("home.aiTitle")}</h3><span className="flex items-center gap-1.5 text-[13px] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" /> {t("home.aiAvail")}</span></div>
        </div>
      </section>

      {/* ── CITATION MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {citationModalPub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setCitationModalPub(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
                <h3 className="text-base font-bold text-white">{t("publications.citeTitle")}</h3>
                <button onClick={() => setCitationModalPub(null)} className="text-sm text-slate-500 hover:text-slate-200">{t("common.close")}</button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>{t("publications.citationApa")}</span>
                    <button onClick={() => handleCopyCitation(citationModalPub.citationApa, "apa")} className="inline-flex items-center gap-1 hover:text-white">{copiedPubId === "apa" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Clipboard className="h-3.5 w-3.5" />}<span>{t("publications.copyApa")}</span></button>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 text-sm text-slate-300 leading-relaxed font-mono select-all">{citationModalPub.citationApa}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>{t("publications.citationBibtex")}</span>
                    <button onClick={() => handleCopyCitation(citationModalPub.citationBibtex, "bibtex")} className="inline-flex items-center gap-1 hover:text-white">{copiedPubId === "bibtex" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Clipboard className="h-3.5 w-3.5" />}<span>{t("publications.copyBibtex")}</span></button>
                  </div>
                  <pre className="p-4 rounded-lg bg-slate-950 border border-slate-900 text-[13px] text-slate-300 leading-relaxed font-mono overflow-x-auto select-all max-h-40">{citationModalPub.citationBibtex}</pre>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a href={scholarUrl(citationModalPub)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-[13px] font-bold text-slate-300 border border-slate-800 hover:text-white"><Quote className="h-3.5 w-3.5" /> {t("home.scholarLink")}</a>
                  {doiUrl(citationModalPub.doi) && (<a href={doiUrl(citationModalPub.doi)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-[13px] font-bold text-slate-300 border border-slate-800 hover:text-white"><ExternalLink className="h-3.5 w-3.5" /> {t("home.doiLink")}</a>)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PartnersBanner />
      <Footer />
    </div>
  );
}
