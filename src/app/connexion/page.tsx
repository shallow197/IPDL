"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { Lock, Mail, ShieldCheck, ArrowLeft, KeyRound, UserPlus, Shield, FlaskConical, GraduationCap, Network, Handshake, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useNotification } from "@/context/NotificationContext";

type Tab = "login" | "register";

interface DemoAccount {
  role: string;
  label: string;
  name: string;
  email: string;
  password: string;
  capability: string;
  redirect: string;
  Icon: React.ComponentType<{ className?: string }>;
  accent: string; // tailwind text color
  ring: string; // tailwind border color
  bg: string; // tailwind bg tint
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "directeur",
    label: "Directeur",
    name: "Pr. Cheikh Diallo",
    email: "admin@ummisco.sn",
    password: "admin123",
    capability: "Back-office complet : valide les publications, compose les rôles ACL, gère accès & statistiques.",
    redirect: "/admin",
    Icon: Shield,
    accent: "text-amber-400",
    ring: "border-amber-500/30 hover:border-amber-500/60",
    bg: "bg-amber-500/10",
  },
  {
    role: "chercheur",
    label: "Chercheur",
    name: "Dr. Fatou Diop",
    email: "chercheur@ummisco.sn",
    password: "chercheur123",
    capability: "Publie sans validation, dépose des datasets, gère ses publications et son profil.",
    redirect: "/dashboard",
    Icon: FlaskConical,
    accent: "text-blue-400",
    ring: "border-blue-500/30 hover:border-blue-500/60",
    bg: "bg-blue-500/10",
  },
  {
    role: "responsable_axe",
    label: "Responsable d'axe",
    name: "Dr. Moussa Ndiaye",
    email: "respaxe@ummisco.sn",
    password: "respaxe123",
    capability: "Anime un axe thématique : actualités, publications et membres de l'axe.",
    redirect: "/dashboard",
    Icon: Network,
    accent: "text-emerald-400",
    ring: "border-emerald-500/30 hover:border-emerald-500/60",
    bg: "bg-emerald-500/10",
  },
  {
    role: "etudiant",
    label: "Étudiant / Doctorant",
    name: "Mamadou Sarr",
    email: "etudiant@ummisco.sn",
    password: "etudiant123",
    capability: "Soumet des publications (validation requise), consulte datasets publics & protégés.",
    redirect: "/dashboard",
    Icon: GraduationCap,
    accent: "text-violet-400",
    ring: "border-violet-500/30 hover:border-violet-500/60",
    bg: "bg-violet-500/10",
  },
  {
    role: "partenaire",
    label: "Partenaire",
    name: "IRD France",
    email: "partenaire@ird.fr",
    password: "partenaire123",
    capability: "Accède aux livrables, lance des simulations sans contrainte, suit les projets financés.",
    redirect: "/dashboard",
    Icon: Handshake,
    accent: "text-cyan-400",
    ring: "border-cyan-500/30 hover:border-cyan-500/60",
    bg: "bg-cyan-500/10",
  },
];

export default function ConnexionPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLang();
  const { notify } = useNotification();

  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [nom, setNom] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [role, setRole] = useState("etudiant");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("login.error"));
        notify(data.error || t("login.error"), "error");
      } else {
        login(data.token, data.user);
        notify(`Bienvenue, ${data.user.nom.split(" ")[0]} !`, "success");
        router.push("/dashboard");
      }
    } catch {
      setError(t("common.error"));
      notify(t("common.error"), "error");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (acc: DemoAccount) => {
    setError("");
    setDemoLoading(acc.email);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: acc.email, password: acc.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("login.error"));
        notify(data.error || t("login.error"), "error");
      } else {
        login(data.token, data.user);
        notify(`Bienvenue, ${data.user.nom.split(" ")[0]} !`, "success");
        router.push(acc.redirect);
      }
    } catch {
      setError(t("common.error"));
      notify(t("common.error"), "error");
    } finally {
      setDemoLoading(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email: regEmail, password: regPassword, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("common.error"));
        notify(data.error || t("common.error"), "error");
      } else {
        login(data.token, data.user);
        notify(`Compte créé — bienvenue, ${data.user.nom.split(" ")[0]} !`, "success");
        router.push("/dashboard");
      }
    } catch {
      setError(t("common.error"));
      notify(t("common.error"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 h-80 w-80 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 -z-10 h-72 w-72 rounded-full bg-green-600/5 blur-[120px] pointer-events-none" />

        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-8 font-semibold absolute top-10 left-10">
          <ArrowLeft className="h-4 w-4" />
          <span>{t("common.back")}</span>
        </Link>

        <div className="w-full max-w-lg space-y-6 rounded-2xl border border-slate-900 bg-slate-900/10 p-7 sm:p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <BrandLogo height={44} />
            <h2 className="mt-4 text-xl font-extrabold text-white">{t("login.title")}</h2>
            <p className="mt-1.5 text-[11px] text-slate-500">{t("login.subtitle")}</p>
          </div>

          {/* ── DÉMO : connexion en 1 clic ──────────────────────────────── */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/[0.04] p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Accès démonstration — connexion en 1 clic
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Choisissez un profil pour explorer la plateforme avec ses droits réels. Aucun identifiant à saisir.
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const Icon = acc.Icon;
                return (
                  <button
                    key={acc.email}
                    onClick={() => quickLogin(acc)}
                    disabled={demoLoading !== null}
                    className={`group w-full flex items-center gap-3 rounded-lg border ${acc.ring} bg-slate-950/40 px-3 py-2.5 text-left transition-all active:scale-[0.99] disabled:opacity-50`}
                  >
                    <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${acc.bg} ${acc.accent}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className={`text-[13px] font-bold ${acc.accent}`}>{acc.label}</span>
                        <span className="text-[11px] text-slate-500 truncate">· {acc.name}</span>
                      </span>
                      <span className="block text-[11px] text-slate-500 leading-snug line-clamp-2">{acc.capability}</span>
                    </span>
                    {demoLoading === acc.email ? (
                      <span className="h-4 w-4 flex-none rounded-full border-2 border-slate-600 border-t-transparent animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4 flex-none text-slate-600 group-hover:text-slate-300 transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-800" />
            <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold whitespace-nowrap">ou connexion manuelle</span>
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-950/50 p-1 gap-1">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${tab === "login" ? "bg-ummisco-blue text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
            >
              {t("nav.login")}
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${tab === "register" ? "bg-ummisco-blue text-white shadow" : "text-slate-500 hover:text-slate-300"}`}
            >
              <UserPlus className="h-3 w-3" />
              {t("register.title")}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-900/30 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t("login.email")}</label>
                <div className="relative rounded-lg border border-slate-800 bg-slate-950/60 focus-within:border-blue-500/50">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                  <input
                    type="email"
                    required
                    placeholder={t("login.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-300 pl-9 pr-3 py-3 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("login.password")}</label>
                  <a href="#" className="text-[9px] text-slate-500 hover:text-slate-300 font-semibold">{t("login.forgotPassword")}</a>
                </div>
                <div className="relative rounded-lg border border-slate-800 bg-slate-950/60 focus-within:border-blue-500/50">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-300 pl-9 pr-3 py-3 focus:outline-none"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-ummisco-blue text-xs font-semibold uppercase tracking-wider text-white hover:bg-ummisco-blue/90 disabled:opacity-60 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                <span>{loading ? t("login.loading") : t("login.submit")}</span>
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t("register.name")}</label>
                <input type="text" required placeholder={t("register.namePlaceholder")} value={nom} onChange={(e) => setNom(e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-300 px-3 py-3 focus:outline-none focus:border-blue-500/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t("register.email")}</label>
                <input type="email" required placeholder="email@ucad.edu.sn" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-300 px-3 py-3 focus:outline-none focus:border-blue-500/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t("register.password")}</label>
                <input type="password" required placeholder="••••••••" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-300 px-3 py-3 focus:outline-none focus:border-blue-500/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{t("register.role")}</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 px-3 py-3 focus:outline-none focus:border-blue-500/50">
                  <option value="etudiant">{t("register.roles.etudiant")}</option>
                  <option value="chercheur">{t("register.roles.chercheur")}</option>
                  <option value="partenaire">{t("register.roles.partenaire")}</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-ummisco-blue text-xs font-semibold uppercase tracking-wider text-white hover:bg-ummisco-blue/90 disabled:opacity-60 active:scale-95 transition-all">
                {loading ? t("register.loading") : t("register.submit")}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-900 text-center">
            <span className="text-[9px] text-slate-600 flex items-center gap-1 uppercase tracking-widest font-bold justify-center">
              <ShieldCheck className="h-3.5 w-3.5" /> {t("login.secured")}
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
