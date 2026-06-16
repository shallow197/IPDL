"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GlobeD3Preview() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [rotation, setRotation] = useState(0);

  const centers = [
    { name: "France", lat: 48.9, lon: 2.45, value: 45 },
    { name: "Vietnam", lat: 21.03, lon: 105.85, value: 35 },
    { name: "Sénégal", lat: 14.69, lon: -17.45, value: 40 },
    { name: "Cameroun", lat: 3.87, lon: 11.52, value: 30 },
    { name: "Maroc", lat: 31.79, lon: -7.09, value: 25 },
  ];

  useEffect(() => {
    const interval = setInterval(() => setRotation((r) => (r + 0.5) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  // Simple Mercator-like projection
  const projectPoint = (lat: number, lon: number, rotation: number) => {
    const adjustedLon = lon + rotation;
    const rad = (adjustedLon * Math.PI) / 180;
    const cosLat = Math.cos((lat * Math.PI) / 180);
    const x = 300 + 180 * Math.cos(rad) * cosLat;
    const y = 250 + 120 * Math.sin((lat * Math.PI) / 180);
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/preview" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Globe D3.js</h1>
        <p className="text-slate-400 mb-8">Projection géographique vraie, data binding, zoom/pan natifs</p>

        <div className="flex justify-center mb-12 bg-slate-900/30 rounded-lg p-8">
          <svg ref={svgRef} width="600" height="500" className="drop-shadow-lg">
            <defs>
              <radialGradient id="globeD3" cx="35%" cy="35%">
                <stop offset="0%" stopColor="#87ceeb" stopOpacity="1" />
                <stop offset="80%" stopColor="#1e5a8e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0a2a3f" stopOpacity="1" />
              </radialGradient>
            </defs>

            {/* Globe base */}
            <circle cx="300" cy="250" r="180" fill="url(#globeD3)" />

            {/* Gridlines */}
            <circle cx="300" cy="250" r="180" fill="none" stroke="#444" strokeWidth="0.5" opacity="0.3" />
            <line x1="120" y1="250" x2="480" y2="250" stroke="#444" strokeWidth="0.5" opacity="0.2" />

            {/* Continents */}
            <g opacity="0.6">
              <ellipse cx="280" cy="210" rx="30" ry="35" fill="#2d5016" transform={`rotate(${rotation} 300 250)`} />
              <polygon points="320,240 360,235 365,280 330,285" fill="#2d5016" transform={`rotate(${rotation} 300 250)`} />
              <ellipse cx="360" cy="190" rx="40" ry="30" fill="#2d5016" transform={`rotate(${rotation} 300 250)`} />
            </g>

            {/* Data points with size based on value */}
            {centers.map((center) => {
              const visible = Math.cos(((center.lon + rotation - 180) * Math.PI) / 180) > -0.2;
              if (!visible) return null;

              const point = projectPoint(center.lat, center.lon, rotation);
              const radius = 5 + (center.value / 50) * 5;

              return (
                <g key={center.name}>
                  {/* Data point */}
                  <circle cx={point.x} cy={point.y} r={radius} fill="#fbbf24" opacity="0.7" />
                  <circle cx={point.x} cy={point.y} r={radius} fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />
                  {/* Label */}
                  <text x={point.x} y={point.y - radius - 8} textAnchor="middle" className="text-xs fill-white font-bold">
                    {center.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
          <h3 className="font-bold mb-2">Caractéristiques D3.js</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✓ Projection géographique réelle</li>
            <li>✓ Data binding (taille des points = valeur)</li>
            <li>✓ Zoom/pan/rotation natifs</li>
            <li>✓ Interaction sur éléments</li>
            <li>✗ Libraire lourde (~30KB)</li>
            <li>✗ Courbe d'apprentissage</li>
            <li>✗ 2D toujours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
