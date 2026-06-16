"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GlobeGlPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Globe.gl from CDN
    const threeScript = document.createElement("script");
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    threeScript.async = true;

    const globeScript = document.createElement("script");
    globeScript.src = "https://cdn.jsdelivr.net/npm/globe.gl";
    globeScript.async = true;

    document.body.appendChild(threeScript);

    threeScript.onload = () => {
      document.body.appendChild(globeScript);

      globeScript.onload = () => {
        const Globe = (window as any).Globe;
        if (!Globe || !containerRef.current) return;

        const container = containerRef.current;

        // UMMISCO centers
        const data = [
          { lat: 48.9, lng: 2.45, name: "France", size: 45, color: "#3b82f6" },
          { lat: 21.03, lng: 105.85, name: "Vietnam", size: 35, color: "#ef4444" },
          { lat: 14.69, lng: -17.45, name: "Sénégal", size: 40, color: "#10b981" },
          { lat: 3.87, lng: 11.52, name: "Cameroun", size: 30, color: "#f59e0b" },
          { lat: 31.79, lng: -7.09, name: "Maroc", size: 25, color: "#8b5cf6" },
        ];

        const globe = new Globe(container).globeImageUrl(
          "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
        );

        globe.pointsData(data)
          .pointColor((d: any) => d.color)
          .pointSize((d: any) => d.size / 10)
          .pointLabel((d: any) => `<div style="color: white; font-weight: bold;">${d.name}</div>`)
          .onPointHover((d: any) => {
            if (d) {
              container.style.cursor = "pointer";
            } else {
              container.style.cursor = "auto";
            }
          });

        // Auto-rotate
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 1;

        return () => {
          globe.dispose?.();
        };
      };
    };

    return () => {
      if (document.body.contains(threeScript)) document.body.removeChild(threeScript);
      if (document.body.contains(globeScript)) document.body.removeChild(globeScript);
      if (containerRef.current?.firstChild) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/preview" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Globe.gl</h1>
        <p className="text-slate-400 mb-8">3D préfait, points interactifs, API simple, zoom/pan natifs</p>

        <div className="flex justify-center mb-12 bg-slate-900/30 rounded-lg p-4">
          <div ref={containerRef} style={{ width: "600px", height: "500px" }} className="rounded border border-slate-700" />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-cyan-900/20 border border-cyan-800 rounded-lg p-6">
            <h3 className="font-bold mb-2">✓ Avantages</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Globe 3D préfait</li>
              <li>• Points/data overlay</li>
              <li>• API très simple</li>
              <li>• Zoom/pan natifs</li>
              <li>• Auto-rotate</li>
            </ul>
          </div>

          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
            <h3 className="font-bold mb-2">✗ Limites</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Dépendance externe</li>
              <li>• ~80KB minifiée</li>
              <li>• Perso limitée</li>
              <li>• Contrôle moins fin</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
          <h3 className="font-bold mb-2">Cas d'usage idéal</h3>
          <p className="text-sm text-slate-300">
            Dashboard scientifique avec données géolocalisées. Parfait si tu veux "beau 3D" sans complexité,
            avec la possibilité d'afficher des données réelles (publications, projets, datasets par localisation).
          </p>
        </div>
      </div>
    </div>
  );
}
