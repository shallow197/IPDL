"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, MapPin, ArrowRight, Hand } from "lucide-react";
import { CENTERS } from "@/data/ummiscoData";
import { CENTRE_VISUALS } from "@/components/CentreGlobe";
import LeafletWorldMap from "@/components/LeafletWorldMap";

// Approximate geographic position of each centre (degrees).
const CENTRE_GEO: Record<string, { lat: number; lon: number }> = {
  france: { lat: 48.9, lon: 2.4 },
  asie: { lat: 21.0, lon: 105.8 },
  "afrique-ouest": { lat: 14.7, lon: -17.4 },
  "afrique-centrale": { lat: 3.9, lon: 11.5 },
  mediterranee: { lat: 31.6, lon: -8.0 },
};

const R = 150;
const CX = 180;
const CY = 180;
const DEG = Math.PI / 180;

interface Projected { x: number; y: number; z: number; visible: boolean }

function project(lon: number, lat: number, rotLon: number, rotPhi: number): Projected {
  const λ = (lon - rotLon) * DEG;
  const φ = lat * DEG;
  const φ0 = rotPhi * DEG;
  const cosφ = Math.cos(φ), sinφ = Math.sin(φ);
  const cosλ = Math.cos(λ), sinλ = Math.sin(λ);
  const x = R * cosφ * sinλ;
  const y = R * (Math.cos(φ0) * sinφ - Math.sin(φ0) * cosφ * cosλ);
  const z = Math.sin(φ0) * sinφ + Math.cos(φ0) * cosφ * cosλ;
  return { x: CX + x, y: CY - y, z, visible: z > 0 };
}

// Build front-facing polyline segments for a sequence of geo points.
function segments(pts: { lon: number; lat: number }[], rotLon: number, rotPhi: number): string[] {
  const out: string[] = [];
  let cur: string[] = [];
  for (const p of pts) {
    const pr = project(p.lon, p.lat, rotLon, rotPhi);
    if (pr.visible) {
      cur.push(`${pr.x.toFixed(1)},${pr.y.toFixed(1)}`);
    } else if (cur.length) {
      out.push(cur.join(" "));
      cur = [];
    }
  }
  if (cur.length) out.push(cur.join(" "));
  return out;
}

// Realistic continent outlines
const CONTINENTS = {
  africa: [
    // North Africa
    { lon: -10, lat: 35 }, { lon: 0, lat: 37 }, { lon: 10, lat: 36 }, { lon: 20, lat: 33 }, { lon: 30, lat: 32 }, { lon: 40, lat: 31 },
    // Red Sea coast
    { lon: 42, lat: 28 }, { lon: 43, lat: 25 }, { lon: 44, lat: 20 }, { lon: 44, lat: 15 }, { lon: 42, lat: 12 },
    // East Africa
    { lon: 41, lat: 8 }, { lon: 40, lat: 4 }, { lon: 39, lat: 0 }, { lon: 38, lat: -3 }, { lon: 37, lat: -8 }, { lon: 35, lat: -15 }, { lon: 32, lat: -20 },
    // Southern Africa
    { lon: 28, lat: -26 }, { lon: 25, lat: -30 }, { lon: 20, lat: -32 }, { lon: 15, lat: -32 }, { lon: 12, lat: -30 }, { lon: 10, lat: -28 },
    // West Africa
    { lon: 8, lat: -20 }, { lon: 5, lat: -10 }, { lon: 2, lat: 0 }, { lon: 0, lat: 5 }, { lon: -5, lat: 10 }, { lon: -8, lat: 15 }, { lon: -10, lat: 20 }, { lon: -12, lat: 27 }, { lon: -10, lat: 35 }
  ],
  asia: [
    // Middle East
    { lon: 35, lat: 37 }, { lon: 45, lat: 39 }, { lon: 55, lat: 35 }, { lon: 60, lat: 27 }, { lon: 65, lat: 25 },
    // India
    { lon: 68, lat: 35 }, { lon: 77, lat: 32 }, { lon: 88, lat: 28 }, { lon: 92, lat: 22 }, { lon: 88, lat: 8 }, { lon: 78, lat: 5 }, { lon: 68, lat: 8 },
    // Southeast Asia
    { lon: 95, lat: 20 }, { lon: 105, lat: 22 }, { lon: 115, lat: 18 }, { lon: 125, lat: 15 }, { lon: 130, lat: 8 },
    // Indonesia-Philippines
    { lon: 140, lat: 5 }, { lon: 140, lat: -5 }, { lon: 130, lat: -10 },
    // East Asia
    { lon: 125, lat: -8 }, { lon: 120, lat: 0 }, { lon: 115, lat: 8 }, { lon: 110, lat: 20 }, { lon: 105, lat: 25 }, { lon: 100, lat: 30 }, { lon: 95, lat: 32 }, { lon: 90, lat: 35 },
    // China-Russia
    { lon: 85, lat: 45 }, { lon: 100, lat: 48 }, { lon: 120, lat: 50 }, { lon: 135, lat: 48 }, { lon: 140, lat: 45 }, { lon: 145, lat: 42 },
    // Japan
    { lon: 140, lat: 45 }, { lon: 145, lat: 43 }, { lon: 145, lat: 30 }, { lon: 130, lat: 30 }
  ],
  europe: [
    // Portugal-Spain
    { lon: -10, lat: 43 }, { lon: -5, lat: 42 }, { lon: 0, lat: 40 },
    // France-Italy
    { lon: 5, lat: 43 }, { lon: 8, lat: 44 }, { lon: 10, lat: 45 }, { lon: 15, lat: 43 }, { lon: 15, lat: 37 },
    // Balkans
    { lon: 20, lat: 43 }, { lon: 25, lat: 45 }, { lon: 30, lat: 45 },
    // Greece
    { lon: 25, lat: 39 }, { lon: 28, lat: 37 }, { lon: 25, lat: 35 },
    // Eastern Europe
    { lon: 32, lat: 48 }, { lon: 35, lat: 52 }, { lon: 40, lat: 52 }, { lon: 35, lat: 58 }, { lon: 25, lat: 60 }, { lon: 15, lat: 60 },
    // Scandinavia
    { lon: 10, lat: 58 }, { lon: 15, lat: 62 }, { lon: 25, lat: 68 }, { lon: 30, lat: 70 }, { lon: 25, lat: 65 }, { lon: 12, lat: 62 }, { lon: 5, lat: 58 },
    // Ireland-UK
    { lon: -8, lat: 54 }, { lon: -3, lat: 56 }, { lon: 0, lat: 53 }, { lon: -2, lat: 50 }, { lon: -5, lat: 48 }, { lon: -10, lat: 52 }, { lon: -8, lat: 54 }
  ],
  americas: [
    // North America
    { lon: -130, lat: 60 }, { lon: -125, lat: 58 }, { lon: -120, lat: 50 }, { lon: -110, lat: 49 }, { lon: -95, lat: 48 }, { lon: -85, lat: 48 }, { lon: -80, lat: 47 }, { lon: -70, lat: 48 },
    // Central America
    { lon: -92, lat: 18 }, { lon: -84, lat: 17 }, { lon: -77, lat: 15 },
    // Caribbean
    { lon: -75, lat: 20 }, { lon: -70, lat: 20 }, { lon: -62, lat: 18 },
    // South America (Colombia)
    { lon: -75, lat: 12 }, { lon: -70, lat: 10 }, { lon: -68, lat: 5 }, { lon: -65, lat: 3 },
    // Amazon
    { lon: -60, lat: 5 }, { lon: -55, lat: 2 }, { lon: -50, lat: 0 }, { lon: -48, lat: -5 },
    // Brazil
    { lon: -45, lat: -10 }, { lon: -40, lat: -15 }, { lon: -38, lat: -20 }, { lon: -42, lat: -25 },
    // Southern Cone
    { lon: -70, lat: -25 }, { lon: -68, lat: -35 }, { lon: -65, lat: -40 }, { lon: -72, lat: -42 }, { lon: -75, lat: -35 }, { lon: -80, lat: -25 }, { lon: -75, lat: -15 },
    // Western coast back up
    { lon: -78, lat: -5 }, { lon: -82, lat: 5 }, { lon: -85, lat: 15 }, { lon: -95, lat: 25 }, { lon: -105, lat: 35 }, { lon: -115, lat: 42 }, { lon: -130, lat: 60 }
  ]
};

function buildContinents(rotLon: number, rotPhi: number): { [key: string]: string[] } {
  const out: { [key: string]: string[] } = {};
  for (const [name, pts] of Object.entries(CONTINENTS)) {
    out[name] = segments(pts, rotLon, rotPhi);
  }
  return out;
}

function buildGraticule(rotLon: number, rotPhi: number): string[] {
  const lines: string[] = [];
  // Meridians
  for (let lon = -180; lon < 180; lon += 30) {
    const pts = [];
    for (let lat = -85; lat <= 85; lat += 5) pts.push({ lon, lat });
    lines.push(...segments(pts, rotLon, rotPhi));
  }
  // Parallels
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts = [];
    for (let lon = -180; lon <= 180; lon += 5) pts.push({ lon, lat });
    lines.push(...segments(pts, rotLon, rotPhi));
  }
  return lines;
}

export default function GlobeCentres() {
  const router = useRouter();
  const [rotLon, setRotLon] = useState(-10);
  const [rotPhi, setRotPhi] = useState(18);
  const [showMap, setShowMap] = useState(false);
  const dragging = useRef(false);
  const moved = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const autoRef = useRef<number | null>(null);

  // Auto-rotation when idle.
  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (!dragging.current && !showMap) {
        setRotLon((l) => (l + 0.12) % 360);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    autoRef.current = raf;
    return () => cancelAnimationFrame(raf);
  }, [showMap]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const rotRef = useRef({ lon: rotLon, phi: rotPhi });
  rotRef.current = { lon: rotLon, phi: rotPhi };

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    last.current = { x: e.clientX, y: e.clientY };
    try { (e.target as Element).setPointerCapture?.(e.pointerId); } catch { /* non-bloquant */ }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    setRotLon((l) => l - dx * 0.4);
    setRotPhi((p) => Math.max(-85, Math.min(85, p + dy * 0.4)));
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    if (moved.current) return; // c'était un glissement, pas un clic
    const svg = svgRef.current;
    if (!svg) { setShowMap(true); return; }
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 360;
    const y = ((e.clientY - rect.top) / rect.height) * 360;
    const { lon, phi } = rotRef.current;
    // Hit-test : un clic sur un point lumineux ouvre la page du centre.
    for (const c of CENTERS) {
      const geo = CENTRE_GEO[c.id];
      if (!geo) continue;
      const pr = project(geo.lon, geo.lat, lon, phi);
      if (pr.visible && Math.hypot(pr.x - x, pr.y - y) < 16) {
        router.push(`/centres/${c.id}`);
        return;
      }
    }
    // Sinon, clic sur le globe → vue carte.
    setShowMap(true);
  }, [router]);

  const graticule = buildGraticule(rotLon, rotPhi);
  const continents = buildContinents(rotLon, rotPhi);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Ambient glow */}
        <div className="absolute inset-0 -z-10 rounded-full blur-3xl bg-gradient-to-br from-blue-600/20 to-green-600/20" />

        <svg
          ref={svgRef}
          viewBox="0 0 360 360"
          className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] cursor-grab active:cursor-grabbing touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => { dragging.current = false; }}
        >
          <defs>
            <radialGradient id="globe-sphere" cx="38%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#0b1f3a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#060d1c" stopOpacity="0.98" />
            </radialGradient>
            <radialGradient id="globe-rim" cx="50%" cy="50%" r="50%">
              <stop offset="86%" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="97%" stopColor="#22d3ee" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sphere */}
          <circle cx={CX} cy={CY} r={R} fill="url(#globe-sphere)" />
          <circle cx={CX} cy={CY} r={R} fill="url(#globe-rim)" />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1" />

          {/* Graticule */}
          <g stroke="#38bdf8" strokeOpacity="0.18" strokeWidth="0.8" fill="none">
            {graticule.map((pts, i) => (
              <polyline key={i} points={pts} />
            ))}
          </g>

          {/* Continents */}
          <g fill="#1f472a" fillOpacity="0.6" stroke="#4ade80" strokeOpacity="0.4" strokeWidth="0.6">
            {Object.entries(continents).map(([name, ptsList]) => (
              <g key={name}>
                {ptsList.map((pts, i) => (
                  <polyline key={`${name}-${i}`} points={pts} />
                ))}
              </g>
            ))}
          </g>

          {/* Centre markers */}
          {CENTERS.map((c) => {
            const geo = CENTRE_GEO[c.id];
            if (!geo) return null;
            const pr = project(geo.lon, geo.lat, rotLon, rotPhi);
            if (!pr.visible) return null;
            const color = CENTRE_VISUALS[c.id]?.color ?? "#60a5fa";
            const op = 0.45 + pr.z * 0.55;
            return (
              <g key={c.id} style={{ cursor: "pointer" }} opacity={op}>
                <circle cx={pr.x} cy={pr.y} r="9" fill={color} opacity="0.18">
                  <animate attributeName="r" values="7;12;7" dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.25;0.04;0.25" dur="2.6s" repeatCount="indefinite" />
                </circle>
                <circle cx={pr.x} cy={pr.y} r="4" fill={color} stroke="#0b1120" strokeWidth="1" />
                <title>{c.name}</title>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-4 text-[12px] text-slate-500 flex items-center gap-2 text-center">
        <Hand className="h-3.5 w-3.5 text-blue-400 flex-none" />
        Faites tourner le globe · cliquez un point pour ouvrir le centre
      </p>
      <button
        onClick={() => setShowMap(true)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/40 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
      >
        <MapPin className="h-3.5 w-3.5 text-blue-400" /> Voir la carte du monde
      </button>

      {/* ── Map view modal ─────────────────────────────────────────────── */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={() => setShowMap(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-400" /> Nos 5 centres dans le monde</h3>
              <button onClick={() => setShowMap(false)} className="text-slate-500 hover:text-slate-200"><X className="h-4 w-4" /></button>
            </div>

            <LeafletWorldMap onSelect={(id) => { setShowMap(false); router.push(`/centres/${id}`); }} />

            <div className="grid sm:grid-cols-2 gap-2 p-4 border-t border-slate-800 max-h-56 overflow-y-auto">
              {CENTERS.map((c) => {
                const color = CENTRE_VISUALS[c.id]?.color ?? "#60a5fa";
                return (
                  <Link key={c.id} href={`/centres/${c.id}`} onClick={() => setShowMap(false)} className="group flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 hover:border-slate-700 transition-colors">
                    <span className="h-2.5 w-2.5 rounded-full flex-none" style={{ backgroundColor: color }} />
                    <span className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-white block truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-500 truncate">{c.city}</span>
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
