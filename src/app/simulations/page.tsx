"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Cpu, Layers, Activity, Clock, CheckCircle2, Loader2, ChevronRight, BarChart3 } from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import type { DBSimulation } from "@/lib/db";
import { SIMULATION_TOOLS } from "@/data/ummiscoData";

type Tab = "netlogo" | "custom";

const SIM_TYPES = [
  { id: "epidemiologie", label: "Épidémiologie (SIRS)", icon: Activity, description: "Modèle SIRS avec paramètres de contagiosité et taux de guérison." },
  { id: "hydrologie", label: "Hydrologie (Inondations)", icon: Layers, description: "Simulation de ruissellement et risque d'inondation urbaine." },
  { id: "erosion", label: "Érosion Côtière", icon: BarChart3, description: "Projection du recul du trait de côte sous scénarios climatiques." },
];

const PARAM_FORMS: Record<string, { key: string; label: string; type: string; default: string; min?: string; max?: string; step?: string }[]> = {
  epidemiologie: [
    { key: "population", label: "Population initiale", type: "number", default: "10000", min: "100", max: "1000000" },
    { key: "beta", label: "Taux de transmission (β)", type: "number", default: "0.3", min: "0.01", max: "2", step: "0.01" },
    { key: "gamma", label: "Taux de guérison (γ)", type: "number", default: "0.1", min: "0.01", max: "1", step: "0.01" },
    { key: "duree", label: "Durée simulation (jours)", type: "number", default: "180", min: "30", max: "730" },
  ],
  hydrologie: [
    { key: "surface", label: "Surface du bassin (km²)", type: "number", default: "25", min: "1", max: "500" },
    { key: "pluviometrie", label: "Pluviométrie (mm/h)", type: "number", default: "45", min: "5", max: "200" },
    { key: "permeabilite", label: "Perméabilité du sol (%)", type: "number", default: "20", min: "0", max: "100" },
  ],
  erosion: [
    { key: "longueur", label: "Longueur côte analysée (km)", type: "number", default: "15", min: "1", max: "100" },
    { key: "niveauMer", label: "Hausse niveau mer (cm/an)", type: "number", default: "3.5", min: "0", max: "20", step: "0.1" },
    { key: "horizon", label: "Horizon projection (ans)", type: "number", default: "10", min: "5", max: "50" },
  ],
};

interface TimePoint { day: number; susceptibles: number; infectes: number; retablis: number; }

function SIRChart({ data }: { data: TimePoint[] }) {
  if (!data.length) return null;
  const W = 500, H = 200, PAD = { top: 10, right: 10, bottom: 30, left: 50 };
  const maxY = Math.max(...data.flatMap((d) => [d.susceptibles, d.infectes, d.retablis]));
  const xScale = (i: number) => PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right);
  const yScale = (v: number) => PAD.top + (1 - v / maxY) * (H - PAD.top - PAD.bottom);
  const path = (getter: (d: TimePoint) => number) =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${xScale(i).toFixed(1)},${yScale(getter(d)).toFixed(1)}`).join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * maxY));

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex items-center gap-4 mb-3 text-[10px] font-semibold">
        <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded-full bg-blue-500 inline-block" />Susceptibles</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded-full bg-red-500 inline-block" />Infectés</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded-full bg-green-500 inline-block" />Rétablis</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
        {/* Y grid + labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={PAD.left} y1={yScale(v)} x2={W - PAD.right} y2={yScale(v)} stroke="#1e293b" strokeWidth="1" />
            <text x={PAD.left - 4} y={yScale(v) + 4} textAnchor="end" fontSize="9" fill="#64748b">
              {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            </text>
          </g>
        ))}
        {/* X labels */}
        {data.map((d, i) => (
          i % 3 === 0 && (
            <text key={i} x={xScale(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#64748b">J{d.day}</text>
          )
        ))}
        {/* Lines */}
        <path d={path((d) => d.susceptibles)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
        <path d={path((d) => d.infectes)} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
        <path d={path((d) => d.retablis)} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ResultsDisplay({ results }: { results: Record<string, unknown> }) {
  const entries = Object.entries(results).filter(([k]) => !["type", "completedAt", "summary", "timeSeries"].includes(k));
  const timeSeries = results.timeSeries as TimePoint[] | undefined;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-green-500/10 border border-green-900/30 p-4 text-xs text-green-400 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 flex-none" />
        <span>{results.summary as string}</span>
      </div>

      {timeSeries && timeSeries.length > 0 && <SIRChart data={timeSeries} />}

      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map(([key, val]) => {
          if (typeof val === "object" && val !== null) {
            return (
              <div key={key} className="col-span-2 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{key}</p>
                <div className="space-y-1">
                  {Object.entries(val as Record<string, string>).map(([k2, v2]) => (
                    <div key={k2} className="flex justify-between text-xs">
                      <span className="text-slate-500">{k2}</span>
                      <span className="text-slate-300 font-mono">{v2}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div key={key} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className="text-sm font-bold text-white font-mono">{String(val)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SimulationsPage() {
  const { isAuthenticated, token } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>("netlogo");

  // NetLogo state
  const [activeSimId, setActiveSimId] = useState(SIMULATION_TOOLS[0].id);
  const [startedSims, setStartedSims] = useState<Record<string, boolean>>({});
  const activeSim = SIMULATION_TOOLS.find((s) => s.id === activeSimId) || SIMULATION_TOOLS[0];

  // Custom sim state
  const [simType, setSimType] = useState("epidemiologie");
  const [params, setParams] = useState<Record<string, string>>({});
  const [currentSimId, setCurrentSimId] = useState<string | null>(null);
  const [simStatus, setSimStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [simResults, setSimResults] = useState<DBSimulation | null>(null);
  const [history, setHistory] = useState<DBSimulation[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch history on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/simulations", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setHistory)
      .catch(() => {});
  }, [isAuthenticated, token]);

  // Initialize params when type changes
  useEffect(() => {
    const defaults: Record<string, string> = {};
    (PARAM_FORMS[simType] || []).forEach((f) => { defaults[f.key] = f.default; });
    setParams(defaults);
  }, [simType]);

  // Polling for results
  useEffect(() => {
    if (simStatus !== "running" || !currentSimId) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/simulations/${currentSimId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: DBSimulation = await res.json();
        if (data.statut === "terminee") {
          setSimResults(data);
          setSimStatus("done");
          setHistory((prev) => [data, ...prev.filter((s) => s.id !== data.id)]);
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (data.statut === "erreur") {
          setSimStatus("error");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {}
    }, 2000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [simStatus, currentSimId, token]);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setSimStatus("running");
    setSimResults(null);

    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: simType, parametres: params }),
      });
      const data: DBSimulation = await res.json();
      setCurrentSimId(data.id);
    } catch {
      setSimStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-slate-900 pb-8 mb-10">
          <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
            Outils de Modélisation Scientifique
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{t("simulations.title")}</h1>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm">{t("simulations.description")}</p>
          <div aria-hidden className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("netlogo")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
              tab === "netlogo" ? "bg-blue-600/20 text-blue-400 border-blue-900/40" : "border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <Layers className="h-3 w-3" /> {t("simulations.netlogoModels")}
          </button>
          <button
            onClick={() => setTab("custom")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
              tab === "custom" ? "bg-blue-600/20 text-blue-400 border-blue-900/40" : "border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <Activity className="h-3 w-3" /> {t("simulations.newSim")}
            {isAuthenticated && <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />}
          </button>
        </div>

        {/* ─── NetLogo Tab ─────────────────────────────────────── */}
        {tab === "netlogo" && (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-4 rounded-xl border border-slate-900 bg-slate-900/10 p-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-blue-500 pl-2">
                Modèles Disponibles
              </h3>
              {SIMULATION_TOOLS.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => setActiveSimId(sim.id)}
                  className={`w-full text-left p-4 rounded-lg border text-xs transition-all ${
                    sim.id === activeSimId
                      ? "border-blue-500 bg-slate-900/40 text-white font-bold"
                      : "border-slate-900 bg-slate-950/40 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Cpu className={`h-4 w-4 ${sim.id === activeSimId ? "text-blue-500" : "text-slate-600"}`} />
                    <span>{sim.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal leading-relaxed line-clamp-2">{sim.description}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-4">
                <h2 className="text-sm font-bold text-white">{activeSim.title}</h2>
                <p className="text-[10px] text-slate-500 mt-1">{activeSim.description}</p>
              </div>
              <div className="relative w-full rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden h-[600px] flex flex-col items-center justify-center">
                {startedSims[activeSim.id] ? (
                  <iframe
                    src={activeSim.iframeUrl}
                    title={activeSim.title}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-full border-none"
                  />
                ) : (
                  <div className="max-w-md text-center space-y-6">
                    <div className="h-16 w-16 rounded-full bg-blue-600/10 text-blue-400 border border-blue-900/30 flex items-center justify-center mx-auto animate-pulse">
                      <Play className="h-8 w-8 ml-1" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">Modèle interactif NetLogo Web. Cliquez pour initialiser le moteur de simulation.</p>
                    <button
                      onClick={() => setStartedSims((p) => ({ ...p, [activeSim.id]: true }))}
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-green-700 active:scale-95 transition-all"
                    >
                      <Play className="h-4 w-4" /> {t("simulations.launch")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Custom Simulation Tab ───────────────────────────── */}
        {tab === "custom" && (
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Form */}
            <div className="lg:col-span-5">
              {!isAuthenticated ? (
                <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-8 text-center">
                  <Cpu className="h-10 w-10 text-slate-600 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 mb-4">Connectez-vous pour lancer des simulations backend.</p>
                  <a href="/connexion" className="inline-flex items-center gap-1.5 rounded-lg bg-ummisco-blue px-4 py-2 text-xs font-semibold text-white">
                    Se connecter <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : (
                <form onSubmit={handleLaunch} className="rounded-xl border border-slate-900 bg-slate-900/10 p-6 space-y-5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-blue-500 pl-2">
                    Configurer la Simulation
                  </h3>

                  {/* Type selector */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">{t("simulations.paramType")}</label>
                    <div className="space-y-2">
                      {SIM_TYPES.map((st) => {
                        const Icon = st.icon;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setSimType(st.id)}
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                              simType === st.id ? "border-blue-500 bg-slate-900/40 text-white" : "border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2 font-semibold mb-0.5">
                              <Icon className="h-3.5 w-3.5" /> {st.label}
                            </div>
                            <p className="text-[10px] text-slate-500 font-normal">{st.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic params */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">{t("simulations.paramConfig")}</label>
                    {(PARAM_FORMS[simType] || []).map((field) => (
                      <div key={field.key}>
                        <label className="text-[10px] text-slate-500 block mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          value={params[field.key] ?? field.default}
                          onChange={(e) => setParams((p) => ({ ...p, [field.key]: e.target.value }))}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={simStatus === "running"}
                    className="w-full py-3 rounded-lg bg-ummisco-blue text-xs font-semibold uppercase tracking-wider text-white hover:bg-ummisco-blue/90 disabled:opacity-60 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {simStatus === "running" ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> {t("simulations.status_running")}</>
                    ) : (
                      <><Play className="h-4 w-4" /> {t("simulations.submit")}</>
                    )}
                  </button>
                </form>
              )}

              {/* History */}
              {isAuthenticated && history.length > 0 && (
                <div className="mt-6 rounded-xl border border-slate-900 bg-slate-900/10 p-5 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {t("simulations.myHistory")}
                  </h4>
                  {history.slice(0, 5).map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-[10px] border-b border-slate-900/50 pb-2 last:border-b-0">
                      <span className="text-slate-400">{s.type}</span>
                      <span className={`font-semibold ${s.statut === "terminee" ? "text-green-400" : s.statut === "en_cours" ? "text-amber-400" : "text-red-400"}`}>
                        {s.statut === "terminee" ? t("simulations.status_done") : s.statut === "en_cours" ? t("simulations.status_running") : "Erreur"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Results */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-6 min-h-[400px] flex flex-col">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-blue-500 pl-2 mb-6">
                  {t("simulations.results")}
                </h3>

                {simStatus === "idle" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <BarChart3 className="h-12 w-12 text-slate-700" />
                    <p className="text-xs text-slate-500">Configurez et lancez une simulation pour voir les résultats ici.</p>
                  </div>
                )}

                {simStatus === "running" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                    <div>
                      <p className="text-sm font-bold text-white">Simulation en cours...</p>
                      <p className="text-xs text-slate-500 mt-1">Calcul des résultats. Sondage toutes les 2s.</p>
                    </div>
                  </div>
                )}

                {simStatus === "done" && simResults?.resultats && (
                  <div className="flex-1 overflow-y-auto">
                    <ResultsDisplay results={simResults.resultats as Record<string, unknown>} />
                  </div>
                )}

                {simStatus === "error" && (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-red-400">Une erreur est survenue lors de la simulation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
