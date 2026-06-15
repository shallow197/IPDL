"use client";

import React, { useState, useEffect } from "react";
import { Globe, ExternalLink, Filter, FileText, Package, Database, Lock, Eye, Coins } from "lucide-react";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LangContext";
import type { DBPartner } from "@/lib/db";

// ── Délivrables & bailleurs (fenêtre dédiée demandée au cahier des charges) ──
interface Deliverable {
  id: string;
  titre: string;
  projet: string;
  bailleur: string;
  type: "Rapport" | "Logiciel" | "Note de synthèse" | "Dataset";
  annee: number;
  acces: "public" | "protected";
}

const DELIVERABLES: Deliverable[] = [
  { id: "dl-01", titre: "Rapport d'avancement scientifique DiDEM", projet: "DiDEM", bailleur: "ANR", type: "Rapport", annee: 2024, acces: "protected" },
  { id: "dl-02", titre: "Plateforme de simulation HABITABLE (livrable D3.2)", projet: "HABITABLE", bailleur: "ANR", type: "Logiciel", annee: 2024, acces: "public" },
  { id: "dl-03", titre: "Note de synthèse — politiques d'intervention COMOKIT", projet: "COMOKIT", bailleur: "IRD", type: "Note de synthèse", annee: 2023, acces: "public" },
  { id: "dl-04", titre: "Jeu de données ouvert qualité de l'air AIRQALY", projet: "AIRQALY-4-ASMAFRI", bailleur: "Programme IRN", type: "Dataset", annee: 2025, acces: "public" },
  { id: "dl-05", titre: "Rapport final — surveillance de la tuberculose EPICAM", projet: "EPICAM", bailleur: "ANR", type: "Rapport", annee: 2023, acces: "protected" },
  { id: "dl-06", titre: "Livrable participatif — jeu sérieux Waqatali", projet: "Waqatali", bailleur: "IRD", type: "Logiciel", annee: 2024, acces: "public" },
];

const DELIVERABLE_ICONS: Record<Deliverable["type"], React.ElementType> = {
  Rapport: FileText,
  Logiciel: Package,
  "Note de synthèse": FileText,
  Dataset: Database,
};

const TYPE_COLORS: Record<string, string> = {
  academique: "bg-blue-500/10 text-blue-400 border-blue-900/30",
  institutionnel: "bg-green-500/10 text-green-400 border-green-900/30",
  industriel: "bg-purple-500/10 text-purple-400 border-purple-900/30",
  bailleur: "bg-amber-500/10 text-amber-400 border-amber-900/30",
};

const TYPE_LABELS: Record<string, string> = {
  academique: "Académique",
  institutionnel: "Institutionnel",
  industriel: "Industriel",
  bailleur: "Bailleur",
};

// Map des logos disponibles localement — clé = mots-clefs du nom du partenaire
const PARTNER_LOGOS: Array<{ keywords: string[]; logo: string }> = [
  { keywords: ["ird", "recherche pour le développement"], logo: "/logos/logo_ird.webp" },
  { keywords: ["ucad", "cheikh anta diop"],               logo: "/logos/logo_ucad.png" },
  { keywords: ["anr", "nationale de la recherche"],       logo: "/logos/logo_anr.png" },
  { keywords: ["sorbonne"],                               logo: "/logos/logo_sorbonne.png" },
  { keywords: ["cnrs"],                                   logo: "/logos/logo_cnrs.png" },
  { keywords: ["inria"],                                  logo: "/logos/logo_inria.jpg" },
  { keywords: ["cirad"],                                  logo: "/logos/logo_cirad.jpg" },
  { keywords: ["irn"],                                    logo: "/logos/logo_irn.png" },
  { keywords: ["esp", "école supérieure polytechnique"],  logo: "/logos/logo_esp.jpg" },
  { keywords: ["vinuniversity", "vinuni"],                logo: "/logos/logo_vinuniversity.png" },
  { keywords: ["yaoundé", "uy1"],                         logo: "/logos/logo_uy1.jpg" },
  { keywords: ["cadi ayyad", "uca"],                      logo: "/logos/logo_uca.png" },
  { keywords: ["alioune diop", "uadb"],                   logo: "/logos/logo_uadb.jpg" },
  { keywords: ["ugb", "gaston berger"],                   logo: "/logos/logo_ugb.webp" },
  {keywords: ["institut pasteur", "pasteur"],             logo: "/logos/logo_institutpasteur.png"},
  {keywords: ["saed"],                                    logo: "/logos/logo_saed.jpg"},
  {keywords: ["inrae"],                                    logo: "/logos/logo_inrae.png"},
];

function getPartnerLogo(nom: string): string | null {
  const lower = nom.toLowerCase();
  for (const entry of PARTNER_LOGOS) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry.logo;
  }
  return null;
}

export default function PartenairesPage() {
  const { t } = useLang();
  const [partners, setPartners] = useState<DBPartner[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partners")
      .then((r) => r.json())
      .then(setPartners)
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? partners : partners.filter((p) => p.type === filter);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-slate-900 pb-8 mb-10">
          <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
            Réseau International
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{t("partners.title")}</h1>
          <p className="mt-2 text-slate-400 text-sm max-w-2xl">{t("partners.description")}</p>
          <div aria-hidden className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />

          {/* Mosaïque de logos institutionnels */}
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            {[
              { src: "/logos/logo_ird.webp",         alt: "IRD" },
              { src: "/logos/logo_sorbonne.png",      alt: "Sorbonne Université" },
              { src: "/logos/logo_ucad.png",          alt: "UCAD" },
              { src: "/logos/logo_cnrs.png",          alt: "CNRS" },
              { src: "/logos/logo_inria.jpg",         alt: "INRIA" },
              { src: "/logos/logo_cirad.jpg",         alt: "CIRAD" },
              { src: "/logos/logo_anr.png",           alt: "ANR" },
              { src: "/logos/logo_irn.png",           alt: "IRN" },
              { src: "/logos/logo_uca.png",           alt: "Université Cadi Ayyad" },
              { src: "/logos/logo_uy1.jpg",           alt: "Université de Yaoundé I" },
              { src: "/logos/logo_vinuniversity.png", alt: "VinUniversity" },
              { src: "/logos/logo_esp.jpg",           alt: "ESP" },
              { src: "/logos/logo_ugb.webp",          alt: "UGB" },
              { src: "/logos/logo_uadb.jpg",          alt: "UADB" },
              { src: "/logos/logo_institutpasteur.png", alt: "Institut Pasteur" },
              { src: "/logos/logo_saed.jpg",            alt: "SAED" },
              { src: "/logos/logo_inrae.png",            alt: "INRAE" },
            ].map(({ src, alt }) => (
              <div key={alt} className="h-12 w-24 rounded-lg p-2 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow" style={{backgroundColor: "#ffffff"}}>
                <img src={src} alt={alt} className="max-h-full max-w-full object-contain" title={alt} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Délivrables & Bailleurs (fenêtre dédiée) ───────────────── */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 flex-none">
              <Coins className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-white">Délivrables &amp; Bailleurs</h2>
              <p className="text-[11px] text-slate-500 max-w-2xl">
                Productions livrées dans le cadre des projets financés (rapports, logiciels, jeux de données) — accès selon le niveau de confidentialité.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((d) => {
              const Icon = DELIVERABLE_ICONS[d.type];
              const isPublic = d.acces === "public";
              return (
                <div key={d.id} className="rounded-xl border border-slate-900 bg-slate-900/10 p-5 flex flex-col hover:border-slate-800 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex-none">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${isPublic ? "bg-green-500/10 text-green-400 border-green-900/30" : "bg-blue-500/10 text-blue-400 border-blue-900/30"}`}>
                      {isPublic ? <><Eye className="h-2.5 w-2.5" /> Public</> : <><Lock className="h-2.5 w-2.5" /> Protégé</>}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{d.titre}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
                    <span>Projet : <strong className="text-slate-400">{d.projet}</strong></span>
                    <span>Type : <strong className="text-slate-400">{d.type}</strong></span>
                    <span>{d.annee}</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-900/60">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400">
                      <Coins className="h-3 w-3" /> Financé par {d.bailleur}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="border-b border-slate-900 pb-4 mb-8">
          <h2 className="text-lg font-extrabold text-white">Partenaires &amp; tutelles</h2>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <Filter className="h-3 w-3" /> Type :
          </div>
          {["all", "academique", "institutionnel", "bailleur", "industriel"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-all ${
                filter === f
                  ? "bg-blue-600/20 text-blue-400 border-blue-900/40"
                  : "border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
            >
              {f === "all" ? "Tous" : TYPE_LABELS[f]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">{t("common.loading")}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-900 bg-slate-950 p-6 flex flex-col hover:border-slate-800 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-14 w-20 rounded-xl flex items-center justify-center flex-none p-2 shadow" style={{ backgroundColor: "#ffffff" }}>
                    {(() => {
                      const logo = getPartnerLogo(p.nom);
                      return logo
                        ? <img src={logo} alt={p.nom} className="max-h-full max-w-full object-contain" />
                        : <Globe className="h-6 w-6 text-slate-400" />;
                    })()}
                  </div>
                  <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${TYPE_COLORS[p.type]}`}>
                    {TYPE_LABELS[p.type]}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug mb-2">{p.nom}</h3>
                <p className="text-[10px] text-slate-500 mb-1">{t("partners.country")} : <strong className="text-slate-400">{p.pays}</strong></p>
                <p className="text-xs text-slate-400 leading-relaxed flex-1 mb-4">{p.description}</p>

                {p.projets.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{t("partners.projects")}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.projets.map((proj) => (
                        <span key={proj} className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                          {proj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-semibold mt-auto"
                >
                  {t("partners.viewSite")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-3 rounded-xl border border-slate-900 border-dashed p-12 text-center text-slate-500 text-xs">
                {t("common.noData")}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
