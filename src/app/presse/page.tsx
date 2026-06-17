"use client";

import React from "react";
import Link from "next/link";
import {
  Newspaper, Mail, Phone, Download, Quote, ExternalLink, Mic, Calendar, ArrowRight, ArrowLeft,
} from "lucide-react";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import { RESEARCHERS, PUBLICATION, SEMINARS, AXES } from "@/data/ummiscoData";
import { useLang } from "@/context/LangContext";
import { scholarUrl, UMMISCO_SCHOLAR_SEARCH } from "@/lib/scholar";

// A few senior figures available for press interviews (leadership + an email).
const EXPERT_IDS = [
  "alassane-bah",
  "khalil-ezzinbi",
  "nicolas-marilleau",
  "jean-daniel-zucker",
  "alexis-drogoul",
  "samuel-bowong",
];

const PRESS_CONTACT_EMAIL = "contact.ummisco@ucad.edu.sn";

export default function PressePage() {
  const { t } = useLang();
  const experts = EXPERT_IDS
    .map((id) => RESEARCHERS.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const highlights = PUBLICATION.slice(0, 3);
  const upcoming = [...SEMINARS]
    .filter((s) => new Date(s.date).getTime() >= Date.now() - 86400000)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-8 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à l'accueil</span>
        </Link>
        {/* Header */}
        <div className="border-b border-slate-900 pb-8 mb-10">
          <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold mb-2 flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-rose-400" /> {t("presse.tag")}
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{t("presse.title")}</h1>
          <p className="mt-2 text-slate-400 text-sm max-w-2xl">
            {t("presse.desc")}
          </p>
          <div aria-hidden className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
        </div>

        {/* Contact + press kit */}
        <section className="grid gap-6 lg:grid-cols-3 mb-14">
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-900/10 p-8">
            <h2 className="text-lg font-bold text-white mb-2">{t("presse.contactTitle")}</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-2xl">
              {t("presse.contactDesc")}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${PRESS_CONTACT_EMAIL}?subject=Demande d'information - Presse UMMISCO&body=Bonjour,%0A%0AJ'aimerais obtenir des informations pour une publication ou demande de presse concernant UMMISCO.%0A%0ACordialement`}
                className="inline-flex items-center gap-2 rounded-lg bg-ummisco-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-ummisco-blue/90 active:scale-95 transition-all"
              >
                <Mail className="h-4 w-4" /> {PRESS_CONTACT_EMAIL}
              </a>
              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300">
                <Phone className="h-4 w-4 text-slate-500" /> +221 33 824 00 00
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-8 flex flex-col">
            <h2 className="text-lg font-bold text-white mb-2">{t("presse.kitTitle")}</h2>
            <p className="text-sm text-slate-400 leading-relaxed flex-1">
              {t("presse.kitDesc")}
            </p>
            <a href="/logos/logo_ummisco.png" download className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-600 transition-all">
              <Download className="h-4 w-4" /> {t("presse.downloadLogo")}
            </a>
          </div>
        </section>

        {/* Experts à interviewer */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <Mic className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">{t("presse.expertsTitle")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experts.map((e) => (
              <div key={e.id} className="rounded-xl border border-slate-900 bg-slate-950 p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={e.name} src={e.photoUrl} seed={e.avatarSeed} size={48} />
                  <div className="min-w-0">
                    <Link href={`/chercheurs/${e.id}`} className="text-sm font-bold text-white hover:text-blue-400 transition-colors block truncate">{e.name}</Link>
                    <p className="text-[11px] text-slate-500 truncate">{e.title}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {e.axes.map((a) => {
                    const ax = AXES.find((x) => x.id === a);
                    return ax ? (<span key={a} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider">{ax.shortName}</span>) : null;
                  })}
                </div>
                <div className="mt-auto flex items-center gap-3 pt-3 border-t border-slate-900/60">
                  {e.email && (
                    <a
                      href={`mailto:${e.email}?subject=Entretien ou interview - UMMISCO&body=Bonjour ${e.name},%0A%0AJ'aimerais vous contacter pour un entretien ou une interview concernant votre travail de recherche.%0A%0ACordialement`}
                      className="inline-flex items-center gap-1 text-[12px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Mail className="h-3 w-3" /> {t("presse.contact")}
                    </a>
                  )}
                  <a href={scholarUrl({ title: e.name })} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] text-slate-400 hover:text-slate-200 transition-colors">
                    <Quote className="h-3 w-3" /> {t("presse.works")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* À la une */}
        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2"><Quote className="h-4 w-4 text-green-400" /> {t("presse.pubTitle")}</h2>
              <a href={UMMISCO_SCHOLAR_SEARCH} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">Scholar <ExternalLink className="h-3 w-3" /></a>
            </div>
            <div className="space-y-3">
              {highlights.map((p) => (
                <a key={p.id} href={scholarUrl(p)} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-slate-900 bg-slate-900/10 p-4 hover:border-slate-800 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{AXES.find((a) => a.id === p.axis)?.shortName} · {p.year}</p>
                  <h3 className="text-sm font-bold text-white leading-snug mt-1 line-clamp-2">{p.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 italic">{p.authors.join(", ")}</p>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2"><Calendar className="h-4 w-4 text-amber-400" /> {t("presse.eventsTitle")}</h2>
              <Link href="/actualites" className="text-[12px] font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">{t("presse.eventsAll")} <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="space-y-3">
              {upcoming.map((s) => (
                <div key={s.id} className="rounded-xl border border-slate-900 bg-slate-900/10 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{new Date(s.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                  <h3 className="text-sm font-bold text-white leading-snug mt-1 line-clamp-2">{s.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{s.location}</p>
                </div>
              ))}
              {upcoming.length === 0 && (<p className="text-sm text-slate-500 italic">{t("presse.noEvents")}</p>)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
