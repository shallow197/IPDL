"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, BookOpen, Users, FlaskConical, Cpu, Globe, TreePine, Wrench } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { PUBLICATIONS, RESEARCHERS } from "@/data/ummiscoData";

const AXES_DATA = [
  {
    id: "epidemiology",
    name: "Épidémiologie & Santé",
    icon: FlaskConical,
    color: "blue",
    description: "Modélisation mathématique et informatique des maladies infectieuses (paludisme, dengue, tuberculose). Approches multi-agents et systèmes dynamiques couplés aux données épidémiologiques de terrain.",
    keywords: ["Paludisme", "Dengue", "Modèle SEIR", "Multi-agents", "Institut Pasteur"],
    lead: "Dr. Fatou Diop",
  },
  {
    id: "iot",
    name: "IoT & Systèmes Embarqués",
    icon: Cpu,
    color: "green",
    description: "Déploiement de réseaux de capteurs IoT à basse consommation (LoRaWAN, ESP32) pour la surveillance environnementale, hydrologique et la résilience urbaine. FabLab et prototypage ouvert.",
    keywords: ["LoRaWAN", "ESP32", "Smart sensors", "Inondations", "Qualité eau"],
    lead: "Dr. Moussa Ndiaye",
  },
  {
    id: "citizen-science",
    name: "Science Citoyenne",
    icon: Users,
    color: "purple",
    description: "Mobilisation de données participatives via des applications citoyennes. Couplage données crowdsourced – modèles scientifiques pour la cartographie de la pollution et des risques environnementaux.",
    keywords: ["Crowdsourcing", "PM2.5", "Pollution", "Participation", "Données ouvertes"],
    lead: "Dr. Amadou Faye",
  },
  {
    id: "environment",
    name: "Environnement & Risques",
    icon: Globe,
    color: "amber",
    description: "Modélisation hydro-sédimentaire, érosion côtière, dynamique des écosystèmes. Simulations sous scénarios de changement climatique pour la gestion des risques naturels au Sénégal.",
    keywords: ["Érosion côtière", "Inondations", "Changement climatique", "Langue de Barbarie"],
    lead: "Prof. Cheikh Diallo",
  },
  {
    id: "fablab",
    name: "FabLab & Prototypage",
    icon: Wrench,
    color: "red",
    description: "Conception de matériel scientifique open-source : pluviomètres 3D, stations météo ESP32, équipements de mesure reproductibles à coût réduit pour les pays du Sud.",
    keywords: ["Open hardware", "Impression 3D", "ESP32", "Low-cost", "Reproductible"],
    lead: "Dr. Moussa Ndiaye",
  },
];

const colorMap: Record<string, string> = {
  blue: "border-blue-500 bg-blue-500/5",
  green: "border-green-500 bg-green-500/5",
  purple: "border-purple-500 bg-purple-500/5",
  amber: "border-amber-500 bg-amber-500/5",
  red: "border-red-500 bg-red-500/5",
};

const iconColorMap: Record<string, string> = {
  blue: "text-blue-400",
  green: "text-green-400",
  purple: "text-purple-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

export default function AxesPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-slate-900 pb-8 mb-12">
          <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
            Activités Scientifiques
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Axes Thématiques de Recherche</h1>
          <p className="mt-3 text-slate-400 text-sm max-w-2xl leading-relaxed">
            Les travaux d'UMMISCO s'organisent autour de cinq piliers alliant modélisation fondamentale et applications concrètes dans les pays du Sud.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AXES_DATA.map((axis) => {
            const Icon = axis.icon;
            const isSelected = selected === axis.id;
            return (
              <div key={axis.id}>
                <button
                  onClick={() => setSelected(isSelected ? null : axis.id)}
                  className={`w-full text-left rounded-xl border p-6 transition-all duration-300 ${
                    isSelected
                      ? colorMap[axis.color]
                      : "border-slate-900 bg-slate-900/10 hover:border-slate-800 hover:bg-slate-900/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className={`h-6 w-6 ${isSelected ? iconColorMap[axis.color] : "text-slate-600"}`} />
                    <ChevronRight className={`h-4 w-4 text-slate-600 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{axis.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{axis.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {axis.keywords.slice(0, 3).map((k) => (
                      <span key={k} className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
                        {k}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Expanded panel below card */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/30 p-6">
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">{axis.description}</p>

                        <div className="mb-4">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Responsable :</span>
                          <span className="text-[10px] text-slate-300 ml-1.5">{axis.lead}</span>
                        </div>

                        <div className="mb-4">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-2">Mots-clefs :</span>
                          <div className="flex flex-wrap gap-1">
                            {axis.keywords.map((k) => (
                              <span key={k} className="text-[9px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <BookOpen className="h-3 w-3" /> Publications ({PUBLICATIONS.filter((p) => p.axis === axis.id).length})
                          </h4>
                          <div className="space-y-2">
                            {PUBLICATIONS.filter((p) => p.axis === axis.id).slice(0, 3).map((p) => (
                              <div key={p.id} className="text-[11px] text-slate-400 border-l-2 border-slate-700 pl-3">
                                <span className="font-semibold text-slate-300 line-clamp-1">{p.title}</span>
                                <span className="text-slate-500"> — {p.authors.join(", ")} ({p.year})</span>
                              </div>
                            ))}
                            {PUBLICATIONS.filter((p) => p.axis === axis.id).length === 0 && (
                              <p className="text-xs text-slate-500 italic">Aucune publication indexée sur cet axe.</p>
                            )}
                          </div>
                        </div>

                        <Link href="/publications" className="inline-flex items-center gap-1 mt-4 text-[10px] text-blue-400 hover:text-blue-300 font-semibold">
                          <span>Toutes les publications</span>
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Researchers by axis */}
        <div className="mt-16">
          <h2 className="text-xl font-extrabold text-white mb-6 border-b border-slate-900 pb-4">
            Chercheurs par Axe
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESEARCHERS.map((r) => (
              <Link key={r.id} href={`/chercheurs/${r.id}`} className="rounded-xl border border-slate-900 bg-slate-950 p-5 hover:border-slate-800 transition-colors group">
                {r.photoUrl ? (
                  <img
                    src={r.photoUrl}
                    alt={r.name}
                    className="h-14 w-14 rounded-full object-cover object-top mb-3 border border-slate-800 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/10 text-blue-400 text-base font-bold border border-blue-900/30 mb-3 group-hover:scale-105 transition-transform">
                    {r.avatarSeed}
                  </div>
                )}
                <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{r.name}</h3>
                <p className="mt-1 text-[10px] text-slate-500">{r.title}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {r.axes.map((a) => (
                    <span key={a} className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">
                      {AXES_DATA.find((ax) => ax.id === a)?.name.split(" ")[0]}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
