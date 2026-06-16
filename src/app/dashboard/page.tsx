"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { User, BookOpen, Database, Activity, FileText, Plus, Edit3, Loader2, CheckCircle2, Clock, XCircle, LogOut, Camera } from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useNotification } from "@/context/NotificationContext";
import type { DBPublication, DBDataset, DBSimulation } from "@/lib/db";
import { AXES } from "@/data/ummiscoData";

type Tab = "profile" | "publications" | "datasets" | "simulations";

const STATUS_CONFIG = {
  validee:    { labelKey: "publications.status_validated", color: "text-green-400", icon: CheckCircle2 },
  en_attente: { labelKey: "publications.status_pending",   color: "text-amber-400", icon: Clock },
  rejetee:    { labelKey: "publications.status_rejected",  color: "text-red-400",   icon: XCircle },
  terminee:   { labelKey: "common.done",                   color: "text-green-400", icon: CheckCircle2 },
  en_cours:   { labelKey: "common.running",                color: "text-blue-400",  icon: Loader2 },
  erreur:     { labelKey: "common.error",                  color: "text-red-400",   icon: XCircle },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, authLoading, logout } = useAuth();
  const { t } = useLang();
  const { notify } = useNotification();
  const [tab, setTab] = useState<Tab>("profile");

  // Data states
  const [publications, setPublications] = useState<DBPublication[]>([]);
  const [datasets, setDatasets] = useState<DBDataset[]>([]);
  const [simulations, setSimulations] = useState<DBSimulation[]>([]);
  const [loading, setLoading] = useState(false);

  // Profile edit
  const [editMode, setEditMode] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState<Record<string, unknown>>({});
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // New publication form
  const [showPubForm, setShowPubForm] = useState(false);
  const [pubSubmitting, setPubSubmitting] = useState(false);
  const [pubForm, setPubForm] = useState({
    titre: "", resume: "", auteurs: "", journal: "",
    volume: "", numero: "", pages: "", doi: "",
    annee: new Date().getFullYear().toString(),
    axe: "agents", accessLevel: "public",
    motsClefs: "", fichierPdf: "", googleScholarUrl: "",
    datasetsLies: [] as string[],
    citationApa: "", citationBibtex: "",
  });
  const [availableDatasets, setAvailableDatasets] = useState<DBDataset[]>([]);

  const setPub = (field: string, value: string | string[]) =>
    setPubForm((prev) => ({ ...prev, [field]: value }));

  // New dataset form
  const [showDsForm, setShowDsForm] = useState(false);
  const [dsTitle, setDsTitle] = useState("");
  const [dsDesc, setDsDesc] = useState("");
  const [dsAccess, setDsAccess] = useState("public");
  const [dsSubmitting, setDsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return; // wait until localStorage is read
    if (!isAuthenticated) {
      router.push("/connexion");
      return;
    }
    if (tab === "profile") loadProfile();
    else loadData();
  }, [isAuthenticated, authLoading, tab]);

  const loadProfile = async () => {
    if (!token) return;
    const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setProfileData(data);
    }
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    setProfileLoading(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfileData(updated);
        setEditMode(false);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const setProfile = (field: string, value: unknown) =>
    setProfileData((prev) => ({ ...prev, [field]: value }));

  const str = (v: unknown) => (v as string) ?? "";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile("avatar", reader.result as string);
    reader.readAsDataURL(file);
  };

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      if (tab === "publications") {
        const [pubRes, dsRes] = await Promise.all([
          fetch("/api/publications/mine", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/datasets",           { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (pubRes.ok) setPublications(await pubRes.json());
        if (dsRes.ok)  setAvailableDatasets(await dsRes.json());
      }
      if (tab === "datasets") {
        const res = await fetch("/api/datasets", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setDatasets(await res.json());
      }
      if (tab === "simulations") {
        const res = await fetch("/api/simulations", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setSimulations(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    setPubSubmitting(true);
    try {
      const payload = {
        titre: pubForm.titre,
        resume: pubForm.resume,
        auteurs: pubForm.auteurs.split(",").map((s) => s.trim()).filter(Boolean),
        journal: pubForm.journal || undefined,
        volume: pubForm.volume || undefined,
        numero: pubForm.numero || undefined,
        pages: pubForm.pages || undefined,
        doi: pubForm.doi || undefined,
        annee: parseInt(pubForm.annee) || new Date().getFullYear(),
        axe: pubForm.axe,
        accessLevel: pubForm.accessLevel,
        motsClefs: pubForm.motsClefs.split(",").map((s) => s.trim()).filter(Boolean),
        fichierPdf: pubForm.fichierPdf || undefined,
        googleScholarUrl: pubForm.googleScholarUrl || undefined,
        datasetsLies: pubForm.datasetsLies,
        citationApa: pubForm.citationApa || undefined,
        citationBibtex: pubForm.citationBibtex || undefined,
      };
      const res = await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const pub = await res.json();
        setPublications((prev) => [pub, ...prev]);
        setShowPubForm(false);
        setPubForm({
          titre: "", resume: "", auteurs: "", journal: "",
          volume: "", numero: "", pages: "", doi: "",
          annee: new Date().getFullYear().toString(),
          axe: "agents", accessLevel: "public",
          motsClefs: "", fichierPdf: "", googleScholarUrl: "",
          datasetsLies: [], citationApa: "", citationBibtex: "",
        });
        notify(t("dashboard.pubSubmitted"), "success");
      } else {
        notify(t("dashboard.pubError"), "error");
      }
    } finally {
      setPubSubmitting(false);
    }
  };

  const handleSubmitDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    setDsSubmitting(true);
    try {
      const res = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ titre: dsTitle, description: dsDesc, acces: dsAccess }),
      });
      if (res.ok) {
        const ds = await res.json();
        setDatasets((prev) => [ds, ...prev]);
        setShowDsForm(false);
        setDsTitle(""); setDsDesc("");
        notify(t("dashboard.dsSubmitted"), "success");
      } else {
        notify(t("dashboard.dsError"), "error");
      }
    } finally {
      setDsSubmitting(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-slate-400 text-sm">{t("common.loading")}</div>
    </div>
  );
  if (!isAuthenticated) return null;

  const TABS = [
    { id: "profile" as Tab, label: t("dashboard.profile"), icon: User },
    { id: "publications" as Tab, label: t("dashboard.publications"), icon: BookOpen },
    { id: "datasets" as Tab, label: t("dashboard.datasets"), icon: Database },
    { id: "simulations" as Tab, label: t("dashboard.simulations"), icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-8 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">{t("dashboard.title")}</h1>
            <p className="text-xs text-slate-500 mt-1">{user?.email} · <span className="text-blue-400 font-semibold capitalize">{user?.role}</span></p>
          </div>
          <button
            onClick={() => { notify(t("dashboard.goodbye"), "info"); logout(); router.push("/"); }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-500 hover:text-red-400 hover:border-red-900/30 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" /> {t("nav.logout")}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar tabs */}
          <div className="lg:col-span-3">
            <nav className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                    tab === id ? "bg-slate-900 text-white border border-slate-800" : "text-slate-500 hover:text-slate-200 hover:bg-slate-900/30"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-none ${tab === id ? "text-blue-400" : ""}`} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-9">

            {/* ── Profile Tab ─────────────────────────────────── */}
            {tab === "profile" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative group h-16 w-16 flex-none">
                        {profileData.avatar ? (
                          <img src={profileData.avatar as string} alt="avatar" className="h-16 w-16 rounded-full object-cover border border-blue-900/30" />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-blue-600/10 text-blue-400 text-xl font-extrabold border border-blue-900/30 flex items-center justify-center">
                            {user?.nom?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </div>
                        )}
                        <button
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title={t("dashboard.changePhoto")}
                        >
                          <Camera className="h-5 w-5 text-white" />
                        </button>
                        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold text-white">{user?.nom}</h2>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-600/10 text-blue-400 border border-blue-900/30 text-[9px] font-bold uppercase tracking-wider">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-[10px] font-semibold text-slate-400 hover:text-slate-200"
                    >
                      <Edit3 className="h-3 w-3" /> {editMode ? t("common.cancel") : t("dashboard.editProfile")}
                    </button>
                  </div>

                  {profileSaved && (
                    <div className="mb-4 rounded-lg bg-green-500/10 border border-green-900/30 px-3 py-2 text-xs text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Profil mis à jour.
                    </div>
                  )}

                  {editMode ? (
                    <div className="space-y-6">
                      {/* ── Section commune ── */}
                      <div className="space-y-3">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">{t("profile.generalInfo")}</p>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("admin.biography")}</label>
                          <textarea
                            rows={3}
                            value={(profileData.biographie as string) ?? ""}
                            onChange={(e) => setProfile("biographie", e.target.value)}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50"
                            placeholder="Décrivez vos recherches et domaines d'expertise..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.labelTel")}</label>
                            <input type="tel" value={(profileData.telephone as string) ?? ""} onChange={(e) => setProfile("telephone", e.target.value)} placeholder="+221 77 000 00 00" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">ORCID</label>
                            <input type="text" value={(profileData.orcid as string) ?? ""} onChange={(e) => setProfile("orcid", e.target.value)} placeholder="0000-0002-1234-5678" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 font-mono px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.externalProfile")}</label>
                          <input type="url" value={(profileData.lienExterne as string) ?? ""} onChange={(e) => setProfile("lienExterne", e.target.value)} placeholder="https://scholar.google.com/..." className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                        </div>
                      </div>

                      {/* ── Chercheurs / responsables / directeur ── */}
                      {["chercheur", "responsable_axe", "directeur"].includes(user?.role ?? "") && (
                        <div className="space-y-3">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">{t("profile.academicInfo")}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.affiliation")}</label>
                              <input type="text" value={(profileData.affiliation as string) ?? ""} onChange={(e) => setProfile("affiliation", e.target.value)} placeholder="UCAD — École Supérieure Polytechnique" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.ummiscoCenter")}</label>
                              <select value={(profileData.centre as string) ?? ""} onChange={(e) => setProfile("centre", e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 px-3 py-2.5 focus:outline-none">
                                <option value="">{t("profile.centerChoose")}</option>
                                <option value="Dakar">{t("profile.centerDakar")}</option>
                                <option value="Bondy">{t("profile.centerBondy")}</option>
                                <option value="Hanoï">{t("profile.centerHanoi")}</option>
                                <option value="Rabat">{t("profile.centerRabat")}</option>
                                <option value="Yaoundé">{t("profile.centerYaounde")}</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.domain")}</label>
                            <input type="text" value={(profileData.domaine as string) ?? ""} onChange={(e) => setProfile("domaine", e.target.value)} placeholder="Mathématiques, Informatique, Biologie..." className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.expertises")} <span className="font-normal text-slate-600 normal-case">— {t("profile.expertisesNote")}</span></label>
                            <input type="text" value={((profileData.expertises as string[]) ?? []).join(", ")} onChange={(e) => setProfile("expertises", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Modélisation multi-agents, Épidémiologie, GAMA..." className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                          </div>
                        </div>
                      )}

                      {/* ── Étudiants / doctorants ── */}
                      {user?.role === "etudiant" && (
                        <div className="space-y-3">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">{t("profile.phdInfo")}</p>
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" checked={(profileData.estDoctorant as boolean) ?? false} onChange={(e) => setProfile("estDoctorant", e.target.checked)} className="rounded border-slate-600 accent-blue-500 h-3.5 w-3.5" />
                            <span className="text-xs text-slate-300">{t("profile.isPhD")}</span>
                          </label>
                          {!!profileData.estDoctorant && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.thesisDirector")}</label>
                                  <input type="text" value={(profileData.directeurThese as string) ?? ""} onChange={(e) => setProfile("directeurThese", e.target.value)} placeholder="Pr. Cheikh Diallo" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.thesisYear")}</label>
                                  <select value={(profileData.anneeThese as number) ?? ""} onChange={(e) => setProfile("anneeThese", e.target.value ? parseInt(e.target.value) : undefined)} className="w-full rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 px-3 py-2.5 focus:outline-none">
                                    <option value="">—</option>
                                    {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}ère{n > 1 ? "" : ""} année</option>)}
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.registrationUniversity")}</label>
                                <input type="text" value={(profileData.universiteInscription as string) ?? ""} onChange={(e) => setProfile("universiteInscription", e.target.value)} placeholder="UCAD, UASZ, UGB..." className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ── Partenaires ── */}
                      {user?.role === "partenaire" && (
                        <div className="space-y-3">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">{t("profile.orgInfo")}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.orgType")}</label>
                              <select value={(profileData.typeOrganisation as string) ?? ""} onChange={(e) => setProfile("typeOrganisation", e.target.value || undefined)} className="w-full rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 px-3 py-2.5 focus:outline-none">
                                <option value="">{t("profile.orgTypeChoose")}</option>
                                <option value="academique">{t("profile.orgTypeAcademic")}</option>
                                <option value="institutionnel">{t("profile.orgTypeInstitutional")}</option>
                                <option value="industriel">{t("profile.orgTypeIndustrial")}</option>
                                <option value="bailleur">{t("profile.orgTypeFunder")}</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.country")}</label>
                              <input type="text" value={(profileData.pays as string) ?? ""} onChange={(e) => setProfile("pays", e.target.value)} placeholder="France, Sénégal, Maroc..." className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.website")}</label>
                            <input type="url" value={(profileData.siteWeb as string) ?? ""} onChange={(e) => setProfile("siteWeb", e.target.value)} placeholder="https://www.organisation.org" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("profile.organisation")}</label>
                            <input type="text" value={(profileData.organisation as string) ?? ""} onChange={(e) => setProfile("organisation", e.target.value)} placeholder="Nom complet de l'organisation" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={handleSaveProfile}
                          disabled={profileLoading}
                          className="px-4 py-2 rounded-lg bg-ummisco-blue text-xs font-semibold text-white disabled:opacity-60 flex items-center gap-1.5"
                        >
                          {profileLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Enregistrement...</> : t("common.save")}
                        </button>
                        <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-semibold text-slate-400">
                          {t("common.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Vue lecture ── */
                    <div className="space-y-5">
                      {!!profileData.biographie && (
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">{t("admin.biography")}</p>
                          <p className="text-xs text-slate-400 leading-relaxed">{str(profileData.biographie)}</p>
                        </div>
                      )}

                      {/* Champs communs renseignés */}
                      {!!(profileData.telephone || profileData.orcid || profileData.lienExterne) && (
                        <div className="grid grid-cols-1 gap-2">
                          {!!profileData.telephone && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span className="text-[9px] font-bold text-slate-600 uppercase w-20 flex-none">{t("profile.labelTel")}</span>
                              <span>{str(profileData.telephone)}</span>
                            </div>
                          )}
                          {!!profileData.orcid && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span className="text-[9px] font-bold text-slate-600 uppercase w-20 flex-none">{t("profile.labelOrcid")}</span>
                              <span className="font-mono">{str(profileData.orcid)}</span>
                            </div>
                          )}
                          {!!profileData.lienExterne && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span className="text-[9px] font-bold text-slate-600 uppercase w-20 flex-none">{t("profile.labelProfile")}</span>
                              <a href={str(profileData.lienExterne)} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">{str(profileData.lienExterne)}</a>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Chercheurs */}
                      {["chercheur", "responsable_axe", "directeur"].includes(user?.role ?? "") && (
                        <div className="space-y-2">
                          {!!profileData.affiliation && <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-[9px] font-bold text-slate-600 uppercase w-20 flex-none">{t("profile.labelAffil")}</span>{str(profileData.affiliation)}</div>}
                          {!!profileData.centre && <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-[9px] font-bold text-slate-600 uppercase w-20 flex-none">{t("profile.labelCentre")}</span>{str(profileData.centre)}</div>}
                          {!!profileData.domaine && <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-[9px] font-bold text-slate-600 uppercase w-20 flex-none">{t("profile.labelDomain")}</span>{str(profileData.domaine)}</div>}
                          {(profileData.expertises as string[] | undefined)?.length ? (
                            <div>
                              <p className="text-[9px] font-bold text-slate-600 uppercase mb-1.5">{t("profile.labelExpertises")}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {(profileData.expertises as string[]).map((e) => (
                                  <span key={e} className="px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-900/30 text-[10px] font-medium">{e}</span>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {/* Étudiant */}
                      {user?.role === "etudiant" && !!profileData.estDoctorant && (
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t("profile.labelPhD")}</p>
                          {!!profileData.directeurThese && <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-[9px] font-bold text-slate-600 uppercase w-24 flex-none">{t("profile.labelDirector")}</span>{str(profileData.directeurThese)}</div>}
                          {!!profileData.anneeThese && <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-[9px] font-bold text-slate-600 uppercase w-24 flex-none">{t("profile.labelYear")}</span>{str(profileData.anneeThese)}e année</div>}
                          {!!profileData.universiteInscription && <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-[9px] font-bold text-slate-600 uppercase w-24 flex-none">{t("profile.labelUniversity")}</span>{str(profileData.universiteInscription)}</div>}
                        </div>
                      )}

                      {/* Partenaire */}
                      {user?.role === "partenaire" && (
                        <div className="space-y-2">
                          {!!profileData.organisation && <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-[9px] font-bold text-slate-600 uppercase w-24 flex-none">{t("profile.labelOrg")}</span>{str(profileData.organisation)}</div>}
                          {!!profileData.typeOrganisation && <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-[9px] font-bold text-slate-600 uppercase w-24 flex-none">{t("profile.labelType")}</span><span className="capitalize">{str(profileData.typeOrganisation)}</span></div>}
                          {!!profileData.pays && <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-[9px] font-bold text-slate-600 uppercase w-24 flex-none">{t("profile.labelCountry")}</span>{str(profileData.pays)}</div>}
                          {!!profileData.siteWeb && <div className="flex items-center gap-2 text-xs text-slate-400"><span className="text-[9px] font-bold text-slate-600 uppercase w-24 flex-none">{t("profile.labelSite")}</span><a href={str(profileData.siteWeb)} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">{str(profileData.siteWeb)}</a></div>}
                        </div>
                      )}

                      {!profileData.biographie && !profileData.telephone && !profileData.orcid && (
                        <p className="text-xs text-slate-500 italic">{t("profile.noInfo")}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: t("nav.publications"), value: publications.length, icon: BookOpen },
                    { label: t("nav.datasets"),     value: datasets.length,     icon: Database },
                    { label: t("nav.simulations"),  value: simulations.length,  icon: Activity },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-slate-900 bg-slate-900/10 p-4 text-center">
                      <Icon className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-extrabold text-stat-number">{value}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Publications Tab ─────────────────────────────── */}
            {tab === "publications" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">{t("dashboard.publications")}</h2>
                  {["chercheur", "responsable_axe", "directeur"].includes(user?.role || "") && (
                    <button
                      onClick={() => setShowPubForm(!showPubForm)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/10 px-3 py-2 text-[10px] font-bold text-blue-400 border border-blue-900/30 hover:bg-blue-600/20 transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" /> {t("publications.submit")}
                    </button>
                  )}
                </div>

                {showPubForm && (
                  <form onSubmit={handleSubmitPublication} className="rounded-xl border border-slate-800 bg-slate-900/20 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">{t("pubForm.submitTitle")}</h3>
                      <span className="text-[9px] text-amber-400 border border-amber-900/30 bg-amber-500/10 px-2 py-0.5 rounded font-bold uppercase">{t("pubForm.pendingBadge")}</span>
                    </div>

                    {/* Section 1 */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">{t("pubForm.section1")}</p>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.titleLabel")} <span className="text-red-400">*</span></label>
                        <input type="text" required value={pubForm.titre} onChange={(e) => setPub("titre", e.target.value)} placeholder="Titre complet de la publication" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.authorsLabel")} <span className="text-red-400">*</span> <span className="font-normal text-slate-600 normal-case">— {t("pubForm.authorsNote")}</span></label>
                        <input type="text" required value={pubForm.auteurs} onChange={(e) => setPub("auteurs", e.target.value)} placeholder={t("pubForm.authorPlaceholder")} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.abstractLabel")} <span className="text-red-400">*</span></label>
                        <textarea rows={5} required value={pubForm.resume} onChange={(e) => setPub("resume", e.target.value)} placeholder="Résumé complet (abstract)..." className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50 resize-y" />
                      </div>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">{t("pubForm.section2")}</p>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.journalLabel")}</label>
                        <input type="text" value={pubForm.journal} onChange={(e) => setPub("journal", e.target.value)} placeholder={t("pubForm.journalPlaceholder")} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.yearLabel")} <span className="text-red-400">*</span></label>
                          <input type="number" required min={1990} max={2030} value={pubForm.annee} onChange={(e) => setPub("annee", e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.volumeLabel")}</label>
                          <input type="text" value={pubForm.volume} onChange={(e) => setPub("volume", e.target.value)} placeholder="12" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.numberLabel")}</label>
                          <input type="text" value={pubForm.numero} onChange={(e) => setPub("numero", e.target.value)} placeholder="3" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.pagesLabel")}</label>
                          <input type="text" value={pubForm.pages} onChange={(e) => setPub("pages", e.target.value)} placeholder="45-62" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.doiLabel")}</label>
                        <input type="text" value={pubForm.doi} onChange={(e) => setPub("doi", e.target.value)} placeholder="10.1234/jmsc.2024.001" className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 font-mono px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                      </div>
                    </div>

                    {/* Section 3 */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">{t("pubForm.section3")}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.axeLabel")} <span className="text-red-400">*</span></label>
                          <select value={pubForm.axe} onChange={(e) => setPub("axe", e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 px-3 py-2.5 focus:outline-none">
                            {AXES.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.accessLabel")}</label>
                          <select value={pubForm.accessLevel} onChange={(e) => setPub("accessLevel", e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 px-3 py-2.5 focus:outline-none">
                            <option value="public">{t("pubForm.accessPublic")}</option>
                            <option value="protected">{t("pubForm.accessProtected")}</option>
                            <option value="private">{t("pubForm.accessPrivate")}</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.keywordsLabel")} <span className="font-normal text-slate-600 normal-case">— {t("pubForm.keywordsNote")}</span></label>
                        <input type="text" value={pubForm.motsClefs} onChange={(e) => setPub("motsClefs", e.target.value)} placeholder={t("pubForm.keywordsPlaceholder")} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                      </div>
                    </div>

                    {/* Section 4 */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">{t("pubForm.section4")}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.pdfUrl")}</label>
                          <input type="url" value={pubForm.fichierPdf} onChange={(e) => setPub("fichierPdf", e.target.value)} placeholder="https://..." className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.scholarLabel")}</label>
                          <input type="url" value={pubForm.googleScholarUrl} onChange={(e) => setPub("googleScholarUrl", e.target.value)} placeholder="https://scholar.google.com/..." className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50" />
                        </div>
                      </div>
                      {availableDatasets.length > 0 && (
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-2">{t("pubForm.datasetsLabel")}</label>
                          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                            {availableDatasets.map((ds) => (
                              <label key={ds.id} className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/30 px-3 py-2 cursor-pointer hover:border-slate-700 transition-colors">
                                <input type="checkbox" checked={pubForm.datasetsLies.includes(ds.id)}
                                  onChange={(e) => {
                                    const next = e.target.checked ? [...pubForm.datasetsLies, ds.id] : pubForm.datasetsLies.filter((id) => id !== ds.id);
                                    setPub("datasetsLies", next);
                                  }}
                                  className="rounded border-slate-600 accent-blue-500" />
                                <span className="text-[10px] text-slate-300 flex-1 truncate">{ds.titre}</span>
                                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${ds.acces === "public" ? "text-green-400 bg-green-500/10" : "text-blue-400 bg-blue-500/10"}`}>{ds.acces}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 5 — Citations */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">{t("pubForm.section5")} <span className="font-normal text-slate-600 normal-case">({t("pubForm.citationsNote")})</span></p>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.apa")}</label>
                        <textarea rows={2} value={pubForm.citationApa} onChange={(e) => setPub("citationApa", e.target.value)} placeholder="Auteur, P. (2024). Titre. Revue, Vol(N°), p-p." className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2 focus:outline-none font-mono" />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t("pubForm.bibtex")}</label>
                        <textarea rows={4} value={pubForm.citationBibtex} onChange={(e) => setPub("citationBibtex", e.target.value)} placeholder={"@article{clé,\n  title={...},\n  author={...},\n  year={2024}\n}"} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2 focus:outline-none font-mono resize-y" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-slate-800">
                      <button type="submit" disabled={pubSubmitting} className="flex-1 py-2.5 rounded-lg bg-ummisco-blue text-xs font-semibold uppercase tracking-wider text-white hover:bg-ummisco-blue/90 disabled:opacity-60 active:scale-95 transition-all flex items-center justify-center gap-2">
                        {pubSubmitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("pubForm.submitting")}</> : t("publications.submit")}
                      </button>
                      <button type="button" onClick={() => setShowPubForm(false)} className="px-5 py-2.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-slate-200">{t("common.cancel")}</button>
                    </div>
                  </form>
                )}

                {loading ? (
                  <div className="text-center py-10 text-slate-500 text-xs">{t("common.loading")}</div>
                ) : (
                  <div className="space-y-3">
                    {publications.map((p) => {
                      const st = STATUS_CONFIG[p.statut];
                      const StatusIcon = st.icon;
                      return (
                        <div key={p.id} className="rounded-xl border border-slate-900 bg-slate-900/10 p-4 flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">{p.titre}</h3>
                            <p className="text-[10px] text-slate-500 mt-1">{p.axe} · {p.datePublication}</p>
                          </div>
                          <span className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider flex-none ${st.color}`}>
                            <StatusIcon className="h-3 w-3" /> {t(st.labelKey)}
                          </span>
                        </div>
                      );
                    })}
                    {publications.length === 0 && <div className="text-center py-10 text-slate-500 text-xs">{t("pubForm.noPubs")}</div>}
                  </div>
                )}
              </div>
            )}

            {/* ── Datasets Tab ─────────────────────────────────── */}
            {tab === "datasets" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">{t("dashboard.datasets")}</h2>
                  {["chercheur", "responsable_axe", "directeur"].includes(user?.role || "") && (
                    <button
                      onClick={() => setShowDsForm(!showDsForm)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/10 px-3 py-2 text-[10px] font-bold text-blue-400 border border-blue-900/30 hover:bg-blue-600/20 transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" /> {t("datasets.submit")}
                    </button>
                  )}
                </div>

                {showDsForm && (
                  <form onSubmit={handleSubmitDataset} className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-300">{t("dsForm.submitTitle")}</h3>
                    <input type="text" required placeholder={t("dsForm.titlePlaceholder")} value={dsTitle} onChange={(e) => setDsTitle(e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none" />
                    <textarea rows={3} required placeholder={t("dsForm.descPlaceholder")} value={dsDesc} onChange={(e) => setDsDesc(e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none" />
                    <select value={dsAccess} onChange={(e) => setDsAccess(e.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 px-3 py-2.5">
                      <option value="public">{t("dsForm.accessPublic")}</option>
                      <option value="protected">{t("dsForm.accessProtected")}</option>
                      <option value="private">{t("dsForm.accessPrivate")}</option>
                    </select>
                    <div className="flex gap-2">
                      <button type="submit" disabled={dsSubmitting} className="px-4 py-2 rounded-lg bg-ummisco-blue text-xs font-semibold text-white disabled:opacity-60">
                        {dsSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : t("common.submit")}
                      </button>
                      <button type="button" onClick={() => setShowDsForm(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs text-slate-400">{t("common.cancel")}</button>
                    </div>
                  </form>
                )}

                {loading ? (
                  <div className="text-center py-10 text-slate-500 text-xs">{t("common.loading")}</div>
                ) : (
                  <div className="space-y-3">
                    {datasets.map((d) => (
                      <div key={d.id} className="rounded-xl border border-slate-900 bg-slate-900/10 p-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xs font-bold text-white line-clamp-1">{d.titre}</h3>
                          <p className="text-[10px] text-slate-500 mt-1">{d.size} · {d.downloads} {t("dsForm.downloads")} · {d.dateDepot}</p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider flex-none ${d.acces === "public" ? "text-green-400" : d.acces === "protected" ? "text-blue-400" : "text-red-400"}`}>
                          {d.acces}
                        </span>
                      </div>
                    ))}
                    {datasets.length === 0 && <div className="text-center py-10 text-slate-500 text-xs">{t("dsForm.noDatasets")}</div>}
                  </div>
                )}
              </div>
            )}

            {/* ── Simulations Tab ───────────────────────────────── */}
            {tab === "simulations" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">{t("dashboard.simulations")}</h2>
                  <a href="/simulations" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/10 px-3 py-2 text-[10px] font-bold text-blue-400 border border-blue-900/30 hover:bg-blue-600/20 transition-all">
                    <Plus className="h-3.5 w-3.5" /> {t("simulations.newSim")}
                  </a>
                </div>

                {loading ? (
                  <div className="text-center py-10 text-slate-500 text-xs">{t("common.loading")}</div>
                ) : (
                  <div className="space-y-3">
                    {simulations.map((s) => {
                      const st = STATUS_CONFIG[s.statut as keyof typeof STATUS_CONFIG];
                      const StatusIcon = st?.icon || Clock;
                      return (
                        <div key={s.id} className="rounded-xl border border-slate-900 bg-slate-900/10 p-4 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-xs font-bold text-white capitalize">{s.type}</h3>
                            <p className="text-[10px] text-slate-500 mt-0.5">{new Date(s.dateLancement).toLocaleDateString("fr-FR")}</p>
                          </div>
                          <span className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider flex-none ${st?.color}`}>
                            <StatusIcon className="h-3 w-3" /> {st ? t(st.labelKey) : ""}
                          </span>
                        </div>
                      );
                    })}
                    {simulations.length === 0 && <div className="text-center py-10 text-slate-500 text-xs">{t("simulations.noHistory")}</div>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
