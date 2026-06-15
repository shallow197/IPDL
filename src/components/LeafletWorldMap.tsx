"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from "react";
import { CENTERS } from "@/data/ummiscoData";
import { CENTRE_VISUALS } from "@/components/CentreGlobe";

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

// Load Leaflet from CDN once (no npm dependency). Resolves with the global L.
function ensureLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w.L) return resolve(w.L);

    if (!document.querySelector(`link[data-leaflet]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      link.setAttribute("data-leaflet", "1");
      document.head.appendChild(link);
    }

    const existing = document.querySelector(`script[data-leaflet]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).L));
      existing.addEventListener("error", () => reject(new Error("leaflet")));
      if ((window as any).L) resolve((window as any).L);
      return;
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.setAttribute("data-leaflet", "1");
    script.onload = () => resolve((window as any).L);
    script.onerror = () => reject(new Error("leaflet"));
    document.body.appendChild(script);
  });
}

/**
 * Real interactive world map (Leaflet + dark CartoDB tiles) with the 5 UMMISCO
 * centres as clickable markers. Falls back gracefully (the centre list below the
 * map remains usable) if the map can't load.
 */
export default function LeafletWorldMap({ onSelect }: { onSelect: (id: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureLeaflet()
      .then((L) => {
        if (cancelled || !ref.current || mapRef.current) return;
        const map = L.map(ref.current, {
          center: [22, 12],
          zoom: 2,
          minZoom: 1,
          maxZoom: 7,
          worldCopyJump: true,
          attributionControl: false,
          scrollWheelZoom: true,
        });
        mapRef.current = map;

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          subdomains: "abcd",
          maxZoom: 8,
        }).addTo(map);

        const pts: [number, number][] = [];
        CENTERS.forEach((c) => {
          if (!c.coords) return;
          const color = CENTRE_VISUALS[c.id]?.color ?? "#60a5fa";
          const marker = L.circleMarker([c.coords.lat, c.coords.lon], {
            radius: 8,
            color: "#0b1120",
            weight: 2,
            fillColor: color,
            fillOpacity: 1,
          }).addTo(map);
          marker.bindTooltip(`${c.name} — ${c.city}`, { direction: "top", offset: [0, -6] });
          marker.on("click", () => onSelect(c.id));
          pts.push([c.coords.lat, c.coords.lon]);
        });

        if (pts.length) map.fitBounds(pts, { padding: [45, 45], maxZoom: 3 });
        setTimeout(() => { try { map.invalidateSize(); } catch {} }, 120);
      })
      .catch(() => { if (!cancelled) setError(true); });

    return () => {
      cancelled = true;
      if (mapRef.current) { try { mapRef.current.remove(); } catch {} mapRef.current = null; }
    };
  }, [onSelect]);

  if (error) {
    return (
      <div className="h-[340px] flex items-center justify-center bg-[#060d1c] text-center text-slate-400 text-sm px-6">
        La carte interactive n&apos;a pas pu se charger. Sélectionnez un centre dans la liste ci-dessous.
      </div>
    );
  }

  return <div ref={ref} className="h-[340px] w-full bg-[#060d1c] z-0" />;
}
