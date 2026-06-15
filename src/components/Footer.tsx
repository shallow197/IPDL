import React from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { Mail, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-900 bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative blue→green brand accent line */}
      <div aria-hidden className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500/60 via-blue-400/30 to-green-500/60" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <BrandLogo height={36} />
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Unité Mixte Internationale UMI 209 (IRD &amp; Sorbonne Université) — modélisation mathématique et informatique des systèmes complexes au service de la science de la durabilité. 5 centres internationaux · 94 membres · 4 axes de recherche.
            </p>
          </div>

          {/* Research axes links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4 border-l-2 border-ummisco-blue pl-2">
              Axes de Recherche
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/axes" className="hover:text-slate-200 transition-colors">Agents & Modélisation</Link>
              </li>
              <li>
                <Link href="/axes" className="hover:text-slate-200 transition-colors">IA & Apprentissage Profond</Link>
              </li>
              <li>
                <Link href="/axes" className="hover:text-slate-200 transition-colors">Capteurs & Collecte de données</Link>
              </li>
              <li>
                <Link href="/axes" className="hover:text-slate-200 transition-colors">Approches participatives</Link>
              </li>
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4 border-l-2 border-ummisco-blue pl-2">
              Ressources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/publications" className="hover:text-slate-200 transition-colors">Publications Scientifiques</Link>
              </li>
              <li>
                <Link href="/datasets" className="hover:text-slate-200 transition-colors">Catalogues de Datasets</Link>
              </li>
              <li>
                <Link href="/equipe" className="hover:text-slate-200 transition-colors">Annuaire des Chercheurs</Link>
              </li>
              <li>
                <Link href="/#centres" className="hover:text-slate-200 transition-colors">Nos Centres</Link>
              </li>
              <li>
                <Link href="/presse" className="hover:text-slate-200 transition-colors">Espace Presse &amp; Médias</Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-slate-200 transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-slate-200 transition-colors">Espace Connecté</Link>
              </li>
            </ul>
          </div>

          {/* Contacts & Locations */}
          <div className="space-y-3 text-sm text-slate-500">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4 border-l-2 border-ummisco-blue pl-2">
              Contacts & Sites
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-600 flex-none mt-0.5" />
              <span><strong className="text-slate-300 font-semibold">ESP UCAD</strong> : Route de Ouakam, BP 5085, Dakar-Fann, Sénégal.</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-600 flex-none mt-0.5" />
              <span><strong className="text-slate-300 font-semibold">Site de Hann</strong> : Campus IRD de Hann, Route des Pères Maristes, Dakar.</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-600 flex-none" />
              <span>contact.ummisco@ucad.edu.sn</span>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-[13px] text-slate-600 gap-4">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} UMMISCO UMI 209 — Tous droits réservés.</span>
            <span>·</span>
            <span>IRD & Sorbonne Université</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            <span>Portail Institutionnel International</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
