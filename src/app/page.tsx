"use client";

import React, { useState } from "react";
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
  Sparkles,
  Globe2,
  Boxes,
  Mic,
} from "lucide-react";
import {
  AXES,
  RESEARCHERS,
  PUBLICATIONS,
  DATASETS,
  CENTERS,
  SOFTWARE_TOOLS,
  PROJECTS,
  Publication,
} from "@/data/ummiscoData";
import Footer from "@/components/Footer";
import PartnersBanner from "@/components/PartnersBanner";
import StatsCounter from "@/components/StatsCounter";
import { CENTRE_VISUALS } from "@/components/CentreGlobe";
import GlobeCentres from "@/components/GlobeCentres";
import { useLang } from "@/context/LangContext";
import { scholarUrl, doiUrl, UMMISCO_SCHOLAR_SEARCH } from "@/lib/scholar";

const SOFTWARE_ACCENT: Record<string, string> = {
  gama: "text-blue-400 bg-blue-500/10",
  "comokit-tool": "text-rose-400 bg-rose-500/10",
  ichthyop: "text-cyan-400 bg-cyan-500/10",
  kendrick: "text-violet-400 bg-violet-500/10",
  epicam: "text-amber-400 bg-amber-500/10",
};

const EXPLORE_LINKS = [
  { href: "/publications", title: "Publications", desc: "Recherche multicritère, citations APA/BibTeX, liens Google Scholar & DOI.", Icon: BookOpen, accent: "text-blue-400", bg: "bg-blue-500/10" },
  { href: "/projets", title: "Projets de recherche", desc: "10 projets actifs filtrables par axe, domaine et centre international.", Icon: Boxes, accent: "text-indigo-400", bg: "bg-indigo-500/10" },
  { href: "/datasets", title: "Datasets ouverts", desc: "Catalogue à 3 niveaux d'accès (public, protégé, privé) avec licences.", Icon: Database, accent: "text-green-400", bg: "bg-green-500/10" },
  { href: "/equipe", title: "Équipe & chercheurs", desc: "94 membres, 5 centres internationaux, vitrines personnelles.", Icon: Users, accent: "text-violet-400", bg: "bg-violet-500/10" },
  { href: "/simulations", title: "Simulations", desc: "Modèles intégrés (GAMA, NetLogo) exécutables sans quitter le portail.", Icon: FlaskConical, accent: "text-amber-400", bg: "bg-amber-500/10" },
  { href: "/actualites", title: "Actualités & séminaires", desc: "Agenda scientifique, inscriptions en ligne, contrats de doctorat.", Icon: Newspaper, accent: "text-rose-400", bg: "bg-rose-500/10" },
  { href: "/partenaires", title: "Partenaires & bailleurs", desc: "Tutelles, partenaires académiques, financeurs et délivrables.", Icon: Handshake, accent: "text-cyan-400", bg: "bg-cyan-500/10" },
];

export default function Home() {
  const { t } = useLang();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAxis, setSelectedAxis] = useState<string | null>(null);
  const [copiedPubId, setCopiedPubId] = useState<string | null>(null);
  const [citationModalPub, setCitationModalPub] = useState<Publication | null>(null);

  const q = searchQuery.trim().toLowerCase();
  const filteredPubs = q ? PUBLICATIONS.filter((p) => p.title.toLowerCase().includes(q) || p.abstract.toLowerCase().includes(q) || p.authors.some((a) => a.toLowerCase().includes(q))).slice(0, 4) : [];
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
      <section className="relative flex flex-col justify-center min-h-[82vh] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-600/15 blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-green-600/15 blur-[110px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 -z-10 h-56 w-56 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center relative z-10 flex flex-col items-center">
          {/* Photo de groupe — bannière de bienvenue */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }} className="mb-6 w-full max-w-lg rounded-lg overflow-hidden border border-slate-800 shadow-md">
            <img src="/photo_de_groupe/membres.png" alt="Équipe UMMISCO" className="w-full h-auto object-cover max-h-48" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3.5 py-1 text-sm text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            UMMISCO UMI 209 · Au cœur des sciences de la complexité
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mt-6">
            {t("hero.title1")} <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-green-400 bg-clip-text text-transparent">{t("hero.titleHighlight")}</span> {t("hero.title2")}
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 max-w-2xl text-slate-400 text-base leading-relaxed">
            {t("hero.description")}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10 w-full max-w-2xl relative">
            <div className="relative rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl focus-within:border-blue-500/50 transition-all duration-300">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input type="text" placeholder={t("hero.searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-full bg-transparent text-base text-slate-200 placeholder-slate-500 focus:outline-none" />
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
          </motion.div>
        </div>
      </section>

      {/* ── INTRO / PRÉSENTATION ──────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900 relative overflow-hidden">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 -z-10 h-80 w-80 rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[13px] mono-text uppercase tracking-widest text-blue-400 font-bold mb-4">
              <Sparkles className="h-4 w-4" /> Qu&apos;est-ce qu&apos;UMMISCO ?
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Une unité mixte internationale au service de la{" "}
              <span className="text-green-400">science de la durabilité</span>
            </h2>
            <div className="mt-6 space-y-4 text-slate-400 text-base leading-relaxed">
              <p>
                Fondée en <strong className="text-slate-200">2009</strong>, l&apos;<strong className="text-slate-200">UMI UMMISCO (UMI 209)</strong> est une unité mixte internationale à vocation méthodologique, spécialisée dans la <strong className="text-slate-200">modélisation mathématique et informatique des systèmes complexes</strong>.
              </p>
              <p>
                Elle rassemble des chercheurs de disciplines variées pour développer des approches novatrices de <strong className="text-slate-200">simulation, d&apos;analyse et d&apos;aide à la décision</strong>, appliquées aux systèmes naturels, biologiques et sociaux — sous la tutelle de l&apos;<strong className="text-slate-200">IRD</strong> et de <strong className="text-slate-200">Sorbonne Université</strong>.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/equipe" className="inline-flex items-center gap-2 rounded-lg bg-ummisco-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-ummisco-blue/90 active:scale-95 transition-all">
                <Users className="h-4 w-4" /> Découvrir l&apos;équipe
              </Link>
              <Link href="/axes" className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all">
                Nos axes de recherche <ArrowRight className="h-4 w-4" />
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
              <span>Présente en France, au Vietnam, au Sénégal, au Cameroun et au Maroc.</span>
            </div>
            {/* Logos tutelles */}
            <div className="mt-5 pt-5 border-t border-slate-800">
              <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-3">Tutelles</p>
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
      <section id="centres" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-900/10 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[28rem] w-[28rem] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <span className="text-[13px] mono-text uppercase tracking-widest text-green-400 font-bold mb-3 flex items-center gap-2"><Globe2 className="h-4 w-4" /> Réseau international</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Nos 5 centres dans le monde</h2>
            <p className="mt-4 max-w-xl text-slate-400 text-base leading-relaxed">
              UMMISCO est implantée sur trois continents. Faites tourner le globe : chaque point lumineux est un centre — cliquez-le pour découvrir ses recherches, ses tutelles et son équipe.
            </p>
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
      <section id="axes" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-900/10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <span className="text-[13px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">{t("axes.sectionTag")}</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">{t("axes.title")}</h2>
            <p className="mt-4 max-w-2xl text-slate-400 text-base leading-relaxed">Quatre axes complémentaires alliant modélisation fondamentale et applications concrètes de terrain.</p>
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
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-blue-500" /> Publications liées à l&apos;axe sélectionné</h4>
                <div className="space-y-4">
                  {PUBLICATIONS.filter((p) => p.axis === selectedAxis).map((p) => (
                    <div key={p.id} className="border-b border-slate-900/60 pb-3 last:border-b-0 last:pb-0"><div className="text-sm font-bold text-slate-200">{p.title}</div><div className="text-[13px] text-slate-400 mt-1">{p.authors.join(", ")} — {p.year}</div></div>
                  ))}
                  {PUBLICATIONS.filter((p) => p.axis === selectedAxis).length === 0 && (<div className="text-sm text-slate-500">Aucune publication indexée sur cet axe pour le moment.</div>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── LOGICIELS ─────────────────────────────────────────────────────── */}
      <section id="logiciels" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-900/10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <span className="text-[13px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2 flex items-center gap-2"><Boxes className="h-4 w-4 text-violet-400" /> Logiciels open source</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Des outils utilisés dans le monde entier</h2>
            <p className="mt-4 max-w-2xl text-slate-400 text-base leading-relaxed">UMMISCO conçoit et maintient des plateformes de modélisation reconnues internationalement.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOFTWARE_TOOLS.map((tool) => {
              const accent = SOFTWARE_ACCENT[tool.id] ?? "text-blue-400 bg-blue-500/10";
              return (
                <div key={tool.id} className="rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent} font-extrabold`}>
                      {tool.name.slice(0, 2)}
                    </span>
                    {tool.since && (<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">depuis {tool.since}</span>)}
                  </div>
                  <h3 className="text-base font-bold text-white">{tool.name}</h3>
                  <p className="mt-2 text-[13px] text-slate-400 leading-relaxed flex-1 line-clamp-4">{tool.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tool.tags.slice(0, 4).map((tag) => (<span key={tag} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{tag}</span>))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-900/60 flex items-center gap-4">
                    {tool.website && (<a href={tool.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-400 hover:text-blue-300"><ExternalLink className="h-3 w-3" /> Site</a>)}
                    {tool.github && (<a href={tool.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-400 hover:text-slate-200"><ExternalLink className="h-3 w-3" /> GitHub</a>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

{/* ── FEATURED PUBLICATIONS ─────────────────────────────────────────── */}
      <section id="publications" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap gap-4 justify-between items-end">
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
            {PUBLICATIONS.slice(0, 3).map((pub) => (
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-900/10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <span className="text-[13px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">Explorer la plateforme</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Tout l&apos;écosystème UMMISCO, en un endroit</h2>
            <p className="mt-4 max-w-2xl text-slate-400 text-base leading-relaxed">Publications référencées, datasets contrôlés, simulations intégrées et vie scientifique du laboratoire.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EXPLORE_LINKS.map((item) => {
              const Icon = item.Icon;
              return (
                <Link key={item.href} href={item.href} className="group rounded-xl border border-slate-800 bg-slate-900/10 p-6 hover:border-slate-700 hover:bg-slate-900/30 transition-all flex flex-col">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} ${item.accent} mb-4`}><Icon className="h-5 w-5" /></span>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">{item.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-400 group-hover:text-slate-200">Découvrir <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI ASSISTANT CALLOUT ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-900 bg-gradient-to-br from-blue-950/40 to-slate-900/20 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3"><MessageSquare className="h-5 w-5 text-blue-400" /><h3 className="text-lg font-bold text-white">Assistant IA UMMISCO</h3></div>
            <p className="text-sm text-slate-400 leading-relaxed">Posez vos questions sur nos axes, publications, datasets, chercheurs et événements. L&apos;assistant scientifique répond en français ou en anglais, 24h/24.</p>
          </div>
          <div className="text-[13px] text-slate-500 flex items-center gap-2 whitespace-nowrap"><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" /> Cliquez sur l&apos;icône en bas à droite</div>
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
                  <a href={scholarUrl(citationModalPub)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-[13px] font-bold text-slate-300 border border-slate-800 hover:text-white"><Quote className="h-3.5 w-3.5" /> Ouvrir dans Google Scholar</a>
                  {doiUrl(citationModalPub.doi) && (<a href={doiUrl(citationModalPub.doi)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-[13px] font-bold text-slate-300 border border-slate-800 hover:text-white"><ExternalLink className="h-3.5 w-3.5" /> Page de l&apos;éditeur (DOI)</a>)}
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
