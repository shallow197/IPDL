"use client";

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
} from "lucide-react";
import {
  AXES,
  CENTERS,
} from "@/data/ummiscoData";
import Footer from "@/components/Footer";
import PartnersBanner from "@/components/PartnersBanner";
import StatsCounter from "@/components/StatsCounter";
import { CENTRE_VISUALS } from "@/components/CentreGlobe";
import GlobeCentres from "@/components/GlobeCentres";
import { useLang } from "@/context/LangContext";

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

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-center min-h-[82vh] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-900">
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
            {t("hero.badge")}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mt-6">
            {t("hero.title1")} <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-green-400 bg-clip-text text-transparent">{t("hero.titleHighlight")}</span> {t("hero.title2")}
          </motion.h1>

        </div>
      </section>

      {/* ── INTRO / PRÉSENTATION ──────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900 relative overflow-hidden">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 -z-10 h-80 w-80 rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="mb-6 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
              <img src="/themes/allthemes.webp" alt="Axes thématiques UMMISCO" className="w-full h-48 object-cover" />
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
                agents: "/themes/modelisation.jpg",
                ia: "/themes/intelligence.jpg",
                capteurs: "/themes/capteurs.jpg",
                participatif: "/themes/science_citoyenne.jpg",
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

      {/* ── AI ASSISTANT CALLOUT ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-900 bg-gradient-to-br from-blue-950/40 to-slate-900/20 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-blue-400" /><h3 className="text-lg font-bold text-white">{t("home.aiTitle")}</h3><span className="flex items-center gap-1.5 text-[13px] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" /> {t("home.aiAvail")}</span></div>
        </div>
      </section>

      <PartnersBanner />
      <Footer />
    </div>
  );
}
