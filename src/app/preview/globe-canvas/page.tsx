"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GlobeCanvasPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  const centers = [
    { name: "France", lat: 48.9, lon: 2.45, color: "#3b82f6" },
    { name: "Vietnam", lat: 21.03, lon: 105.85, color: "#ef4444" },
    { name: "Sénégal", lat: 14.69, lon: -17.45, color: "#10b981" },
    { name: "Cameroun", lat: 3.87, lon: 11.52, color: "#f59e0b" },
    { name: "Maroc", lat: 31.79, lon: -7.09, color: "#8b5cf6" },
  ];

  useEffect(() => {
    const interval = setInterval(() => setRotation((r) => (r + 1) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 500, 500);

    // Draw globe
    ctx.fillStyle = "rgba(77, 184, 255, 0.3)";
    ctx.strokeStyle = "#4db8ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(250, 250, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw continents (simple shapes)
    ctx.fillStyle = "rgba(45, 80, 22, 0.7)";
    const rad = ((rotation + 180) * Math.PI) / 180;

    // Europe
    ctx.beginPath();
    ctx.ellipse(250 + 50 * Math.cos(rad), 200, 25, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Africa
    ctx.beginPath();
    ctx.ellipse(250 + 70 * Math.cos(rad), 250, 30, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Asia
    ctx.beginPath();
    ctx.ellipse(250 + 80 * Math.cos(rad), 180, 40, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Centers
    centers.forEach((center) => {
      const adjLon = center.lon + rotation;
      const cosLat = Math.cos((center.lat * Math.PI) / 180);
      const x = 250 + 150 * Math.cos((adjLon * Math.PI) / 180) * cosLat;
      const y = 250 + 100 * Math.sin((center.lat * Math.PI) / 180);

      const visible = Math.cos(((center.lon + rotation - 180) * Math.PI) / 180) > -0.3;
      if (!visible) return;

      ctx.fillStyle = center.color;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [rotation, centers]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/preview" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Globe Canvas 2D</h1>
        <p className="text-slate-400 mb-8">Très performant, animation 60fps, mais pas d'interactivité DOM</p>

        <div className="flex justify-center mb-12 bg-slate-900/30 rounded-lg p-8">
          <canvas ref={canvasRef} width={500} height={500} className="rounded border border-slate-700" />
        </div>

        <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-6">
          <h3 className="font-bold mb-2">Caractéristiques Canvas</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✓ Animation très fluide 60fps</li>
            <li>✓ Très performant</li>
            <li>✓ Contrôle fin du rendu</li>
            <li>✗ Pas de clic sur éléments (pixel-based)</li>
            <li>✗ Pas d'accessibilité DOM</li>
            <li>✗ Géographie approximative</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
