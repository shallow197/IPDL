"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function PreviewPage() {
  const previews = [
    {
      name: "SVG Custom",
      href: "/preview/globe-svg",
      description: "Léger (5KB), 2D plat, rotation simple",
      pros: ["Pas de dépendance", "Très léger", "Contrôle total"],
      cons: ["Géographie approximative", "Pas de zoom"],
    },
    {
      name: "Canvas 2D",
      href: "/preview/globe-canvas",
      description: "Performant, animation fluide 60fps",
      pros: ["Animation fluide", "Très performant", "Contrôle fin"],
      cons: ["Pas d'interactivité", "Pas d'accessibilité"],
    },
    {
      name: "D3.js",
      href: "/preview/globe-d3",
      description: "Projection géographique vraie, data binding",
      pros: ["Géographie réelle", "Zoom/pan natifs", "Data binding"],
      cons: ["Lourde (~30KB)", "Courbe apprentissage"],
    },
    {
      name: "Three.js",
      href: "/preview/globe-threejs",
      description: "3D réaliste, rotation fluide, textures",
      pros: ["3D réaliste", "Rotation fluide", "Interactions avancées"],
      cons: ["Très lourde (~200KB)", "GPU intensive"],
    },
    {
      name: "Globe.gl",
      href: "/preview/globe-globegl",
      description: "3D préfait, points interactifs, API simple",
      pros: ["3D beau", "API simple", "Points overlay"],
      cons: ["~80KB minifiée", "Contrôle limité"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au site</span>
        </Link>

        <h1 className="text-4xl font-bold mb-2">Prévisualisations Globe</h1>
        <p className="text-slate-400 mb-12">
          Compare les 5 approches pour un globe interactif. Chaque démo fonctionne indépendamment sans affecter le site principal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previews.map((preview) => (
            <Link
              key={preview.href}
              href={preview.href}
              className="group rounded-lg border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 hover:bg-slate-900/80 transition-all"
            >
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                {preview.name}
              </h3>

              <p className="text-sm text-slate-400 mb-4">{preview.description}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="text-xs font-bold text-green-400 uppercase mb-1">✓ Points forts</div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {preview.pros.map((pro) => (
                      <li key={pro}>• {pro}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold text-red-400 uppercase mb-1">✗ Limites</div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {preview.cons.map((con) => (
                      <li key={con}>• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                Voir démo <ExternalLink className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-blue-900/20 border border-blue-800 rounded-lg p-8">
          <h2 className="text-xl font-bold mb-4">📊 Récapitulatif</h2>
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              <strong>Pour une vitrine légère:</strong> SVG Custom ou D3.js si tu veux montrer des données géographiques vraies.
            </p>
            <p>
              <strong>Pour impressionner:</strong> Three.js (lourd) ou Globe.gl (sweet spot).
            </p>
            <p>
              <strong>Pour animations haute perf:</strong> Canvas 2D.
            </p>
            <p>
              <strong className="text-yellow-400">Recommandation UMMISCO:</strong> Globe.gl — beau 3D, API simple, possibilité d'overlay les 5 centres avec données scientifiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
