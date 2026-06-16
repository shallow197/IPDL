"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  Wallet,
  Users,
  Building2,
  Tag,
} from "lucide-react";
import { PROJECTS, CENTERS, AXES } from "@/data/ummiscoData";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Style uniforme des badges (catégorie / centre) — une seule couleur par type,
// cohérente avec /projets, au lieu d'une couleur différente par valeur.
const DOMAIN_BADGE = { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" };
const CENTER_BADGE = "bg-slate-800 text-slate-300 border-slate-700";

export default function ProjetDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) notFound();

  const ds = DOMAIN_BADGE;

  const meta: { icon: React.ElementType; label: string; value: string }[] = [
    project.chefProjet   && { icon: Users,     label: "Chef de projet",         value: project.chefProjet },
    project.duree        && { icon: Clock,      label: "Durée",                  value: project.duree },
    project.dateDebut    && { icon: Calendar,   label: "Date de début",          value: project.dateDebut },
    project.budget       && { icon: Wallet,     label: "Budget total",           value: project.budget },
    project.financement  && { icon: Wallet,     label: "Financement",            value: project.financement },
    project.institutionPorteuse && { icon: Building2, label: "Institution porteuse", value: project.institutionPorteuse },
    project.partenaires  && { icon: Building2,  label: "Partenaires",            value: project.partenaires },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Retour */}
        <Link
          href="/projets"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux projets
        </Link>

        {/* Image / logo */}
        {project.image && (
          <div className="w-full rounded-2xl overflow-hidden border border-slate-800 mb-10 flex items-center justify-center p-8 bg-white" style={{ minHeight: 180 }}>
            <img
              src={project.image}
              alt={project.name}
              className="max-h-40 w-auto object-contain"
            />
          </div>
        )}

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${ds.bg} ${ds.text} ${ds.border}`}>
              <Tag className="h-3 w-3" />
              {project.domain.split(", ")[0]}
            </span>
            {project.themes.map((themeId) => {
              const axis = AXES.find((a) => a.id === themeId);
              return axis ? (
                <span key={themeId} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {axis.shortName}
                </span>
              ) : null;
            })}
          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl leading-tight">
            {project.name}
          </h1>

          {/* Centres */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            {project.centers.map((centerId) => {
              const center = CENTERS.find((c) => c.id === centerId);
              return (
                <span
                  key={centerId}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${CENTER_BADGE}`}
                >
                  {center?.country ?? centerId}
                </span>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <section className="mb-8">
          <p className="text-slate-300 leading-relaxed text-base">{project.description}</p>
        </section>

        {/* Métadonnées */}
        {meta.length > 0 && (
          <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden divide-y divide-slate-800">
            {meta.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 px-6 py-4">
                <Icon className="h-4 w-4 text-slate-500 flex-none mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">{label}</p>
                  <p className="text-sm text-white break-words">{value}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Bouton En savoir plus */}
        {project.projectWebsite && (
          <a
            href={project.projectWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 active:scale-[0.98] transition-all"
          >
            En savoir plus <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </main>

      <Footer />
    </div>
  );
}
