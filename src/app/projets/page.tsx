"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Globe,
  FlaskConical,
  Brain,
  Cpu,
  Users,
  Filter,
  X,
  ChevronRight,
  Layers,
  MapPin,
  Tag,
  Search,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { PROJECTS, CENTERS, AXES, Project } from "@/data/ummiscoData";

// ─── Couleurs domaine ──────────────────────────────────────────────────────────

const DOMAIN_CONFIG: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  "Santé humaine":             { color: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/30",   dot: "bg-rose-400" },
  "Santé publique":            { color: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/30",   dot: "bg-rose-400" },
  "Environnement":             { color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/30",  dot: "bg-green-400" },
  "Gestion de l'eau et irrigation": { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30", dot: "bg-cyan-400" },
  "Société":                   { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", dot: "bg-purple-400" },
  "Biodiversité":              { color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/30",dot: "bg-emerald-400" },
  "Mobilité urbaine":          { color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30",  dot: "bg-amber-400" },
};

const defaultDomain = { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30", dot: "bg-slate-400" };

function getDomainConfig(domain: string) {
  for (const [key, val] of Object.entries(DOMAIN_CONFIG)) {
    if (domain.includes(key)) return val;
  }
  return defaultDomain;
}

// ─── Couleurs centres ──────────────────────────────────────────────────────────

const CENTER_COLORS: Record<string, string> = {
  france:          "bg-blue-500/20 text-blue-300 border-blue-500/30",
  asie:            "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "afrique-ouest": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "afrique-centrale": "bg-red-500/20 text-red-300 border-red-500/30",
  mediterranee:    "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

// ─── Couleurs thèmes ───────────────────────────────────────────────────────────

const THEME_COLORS: Record<string, string> = {
  agents:      "bg-blue-500/15 text-blue-400 border-blue-500/25",
  ia:          "bg-violet-500/15 text-violet-400 border-violet-500/25",
  capteurs:    "bg-green-500/15 text-green-400 border-green-500/25",
  participatif:"bg-amber-500/15 text-amber-400 border-amber-500/25",
};

const THEME_ICON: Record<string, React.ElementType> = {
  agents:      Brain,
  ia:          Cpu,
  capteurs:    FlaskConical,
  participatif:Users,
};

// ─── Tous les domaines distincts ───────────────────────────────────────────────

function getDistinctDomains(projects: Project[]): string[] {
  const raw = projects.flatMap((p) => p.domain.split(", "));
  return Array.from(new Set(raw)).sort();
}

// ─── Carte projet ──────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const dc = getDomainConfig(project.domain);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50 transition-all duration-300 overflow-hidden"
    >
      {/* Bande couleur domaine */}
      <div className={`h-1 w-full ${dc.dot.replace("bg-", "bg-")} opacity-80`} />

      <div className="flex-1 flex flex-col p-6">
        {/* En-tête */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
              {project.name}
            </h3>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${dc.bg} ${dc.color} ${dc.border}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${dc.dot}`} />
                {project.domain.split(", ")[0]}
              </span>
            </div>
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none p-2 rounded-lg border border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all"
              aria-label={`Voir ${project.name} sur ummisco.fr`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed flex-1 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Axes / thèmes */}
        <div className="mb-4">
          <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-1.5 block">Axes</span>
          <div className="flex flex-wrap gap-1">
            {project.themes.map((themeId) => {
              const ThemeIcon = THEME_ICON[themeId] || Tag;
              const axis = AXES.find((a) => a.id === themeId);
              return (
                <span
                  key={themeId}
                  className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded border ${THEME_COLORS[themeId] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}
                >
                  <ThemeIcon className="h-2.5 w-2.5" />
                  {axis?.shortName ?? themeId}
                </span>
              );
            })}
          </div>
        </div>

        {/* Centres */}
        <div>
          <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-1.5 block flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5" /> Centres
          </span>
          <div className="flex flex-wrap gap-1">
            {project.centers.map((centerId) => {
              const center = CENTERS.find((c) => c.id === centerId);
              return (
                <span
                  key={centerId}
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${CENTER_COLORS[centerId] ?? "bg-slate-800 text-slate-300 border-slate-700"}`}
                >
                  {center?.country ?? centerId}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────

export default function ProjetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [activeCenter, setActiveCenter] = useState<string | null>(null);

  const allDomains = useMemo(() => getDistinctDomains(PROJECTS), []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      if (activeTheme && !p.themes.includes(activeTheme)) return false;
      if (activeDomain && !p.domain.includes(activeDomain)) return false;
      if (activeCenter && !p.centers.includes(activeCenter)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.domain.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [searchQuery, activeTheme, activeDomain, activeCenter]);

  const hasActiveFilter = activeTheme || activeDomain || activeCenter || searchQuery.trim();

  function resetFilters() {
    setActiveTheme(null);
    setActiveDomain(null);
    setActiveCenter(null);
    setSearchQuery("");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* ── En-tête ── */}
        <div className="relative mb-14">
          {/* Arrière-plan décoratif */}
          <div className="absolute -top-6 left-0 -z-10 h-56 w-56 rounded-full bg-blue-600/10 blur-[90px] pointer-events-none" />
          <div className="absolute -top-6 right-0 -z-10 h-48 w-48 rounded-full bg-green-600/10 blur-[80px] pointer-events-none" />

          <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
            Recherche & Innovation
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Projets de Recherche
          </h1>
          <p className="mt-3 text-slate-400 text-sm max-w-2xl leading-relaxed">
            Découvrez les{" "}
            <span className="text-white font-semibold">{PROJECTS.length} projets</span>{" "}
            actifs d'UMMISCO UMI 209, couvrant la modélisation, l'IA, les capteurs et la science citoyenne dans{" "}
            <span className="text-white font-semibold">5 centres internationaux</span>.
          </p>

          {/* Logos financeurs */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Financé par :</span>
            {[
              { src: "/logos/logo_anr.png", alt: "ANR" },
              { src: "/logos/logo_ird.webp", alt: "IRD" },
              { src: "/logos/logo_irn.png", alt: "IRN" },
              { src: "/logos/logo_cnrs.png", alt: "CNRS" },
            ].map(({ src, alt }) => (
              <div key={alt} className="h-8 w-14 bg-white rounded p-1 flex items-center justify-center shadow-sm">
                <img src={src} alt={alt} className="h-full w-full object-contain" />
              </div>
            ))}
          </div>

          {/* Statistiques rapides */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: PROJECTS.length, label: "Projets actifs", color: "text-blue-400" },
              { value: allDomains.length, label: "Domaines couverts", color: "text-green-400" },
              { value: CENTERS.length, label: "Centres impliqués", color: "text-violet-400" },
              { value: AXES.length, label: "Axes thématiques", color: "text-amber-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-center"
              >
                <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Filtres ── */}
        <div className="mb-8 space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un projet (nom, domaine, description…)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filtres par axe */}
          <div>
            <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-2 block flex items-center gap-1">
              <Layers className="h-2.5 w-2.5" /> Filtrer par axe
            </span>
            <div className="flex flex-wrap gap-2">
              {AXES.map((axis) => {
                const isActive = activeTheme === axis.id;
                return (
                  <button
                    key={axis.id}
                    onClick={() => setActiveTheme(isActive ? null : axis.id)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      isActive
                        ? `${THEME_COLORS[axis.id]} border-opacity-60`
                        : "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {axis.shortName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtres par centre */}
          <div>
            <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-2 block flex items-center gap-1">
              <Globe className="h-2.5 w-2.5" /> Filtrer par centre
            </span>
            <div className="flex flex-wrap gap-2">
              {CENTERS.map((center) => {
                const isActive = activeCenter === center.id;
                return (
                  <button
                    key={center.id}
                    onClick={() => setActiveCenter(isActive ? null : center.id)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      isActive
                        ? `${CENTER_COLORS[center.id]} border-opacity-60`
                        : "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {center.country}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Résultats + reset */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {filtered.length} projet{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}
              {hasActiveFilter && " (filtré)"}
            </span>
            {hasActiveFilter && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition"
              >
                <X className="h-3 w-3" /> Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* ── Grille de projets ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <Filter className="h-10 w-10 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">Aucun projet ne correspond aux filtres sélectionnés.</p>
              <button onClick={resetFilters} className="mt-4 text-blue-400 hover:text-blue-300 text-xs underline">
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Carte des centres ── */}
        <section className="mt-20">
          <div className="border-b border-slate-900 pb-4 mb-8">
            <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-1">
              Réseau International
            </span>
            <h2 className="text-xl font-extrabold text-white">5 Centres de Recherche</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CENTERS.map((center, i) => {
              const centerProjects = PROJECTS.filter((p) => p.centers.includes(center.id));
              return (
                <motion.div
                  key={center.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`rounded-xl border p-5 ${CENTER_COLORS[center.id]?.replace("text-", "border-").replace(/bg-\S+/, "bg-slate-900/30") ?? "border-slate-800 bg-slate-900/30"}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-white">{center.name}</h3>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        {center.city}
                      </p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${CENTER_COLORS[center.id] ?? "text-slate-400 border-slate-700"}`}>
                      {centerProjects.length} projet{centerProjects.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 mb-3">
                    {center.description}
                  </p>
                  <a
                    href={`/centres/${center.id}`}
                    className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition"
                  >
                    Voir le centre <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── CTA vers publications ── */}
        <section className="mt-16">
          <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-blue-900/20 via-slate-900/30 to-green-900/20 p-8 text-center">
            <h2 className="text-lg font-bold text-white mb-2">
              Ces projets génèrent des résultats scientifiques
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-xl mx-auto">
              Consultez les publications, datasets et simulations issus de ces projets de recherche.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition"
              >
                Publications <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/datasets"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition"
              >
                Datasets <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/simulations"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition"
              >
                Simulations <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
