"use client";

import Link from "next/link";
import { ShieldCheck, Code2, Unlock, ArrowRight } from "lucide-react";

/**
 * Bandeau de crédibilité affiché en haut de l'accueil.
 * Met en avant des éléments VÉRIFIABLES, ce que les partenaires regardent en premier :
 *  - le label officiel UMI 209 (Unité Mixte Internationale de l'IRD) ;
 *  - les tutelles (IRD, Sorbonne, UCAD, UCA, UY1) ;
 *  - l'ouverture : logiciels open source (GitHub) et données ouvertes (CC BY 4.0).
 */

const TUTELLES = [
  { src: "/logos/logo_ird.webp", alt: "IRD" },
  { src: "/logos/logo_sorbonne.png", alt: "Sorbonne Université" },
  { src: "/logos/logo_ucad.png", alt: "UCAD" },
  { src: "/logos/logo_uca.png", alt: "UCA" },
  { src: "/logos/logo_uy1.jpg", alt: "Université de Yaoundé 1" },
];

export default function CredentialsBar() {
  return (
    <section className="border-b border-slate-900 bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid gap-7 lg:grid-cols-3 lg:gap-10 lg:divide-x lg:divide-slate-800">
          {/* 1 — Label officiel UMI 209 */}
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-blue-900/40 bg-blue-500/10 text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Label officiel</p>
              <p className="text-sm font-bold text-white leading-snug">Unité Mixte Internationale — UMI 209</p>
              <p className="text-[12px] text-slate-500">IRD · Sorbonne Université</p>
            </div>
          </div>

          {/* 2 — Tutelles (logos) */}
          <div className="lg:pl-10">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2.5">Sous tutelle &amp; partenariat académique</p>
            <div className="flex items-center gap-2.5 flex-wrap">
              {TUTELLES.map(({ src, alt }) => (
                <div
                  key={alt}
                  title={alt}
                  className="h-9 w-14 rounded p-1 flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <img src={src} alt={alt} className="h-full w-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* 3 — Ouverture : licences */}
          <div className="lg:pl-10">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2.5">Ouverture &amp; licences</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/logiciels"
                className="group inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-[12px] font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all"
              >
                <Code2 className="h-3.5 w-3.5 text-green-400" />
                Logiciels open source
                <ArrowRight className="h-3 w-3 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/datasets"
                className="group inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-[12px] font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all"
              >
                <Unlock className="h-3.5 w-3.5 text-blue-400" />
                Données ouvertes · CC BY 4.0
                <ArrowRight className="h-3 w-3 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
