"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GlobeSvgPreview() {
  const [rotation, setRotation] = useState(0);
  const [hoveredCenter, setHoveredCenter] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setRotation((r) => (r + 0.5) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  // UMMISCO centers with approximate lat/lon
  const centers = [
    { id: "france", name: "France", lat: 48.9, lon: 2.45, color: "#3b82f6" },
    { id: "asie", name: "Vietnam", lat: 21.03, lon: 105.85, color: "#ef4444" },
    { id: "afrique-ouest", name: "Sénégal", lat: 14.69, lon: -17.45, color: "#10b981" },
    { id: "afrique-centrale", name: "Cameroun", lat: 3.87, lon: 11.52, color: "#f59e0b" },
    { id: "mediterranee", name: "Maroc", lat: 31.79, lon: -7.09, color: "#8b5cf6" },
  ];

  // Project lat/lon to 2D circle
  const projectPoint = (lat: number, lon: number, rotation: number) => {
    const adjustedLon = lon + rotation;
    const rad = (adjustedLon * Math.PI) / 180;
    const cosLat = Math.cos((lat * Math.PI) / 180);
    const x = 150 + 100 * Math.cos(rad) * cosLat;
    const y = 200 + 80 * Math.sin((lat * Math.PI) / 180);
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/preview"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux prévisualisations</span>
        </Link>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Globe SVG Custom</h1>
        <p className="text-slate-400 mb-8">
          Approche légère (5KB), rotation simple, pas de dépendance
        </p>

        {/* SVG Globe */}
        <div className="flex justify-center mb-12 bg-slate-900/30 rounded-lg p-8">
          <svg width="400" height="450" viewBox="0 0 400 450" className="drop-shadow-lg">
            {/* Background */}
            <defs>
              <radialGradient id="globeSvgGradient" cx="35%" cy="35%">
                <stop offset="0%" stopColor="#4db8ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1a5080" stopOpacity="0.8" />
              </radialGradient>
            </defs>

            {/* Globe */}
            <circle cx="150" cy="200" r="120" fill="url(#globeSvgGradient)" />

            {/* Continents (simplified) */}
            <g opacity="0.7">
              {/* Europe */}
              <ellipse cx="155" cy="160" rx="25" ry="30" fill="#2d5016" transform={`rotate(${rotation} 150 200)`} />
              {/* Africa */}
              <polygon
                points="170,190 190,185 195,220 175,225"
                fill="#2d5016"
                transform={`rotate(${rotation} 150 200)`}
              />
              {/* Asia */}
              <ellipse cx="200" cy="150" rx="30" ry="25" fill="#2d5016" transform={`rotate(${rotation} 150 200)`} />
            </g>

            {/* Center points */}
            {centers.map((center) => {
              const visible = Math.cos(((center.lon + rotation - 180) * Math.PI) / 180) > -0.3;
              if (!visible) return null;

              const point = projectPoint(center.lat, center.lon, rotation);
              const isHovered = hoveredCenter === center.id;

              return (
                <g key={center.id}>
                  {/* Outer glow on hover */}
                  {isHovered && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="16"
                      fill={center.color}
                      opacity="0.2"
                    />
                  )}
                  {/* Main point */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="8"
                    fill={center.color}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredCenter(center.id)}
                    onMouseLeave={() => setHoveredCenter(null)}
                  />
                </g>
              );
            })}

            {/* Globe outline */}
            <circle cx="150" cy="200" r="120" fill="none" stroke="#4db8ff" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>

        {/* Centers legend */}
        <div className="bg-slate-900/50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Centres UMMISCO</h2>
          <div className="grid grid-cols-2 gap-4">
            {centers.map((center) => (
              <div
                key={center.id}
                className="flex items-center gap-3 p-3 rounded border border-slate-700 hover:border-slate-500 transition-colors"
                onMouseEnter={() => setHoveredCenter(center.id)}
                onMouseLeave={() => setHoveredCenter(null)}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: center.color }} />
                <div>
                  <div className="font-semibold">{center.name}</div>
                  <div className="text-sm text-slate-400">{center.lat.toFixed(2)}°, {center.lon.toFixed(2)}°</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
          <h3 className="font-bold mb-2">Caractéristiques SVG</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✓ Rotation continue du globe</li>
            <li>✓ Points interactifs au survol</li>
            <li>✓ Projection simple (azimutale)</li>
            <li>✓ Léger (~3KB de code)</li>
            <li>✗ Géographie approximative</li>
            <li>✗ Pas de zoom naturel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
