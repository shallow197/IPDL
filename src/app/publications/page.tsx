"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Clipboard,
  Check,
  Lock,
  Eye,
  Shield,
  Quote,
  ExternalLink,
} from "lucide-react";
import {
  AXES,
  RESEARCHERS,
  PUBLICATIONS,
  Publication
} from "@/data/ummiscoData";
import Footer from "@/components/Footer";
import { scholarUrl, doiUrl, UMMISCO_SCHOLAR_SEARCH } from "@/lib/scholar";

export default function PublicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAxis, setSelectedAxis] = useState<string>("all");
  const [selectedResearcher, setSelectedResearcher] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [copiedPubId, setCopiedPubId] = useState<string | null>(null);
  const [citationModalPub, setCitationModalPub] = useState<Publication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Filter lists configuration
  const uniqueYears = Array.from(new Set(PUBLICATIONS.map((p) => p.year))).sort((a, b) => b - a);

  // Filter processing
  const filteredPublications = PUBLICATIONS.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAxis = selectedAxis === "all" || pub.axis === selectedAxis;
    const matchesResearcher =
      selectedResearcher === "all" || pub.researcherIds.includes(selectedResearcher);
    const matchesYear = selectedYear === "all" || pub.year.toString() === selectedYear;

    return matchesSearch && matchesAxis && matchesResearcher && matchesYear;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPublications.length / ITEMS_PER_PAGE));
  const paginatedPublications = filteredPublications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedAxis, selectedResearcher, selectedYear]);

  const paginationPages = (() => {
    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);

    for (let offset = -2; offset <= 2; offset += 1) {
      const page = currentPage + offset;
      if (page >= 1 && page <= totalPages) {
        pages.add(page);
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  })();

  const handleCopyCitation = (text: string, pubId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPubId(pubId);
    setTimeout(() => setCopiedPubId(null), 2000);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAxis("all");
    setSelectedResearcher("all");
    setSelectedYear("all");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b border-slate-900 pb-8 mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
              Archive scientifique ouverte
            </span>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Publications d&apos;UMMISCO
            </h1>
            <p className="mt-2 text-slate-400 text-xs sm:text-sm max-w-2xl">
              Les publications sont validées par des revues internationales puis référencées ici — chaque entrée renvoie vers Google Scholar et le DOI de l&apos;éditeur, sans hébergement de PDF.
            </p>
            <div aria-hidden className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
          </div>
          <a
            href={UMMISCO_SCHOLAR_SEARCH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/40 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          >
            <Quote className="h-3.5 w-3.5" /> Profil Google Scholar <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* LEFT SIDEBAR: FILTERS */}
          <div className="lg:col-span-4 rounded-xl border border-slate-900 bg-slate-900/10 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-500" />
                Filtres de recherche
              </h3>
              <button
                onClick={resetFilters}
                className="text-[10px] text-slate-500 hover:text-slate-300 font-semibold"
              >
                Réinitialiser
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Mot-clé / Titre
              </label>
              <div className="relative rounded-lg border border-slate-800 bg-slate-950/60 focus-within:border-blue-500/50">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-300 pl-9 pr-3 py-2.5 focus:outline-none"
                />
              </div>
            </div>

            {/* Axis Filter */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Axe Thématique
              </label>
              <select
                value={selectedAxis}
                onChange={(e) => setSelectedAxis(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 px-3 py-2.5 focus:outline-none focus:border-blue-500/50"
              >
                <option value="all">Tous les axes</option>
                {AXES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Researcher Filter */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Chercheur auteur
              </label>
              <select
                value={selectedResearcher}
                onChange={(e) => setSelectedResearcher(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 px-3 py-2.5 focus:outline-none focus:border-blue-500/50"
              >
                <option value="all">Tous les chercheurs</option>
                {RESEARCHERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Année de publication
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 px-3 py-2.5 focus:outline-none focus:border-blue-500/50"
              >
                <option value="all">Toutes les années</option>
                {uniqueYears.map((y) => (
                  <option key={y} value={y.toString()}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT CONTENT: PUBLICATIONS LIST */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-slate-500 gap-3">
              <span>{filteredPublications.length} publication(s) trouvée(s)</span>
              <span>Affichage {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredPublications.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredPublications.length)} sur {filteredPublications.length}</span>
            </div>

            <div className="space-y-4">
              {paginatedPublications.map((pub) => {
                const isPublic = pub.accessLevel === "public";
                const isProtected = pub.accessLevel === "protected";
                const isPrivate = pub.accessLevel === "private";

                return (
                  <div
                    key={pub.id}
                    className="rounded-xl border border-slate-900 bg-slate-900/10 p-6 flex flex-col justify-between hover:border-slate-800/80 transition-colors"
                  >
                    <div>
                      {/* Meta header */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                          {AXES.find((a) => a.id === pub.axis)?.name} · {pub.year}
                        </span>
                        
                        {/* visibility badge */}
                        <div>
                          {isPublic && (
                            <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-2 py-0.5 text-[8px] font-bold text-green-400 border border-green-900/30 uppercase tracking-wider">
                              <Eye className="h-2 w-2" /> Public
                            </span>
                          )}
                          {isProtected && (
                            <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-2 py-0.5 text-[8px] font-bold text-blue-400 border border-blue-900/30 uppercase tracking-wider">
                              <Lock className="h-2 w-2" /> Protégé
                            </span>
                          )}
                          {isPrivate && (
                            <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-0.5 text-[8px] font-bold text-red-400 border border-red-900/30 uppercase tracking-wider">
                              <Shield className="h-2 w-2" /> Privé
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-white leading-snug">{pub.title}</h3>
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed font-serif">
                        {pub.abstract}
                      </p>
                    </div>

                    {/* Authors & actions */}
                    <div className="mt-6 pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[10px] text-slate-500 italic">
                        Auteurs : {pub.authors.join(", ")}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={scholarUrl(pub)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1.5 text-[10px] font-bold text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
                          title="Voir sur Google Scholar"
                        >
                          <Quote className="h-3 w-3" /> Scholar
                        </a>
                        {doiUrl(pub.doi) && (
                          <a
                            href={doiUrl(pub.doi)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded bg-slate-900 px-2.5 py-1.5 text-[10px] font-bold text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-all"
                            title="Résoudre le DOI"
                          >
                            <ExternalLink className="h-3 w-3" /> DOI
                          </a>
                        )}
                        <button
                          onClick={() => setCitationModalPub(pub)}
                          className="inline-flex items-center gap-1.5 rounded bg-blue-600/10 px-2.5 py-1.5 text-[10px] font-bold text-blue-400 border border-blue-900/30 hover:bg-blue-600/20 active:scale-95 transition-all"
                        >
                          <Clipboard className="h-3 w-3" />
                          <span>Citer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredPublications.length === 0 && (
                <div className="rounded-xl border border-slate-900 border-dashed p-12 text-center text-slate-500 text-xs">
                  Aucune publication ne correspond à vos critères de filtrage.
                </div>
              )}
            </div>

            {filteredPublications.length > ITEMS_PER_PAGE && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Précédent
                </button>

                {paginationPages.map((page, index) => {
                  const isGap = index > 0 && page - paginationPages[index - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {isGap && (
                        <span className="px-2 text-xs text-slate-500">…</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "border border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* CITATION MODAL POPUP */}
      <AnimatePresence>
        {citationModalPub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
                <h3 className="text-sm font-bold text-white">Générateur de Citation</h3>
                <button
                  onClick={() => setCitationModalPub(null)}
                  className="text-xs text-slate-500 hover:text-slate-200"
                >
                  Fermer
                </button>
              </div>

              <div className="space-y-6">
                {/* APA */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Format APA</span>
                    <button
                      onClick={() => handleCopyCitation(citationModalPub.citationApa, "apa")}
                      className="inline-flex items-center gap-1 hover:text-white"
                    >
                      {copiedPubId === "apa" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Clipboard className="h-3.5 w-3.5" />}
                      <span>Copier APA</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 text-xs text-slate-300 leading-relaxed font-mono select-all">
                    {citationModalPub.citationApa}
                  </div>
                </div>

                {/* BibTeX */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Format BibTeX</span>
                    <button
                      onClick={() => handleCopyCitation(citationModalPub.citationBibtex, "bibtex")}
                      className="inline-flex items-center gap-1 hover:text-white"
                    >
                      {copiedPubId === "bibtex" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Clipboard className="h-3.5 w-3.5" />}
                      <span>Copier BibTeX</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-lg bg-slate-950 border border-slate-900 text-[10px] text-slate-300 leading-relaxed font-mono overflow-x-auto select-all max-h-40">
                    {citationModalPub.citationBibtex}
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
