"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, ChevronRight, Mic } from "lucide-react";
import Image from "next/image";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useNotification } from "@/context/NotificationContext";
import type { DBEvent } from "@/lib/db";
import { SEMINARS, RESEARCHERS } from "@/data/ummiscoData";

const TYPE_LABELS: Record<string, string> = {
  seminaire: "Séminaire",
  conference: "Conférence",
  atelier: "Atelier",
  autre: "Actualité",
};

const TYPE_COLORS: Record<string, string> = {
  seminaire: "bg-blue-500/10 text-blue-400 border-blue-900/30",
  conference: "bg-purple-500/10 text-purple-400 border-purple-900/30",
  atelier: "bg-green-500/10 text-green-400 border-green-900/30",
  autre: "bg-slate-500/10 text-slate-400 border-slate-700",
};

export default function ActualitesPage() {
  const { t } = useLang();
  const { isAuthenticated, user, token } = useAuth();
  const { notify } = useNotification();
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.dateDebut).getTime() > now);
  const past = events.filter((e) => new Date(e.dateDebut).getTime() <= now);
  const display = filter === "past" ? past : upcoming;

  const handleRegister = async (eventId: string) => {
    if (!isAuthenticated) return;
    setRegistering(eventId);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRegistered((prev) => new Set([...prev, eventId]));
        notify("Inscription confirmée !", "success");
      } else {
        notify("Erreur lors de l'inscription.", "error");
      }
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-slate-900 pb-8 mb-10">
          <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
            {t("events.sectionTag")}
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{t("events.title")}</h1>
          <p className="mt-2 text-slate-400 text-sm">Séminaires, conférences et ateliers du laboratoire UMMISCO.</p>
          <div aria-hidden className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
        </div>

        {/* ── Séminaires UMMISCO avec photos des intervenants ── */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <Mic className="h-4 w-4 text-blue-400" />
            <h2 className="text-base font-extrabold text-white uppercase tracking-wide">Prochains séminaires UMMISCO</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SEMINARS.map((sem) => {
              const researcher = RESEARCHERS.find((r) =>
                r.name.toLowerCase().split(" ").some((part) =>
                  sem.speaker.toLowerCase().includes(part) && part.length > 3
                )
              );
              const semDate = new Date(sem.date);
              const typeColor: Record<string, string> = {
                seminaire:  "bg-blue-500/10 text-blue-400 border-blue-900/30",
                conference: "bg-purple-500/10 text-purple-400 border-purple-900/30",
                atelier:    "bg-green-500/10 text-green-400 border-green-900/30",
              };
              return (
                <div key={sem.id} className="rounded-xl border border-slate-800 bg-slate-900/20 overflow-hidden hover:border-slate-700 transition-colors flex flex-col">
                  {/* Bande colorée + photo intervenant */}
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-slate-700 flex-none bg-slate-800">
                      {researcher?.photoUrl ? (
                        <img
                          src={researcher.photoUrl}
                          alt={researcher.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400 text-lg font-bold">
                          {sem.speaker.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white truncate">{sem.speaker}</p>
                      <p className="text-[9px] text-slate-400">{researcher?.title?.split("—")[0].trim() ?? "UMMISCO"}</p>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className={`inline-flex self-start text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider mb-2 ${typeColor[sem.type ?? "seminaire"]}`}>
                      {sem.type ?? "Séminaire"}
                    </span>
                    <h3 className="text-xs font-bold text-white leading-snug mb-2 line-clamp-3 flex-1">{sem.title}</h3>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 mt-auto pt-2 border-t border-slate-800">
                      <Calendar className="h-2.5 w-2.5" />
                      {semDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {["upcoming", "past"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${
                filter === f
                  ? "bg-blue-600/20 text-blue-400 border-blue-900/40"
                  : "border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
            >
              {f === "upcoming" ? t("events.upcoming") : t("events.past")} ({f === "upcoming" ? upcoming.length : past.length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">{t("common.loading")}</div>
        ) : (
          <div className="space-y-6">
            {display.map((ev) => {
              const isRegistered = registered.has(ev.id) || ev.inscrits.includes(user?.id || "");
              const isFull = ev.inscrits.length >= ev.capacite;
              const dateStart = new Date(ev.dateDebut);
              return (
                <div key={ev.id} className="rounded-xl border border-slate-900 bg-slate-900/10 p-6 hover:border-slate-800 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Date block */}
                    <div className="flex-none text-center bg-slate-900 rounded-xl p-4 w-20">
                      <div className="text-2xl font-extrabold text-white">{dateStart.getDate()}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{dateStart.toLocaleDateString("fr-FR", { month: "short" })}</div>
                      <div className="text-[10px] text-slate-500">{dateStart.getFullYear()}</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${TYPE_COLORS[ev.type]}`}>
                          {TYPE_LABELS[ev.type]}
                        </span>
                        {filter !== "past" && (
                          <span className="text-[9px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                            À venir
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white leading-snug mb-2">{ev.titre}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{ev.description}</p>

                      <div className="flex flex-wrap gap-4 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" /> {ev.lieu}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {dateStart.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {ev.speaker && (
                          <span className="flex items-center gap-1.5">
                            {t("events.speaker")} <strong className="text-slate-400">{ev.speaker}</strong>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3 w-3" /> {ev.inscrits.length}/{ev.capacite} inscrits
                        </span>
                      </div>
                    </div>

                    {/* Register button */}
                    {filter !== "past" && (
                      <div className="flex-none">
                        {isAuthenticated ? (
                          isRegistered ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-600/10 px-4 py-2 text-[10px] font-bold text-green-400 border border-green-900/30">
                              ✓ Inscrit(e)
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRegister(ev.id)}
                              disabled={isFull || registering === ev.id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-ummisco-blue px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-ummisco-blue/90 disabled:opacity-50 active:scale-95 transition-all"
                            >
                              {registering === ev.id ? "..." : t("events.register")}
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          )
                        ) : (
                          <a href="/connexion" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-4 py-2 text-[10px] font-semibold text-slate-400 hover:text-slate-200 transition-all">
                            Se connecter pour s'inscrire
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {display.length === 0 && (
              <div className="rounded-xl border border-slate-900 border-dashed p-16 text-center text-slate-500 text-xs">
                {filter === "upcoming" ? "Aucun événement à venir pour l'instant." : "Aucun événement passé."}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
