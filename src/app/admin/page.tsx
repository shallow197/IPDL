"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield, CheckCircle2, XCircle, Users, BookOpen,
  Activity, ChevronDown, X, Eye, Search,
  Mail, UserX, UserCheck, Info,
  KeyRound, Plus, Trash2, Layers, ShieldCheck, Clock, Check,
} from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useNotification } from "@/context/NotificationContext";
import type { DBPublication, DBDataset, DBUser, DBRole, DBAccessRequest, Permission } from "@/lib/db";
import type { UserRole } from "@/context/AuthContext";
import PublicationCard from "@/components/PublicationCard";
import { AXES } from "@/data/ummiscoData";

type Tab = "publications" | "users" | "acl";

const ROLE_OPTIONS = [
  { value: "etudiant", label: "Étudiant" },
  { value: "chercheur", label: "Chercheur" },
  { value: "responsable_axe", label: "Responsable d'axe" },
  { value: "partenaire", label: "Partenaire" },
  { value: "directeur", label: "Directeur" },
];

const STATUS_STYLES: Record<string, string> = {
  validee: "text-green-400 border-green-900/30 bg-green-500/10",
  en_attente: "text-amber-400 border-amber-900/30 bg-amber-500/10",
  rejetee: "text-red-400 border-red-900/30 bg-red-500/10",
};

const ACCESS_STYLES: Record<string, string> = {
  public: "text-green-400 border-green-900/30 bg-green-500/10",
  protected: "text-blue-400 border-blue-900/30 bg-blue-500/10",
  private: "text-red-400 border-red-900/30 bg-red-500/10",
};

function PublicationDetailModal({
  pub,
  onClose,
  onValidate,
  onReject,
  updating,
  datasets,
}: {
  pub: DBPublication;
  onClose: () => void;
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
  updating: string | null;
  datasets: DBDataset[];
}) {
  const datasetTitles = Object.fromEntries(datasets.map((d) => [d.id, d.titre]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-3 z-10">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fiche de publication — Admin</p>
        </div>
        <div className="p-6">
          <PublicationCard
            pub={pub}
            datasetTitles={datasetTitles}
            isAdmin
            onValidate={(id) => { onValidate(id); onClose(); }}
            onReject={(id) => { onReject(id); onClose(); }}
            updating={updating === pub.id}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

function UserDetailPanel({
  u,
  currentUserId,
  onRoleChange,
  onToggleActive,
  updating,
}: {
  u: DBUser & { active?: boolean };
  currentUserId: string;
  onRoleChange: (id: string, role: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  updating: string | null;
}) {
  const [editRole, setEditRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(u.role);
  const isCurrentUser = u.id === currentUserId;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 space-y-4">
      {/* Identity */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-blue-600/10 border border-blue-900/30 flex items-center justify-center text-sm font-extrabold text-blue-400 flex-none">
          {u.nom.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{u.nom}</p>
          <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
            <Mail className="h-3 w-3 flex-none" /> {u.email}
          </p>
        </div>
        {u.active === false && (
          <span className="text-[9px] text-red-400 font-bold uppercase border border-red-900/30 bg-red-500/10 px-2 py-0.5 rounded flex-none">
            Désactivé
          </span>
        )}
      </div>

      {/* Bio */}
      {u.biographie && (
        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Biographie</label>
          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{u.biographie}</p>
        </div>
      )}

      {/* Expertises */}
      {u.expertises && u.expertises.length > 0 && (
        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Expertises</label>
          <div className="flex flex-wrap gap-1">
            {u.expertises.map((e) => (
              <span key={e} className="text-[9px] bg-slate-800 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Organisation (Partenaire) */}
      {u.organisation && (
        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Organisation</label>
          <p className="text-xs text-slate-300">{u.organisation} {u.domaine ? `— ${u.domaine}` : ""}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 text-[10px] pt-1 border-t border-slate-800">
        <div>
          <span className="text-slate-500 block">Inscrit le</span>
          <span className="text-slate-300">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Rôle actuel</span>
          <span className="text-slate-300 capitalize">{u.role.replace("_", " ")}</span>
        </div>
      </div>

      {/* Actions — disabled for self */}
      {!isCurrentUser && (
        <div className="space-y-2 pt-1 border-t border-slate-800">
          {/* Role change */}
          {editRole ? (
            <div className="flex gap-2 items-center">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 text-xs text-slate-200 px-2 py-1.5 focus:outline-none"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <button
                onClick={() => { onRoleChange(u.id, selectedRole); setEditRole(false); }}
                disabled={updating === u.id}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-[10px] font-bold text-blue-400 border border-blue-900/30 hover:bg-blue-600/30 disabled:opacity-50"
              >
                Confirmer
              </button>
              <button
                onClick={() => { setEditRole(false); setSelectedRole(u.role); }}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] text-slate-400"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditRole(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-[10px] font-semibold text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
            >
              <ChevronDown className="h-3 w-3" /> Modifier le rôle
            </button>
          )}

          {/* Activate / deactivate */}
          <button
            onClick={() => onToggleActive(u.id, !(u.active !== false))}
            disabled={updating === u.id}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[10px] font-semibold border transition-all disabled:opacity-50 ${
              u.active === false
                ? "border-green-900/30 bg-green-600/10 text-green-400 hover:bg-green-600/20"
                : "border-red-900/30 bg-red-600/10 text-red-400 hover:bg-red-600/20"
            }`}
          >
            {u.active === false ? (
              <><UserCheck className="h-3.5 w-3.5" /> Réactiver le compte</>
            ) : (
              <><UserX className="h-3.5 w-3.5" /> Désactiver le compte</>
            )}
          </button>
        </div>
      )}
      {isCurrentUser && (
        <p className="text-[9px] text-slate-600 italic text-center">Votre propre compte — modifications désactivées.</p>
      )}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, authLoading } = useAuth();
  const { t } = useLang();
  const { notify } = useNotification();

  const [tab, setTab] = useState<Tab>("publications");
  const [publications, setPublications] = useState<DBPublication[]>([]);
  const [users, setUsers] = useState<(DBUser & { active?: boolean })[]>([]);
  const [datasets, setDatasets] = useState<DBDataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  // Publications state
  const [selectedPub, setSelectedPub] = useState<DBPublication | null>(null);
  const [pubFilter, setPubFilter] = useState<"all" | "en_attente" | "validee" | "rejetee">("all");
  const [pubSearch, setPubSearch] = useState("");

  // Users state
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<(DBUser & { active?: boolean }) | null>(null);

  // ACL state
  const [roles, setRoles] = useState<DBRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [requests, setRequests] = useState<DBAccessRequest[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRolePerms, setNewRolePerms] = useState<string[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/connexion"); return; }
    if (user?.role !== "directeur") { router.push("/dashboard"); return; }
    loadTab();
  }, [isAuthenticated, authLoading, tab]);

  const loadTab = async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    try {
      // Always refresh users + access requests so the header stats and the
      // pending badges stay accurate on every tab.
      const [usersRes, reqRes] = await Promise.all([
        fetch("/api/users", { headers }),
        fetch("/api/acl/requests", { headers }),
      ]);
      if (usersRes.ok) setUsers(await usersRes.json());
      if (reqRes.ok) setRequests(await reqRes.json());

      if (tab === "publications") {
        const [pubRes, dsRes] = await Promise.all([
          fetch("/api/publications/all", { headers }),
          fetch("/api/datasets", { headers }),
        ]);
        if (pubRes.ok) setPublications(await pubRes.json());
        if (dsRes.ok)  setDatasets(await dsRes.json());
      }
      if (tab === "acl") {
        const rolesRes = await fetch("/api/acl/roles", { headers });
        if (rolesRes.ok) {
          const data = await rolesRes.json();
          setRoles(data.roles);
          setPermissions(data.permissions);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePublication = async (id: string, statut: "validee" | "rejetee") => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/publications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ statut }),
      });
      if (res.ok) {
        setPublications((prev) => prev.map((p) => p.id === id ? { ...p, statut } : p));
        if (selectedPub?.id === id) setSelectedPub((p) => p ? { ...p, statut } : null);
        notify(statut === "validee" ? "Publication validée." : "Publication rejetée.", statut === "validee" ? "success" : "warning");
      } else {
        notify("Erreur lors de la mise à jour.", "error");
      }
    } finally {
      setUpdating(null);
    }
  };

  const changeRole = async (userId: string, role: string) => {
    setUpdating(userId);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, role }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: role as DBUser["role"] } : u));
        setSelectedUser((u) => u && u.id === userId ? { ...u, role: role as DBUser["role"] } : u);
        notify("Rôle mis à jour.", "success");
      } else {
        notify("Erreur lors du changement de rôle.", "error");
      }
    } finally {
      setUpdating(null);
    }
  };

  const toggleUserActive = async (userId: string, active: boolean) => {
    setUpdating(userId);
    try {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, active } : u));
      setSelectedUser((u) => u && u.id === userId ? { ...u, active } : u);
      notify(active ? "Compte réactivé." : "Compte désactivé.", active ? "success" : "warning");
    } finally {
      setUpdating(null);
    }
  };

  // ── ACL handlers ──────────────────────────────────────────────────────────
  const decideRequest = async (id: string, decision: "approuvee" | "refusee") => {
    setUpdating(id);
    try {
      const res = await fetch("/api/acl/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, decision }),
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) => prev.map((r) => r.id === id ? updated : r));
        notify(decision === "approuvee" ? "Accès approuvé." : "Accès refusé.", decision === "approuvee" ? "success" : "warning");
      } else {
        notify("Erreur lors du traitement.", "error");
      }
    } finally {
      setUpdating(null);
    }
  };

  const togglePerm = (pid: string) =>
    setNewRolePerms((prev) => prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]);

  const createRole = async () => {
    if (!newRoleName.trim() || newRolePerms.length === 0) return;
    setUpdating("new-role");
    try {
      const res = await fetch("/api/acl/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newRoleName, description: newRoleDesc, permissions: newRolePerms }),
      });
      if (res.ok) {
        const role = await res.json();
        setRoles((prev) => [...prev, role]);
        setNewRoleName(""); setNewRoleDesc(""); setNewRolePerms([]);
        notify(`Rôle "${role.name}" créé.`, "success");
      } else {
        notify("Erreur lors de la création du rôle.", "error");
      }
    } finally {
      setUpdating(null);
    }
  };

  const deleteRole = async (id: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/acl/roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setRoles((prev) => prev.filter((r) => r.id !== id));
        notify("Rôle supprimé.", "info");
      } else {
        notify("Erreur lors de la suppression.", "error");
      }
    } finally {
      setUpdating(null);
    }
  };

  const permLabel = (id: string) => permissions.find((p) => p.id === id)?.label ?? id;
  const permGroups = Array.from(new Set(permissions.map((p) => p.group)));
  const pendingReq = requests.filter((r) => r.status === "en_attente");

  // Filtered publications
  const filteredPubs = publications
    .filter((p) => pubFilter === "all" || p.statut === pubFilter)
    .filter((p) =>
      !pubSearch ||
      p.titre.toLowerCase().includes(pubSearch.toLowerCase()) ||
      p.auteurs.join(", ").toLowerCase().includes(pubSearch.toLowerCase())
    );

  // Filtered users
  const filteredUsers = users
    .filter((u) => roleFilter === "all" || u.role === roleFilter)
    .filter((u) =>
      !userSearch ||
      u.nom.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

  const pending = publications.filter((p) => p.statut === "en_attente");

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-slate-400 text-sm">Chargement...</div>
    </div>
  );
  if (!isAuthenticated || user?.role !== "directeur") return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-900 pb-8 mb-8">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-900/30 flex items-center justify-center flex-none">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Administration</h1>
            <p className="text-xs text-slate-500">Espace réservé au Directeur — {user?.email}</p>
          </div>
          {pending.length > 0 && (
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-900/30 px-3 py-1 text-[10px] font-bold text-amber-400">
              {pending.length} en attente de validation
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total publications", value: publications.length, icon: BookOpen, color: "text-blue-400" },
            { label: "En attente", value: pending.length, icon: Activity, color: "text-amber-400" },
            { label: "Utilisateurs", value: users.length, icon: Users, color: "text-green-400" },
            { label: "Validées", value: publications.filter((p) => p.statut === "validee").length, icon: CheckCircle2, color: "text-purple-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-slate-900 bg-slate-900/10 p-4 text-center">
              <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTab("publications")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
              tab === "publications" ? "bg-blue-600/20 text-blue-400 border-blue-900/40" : "border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" /> Publications
            {pending.length > 0 && tab !== "publications" && (
              <span className="h-4 w-4 rounded-full bg-amber-500 text-[8px] font-bold text-slate-900 flex items-center justify-center">
                {pending.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
              tab === "users" ? "bg-blue-600/20 text-blue-400 border-blue-900/40" : "border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <Users className="h-3.5 w-3.5" /> Utilisateurs ({users.length})
          </button>
          <button
            onClick={() => setTab("acl")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
              tab === "acl" ? "bg-blue-600/20 text-blue-400 border-blue-900/40" : "border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" /> ACL &amp; Accès
            {pendingReq.length > 0 && tab !== "acl" && (
              <span className="h-4 w-4 rounded-full bg-amber-500 text-[8px] font-bold text-slate-900 flex items-center justify-center">
                {pendingReq.length}
              </span>
            )}
          </button>
        </div>

        {loading && <div className="text-center py-10 text-slate-500 text-xs">Chargement...</div>}

        {/* ── Publications ─────────────────────────────────────────── */}
        {!loading && tab === "publications" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou auteur..."
                  value={pubSearch}
                  onChange={(e) => setPubSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900/50 text-xs text-slate-200 pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="flex gap-1">
                {(["all", "en_attente", "validee", "rejetee"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setPubFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-all ${
                      pubFilter === f
                        ? "bg-blue-600/20 text-blue-400 border-blue-900/40"
                        : "border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {f === "all" ? "Toutes" : f.replace("_", " ")} {f !== "all" ? `(${publications.filter((p) => p.statut === f).length})` : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredPubs.map((pub) => (
                <div
                  key={pub.id}
                  className="rounded-xl border border-slate-900 bg-slate-900/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-slate-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${STATUS_STYLES[pub.statut]}`}>
                        {pub.statut.replace("_", " ")}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${ACCESS_STYLES[pub.accessLevel]}`}>
                        {pub.accessLevel}
                      </span>
                      <span className="text-[9px] text-slate-500">{AXES.find((a) => a.id === pub.axe)?.name}</span>
                      <span className="text-[9px] text-slate-500">{pub.datePublication}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">{pub.titre}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{pub.auteurs.join(", ")}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-none">
                    {/* View detail */}
                    <button
                      onClick={() => setSelectedPub(pub)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-[10px] font-semibold text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
                    >
                      <Eye className="h-3 w-3" /> Lire
                    </button>
                    {pub.statut === "en_attente" && (
                      <>
                        <button
                          onClick={() => validatePublication(pub.id, "validee")}
                          disabled={updating === pub.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-600/10 px-3 py-1.5 text-[10px] font-bold text-green-400 border border-green-900/30 hover:bg-green-600/20 disabled:opacity-50 transition-all"
                        >
                          <CheckCircle2 className="h-3 w-3" /> Valider
                        </button>
                        <button
                          onClick={() => validatePublication(pub.id, "rejetee")}
                          disabled={updating === pub.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600/10 px-3 py-1.5 text-[10px] font-bold text-red-400 border border-red-900/30 hover:bg-red-600/20 disabled:opacity-50 transition-all"
                        >
                          <XCircle className="h-3 w-3" /> Rejeter
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {filteredPubs.length === 0 && (
                <div className="rounded-xl border border-slate-900 border-dashed p-12 text-center text-slate-500 text-xs">
                  Aucune publication ne correspond aux filtres sélectionnés.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Users ──────────────────────────────────────────────── */}
        {!loading && tab === "users" && (
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Left: list */}
            <div className="lg:col-span-3 space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Nom ou email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/50 text-xs text-slate-200 pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div className="relative">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 pl-3 pr-8 py-2 focus:outline-none appearance-none"
                  >
                    <option value="all">Tous les rôles</option>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Users list */}
              <div className="space-y-2">
                {filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full text-left rounded-xl border p-4 flex items-center gap-3 transition-colors ${
                      selectedUser?.id === u.id
                        ? "border-blue-500/50 bg-blue-500/5"
                        : "border-slate-900 bg-slate-900/10 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex-none h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[11px] font-bold text-slate-400">
                      {u.nom.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-white truncate">{u.nom}</p>
                        {u.active === false && (
                          <span className="text-[8px] text-red-400 border border-red-900/30 bg-red-500/10 px-1.5 py-0.5 rounded font-bold uppercase">
                            Désactivé
                          </span>
                        )}
                        {u.id === user?.id && (
                          <span className="text-[8px] text-blue-400 border border-blue-900/30 bg-blue-500/10 px-1.5 py-0.5 rounded font-bold uppercase">
                            Vous
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded flex-none capitalize">
                      {u.role.replace("_", " ")}
                    </span>
                  </button>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="rounded-xl border border-slate-900 border-dashed p-10 text-center text-slate-500 text-xs">
                    Aucun utilisateur ne correspond aux filtres.
                  </div>
                )}
              </div>
            </div>

            {/* Right: detail panel */}
            <div className="lg:col-span-2">
              {selectedUser ? (
                <div className="sticky top-24">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fiche utilisateur</h3>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-slate-600 hover:text-slate-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <UserDetailPanel
                    u={selectedUser}
                    currentUserId={user?.id || ""}
                    onRoleChange={changeRole}
                    onToggleActive={toggleUserActive}
                    updating={updating}
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-slate-900 border-dashed h-48 flex flex-col items-center justify-center text-slate-600 gap-2">
                  <Info className="h-6 w-6" />
                  <p className="text-xs">Cliquez sur un utilisateur pour voir sa fiche</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ACL & Accès ──────────────────────────────────────────── */}
        {!loading && tab === "acl" && (
          <div className="space-y-10">
            {/* Explanation */}
            <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-5 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-400 flex-none mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Modèle <strong className="text-slate-200">ACL (Access Control List)</strong> : au lieu de rôles figés, le directeur compose des rôles à partir de{" "}
                <strong className="text-slate-200">permissions atomiques</strong> et répond aux demandes d&apos;accès. Approuver une demande accorde
                immédiatement la permission demandée au membre concerné.
              </p>
            </div>

            {/* A. Access requests queue */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Demandes d&apos;accès</h2>
                {pendingReq.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-900/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                    {pendingReq.length} en attente
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {[...requests]
                  .sort((a, b) => Number(a.status !== "en_attente") - Number(b.status !== "en_attente"))
                  .map((r) => {
                    const style = {
                      en_attente: { c: "text-amber-400 border-amber-900/30 bg-amber-500/10", l: "En attente" },
                      approuvee: { c: "text-green-400 border-green-900/30 bg-green-500/10", l: "Approuvée" },
                      refusee: { c: "text-red-400 border-red-900/30 bg-red-500/10", l: "Refusée" },
                    }[r.status];
                    return (
                      <div key={r.id} className="rounded-xl border border-slate-900 bg-slate-900/10 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${style.c}`}>
                                {style.l}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-white">
                              {r.userName} <span className="text-slate-500 font-normal">· {r.userEmail}</span>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Permission demandée : <span className="text-blue-400 font-semibold">{permLabel(r.permission)}</span>
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{r.resourceLabel}</p>
                            <p className="text-[11px] text-slate-400 mt-2 italic border-l-2 border-slate-800 pl-2">« {r.reason} »</p>
                            {r.status !== "en_attente" && r.decidedBy && (
                              <p className="text-[10px] text-slate-600 mt-2">
                                Traitée par {r.decidedBy}
                                {r.decidedAt ? ` le ${new Date(r.decidedAt).toLocaleDateString("fr-FR")}` : ""}
                              </p>
                            )}
                          </div>
                          {r.status === "en_attente" && (
                            <div className="flex gap-2 flex-none">
                              <button
                                onClick={() => decideRequest(r.id, "approuvee")}
                                disabled={updating === r.id}
                                className="inline-flex items-center gap-1 rounded-lg bg-green-600/10 px-3 py-1.5 text-[10px] font-bold text-green-400 border border-green-900/30 hover:bg-green-600/20 disabled:opacity-50 transition-all"
                              >
                                <Check className="h-3 w-3" /> Approuver
                              </button>
                              <button
                                onClick={() => decideRequest(r.id, "refusee")}
                                disabled={updating === r.id}
                                className="inline-flex items-center gap-1 rounded-lg bg-red-600/10 px-3 py-1.5 text-[10px] font-bold text-red-400 border border-red-900/30 hover:bg-red-600/20 disabled:opacity-50 transition-all"
                              >
                                <X className="h-3 w-3" /> Refuser
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {requests.length === 0 && (
                  <div className="rounded-xl border border-slate-900 border-dashed p-10 text-center text-slate-500 text-xs">
                    Aucune demande d&apos;accès pour le moment.
                  </div>
                )}
              </div>
            </section>

            {/* B. Role composer + existing roles */}
            <div className="grid gap-6 lg:grid-cols-2 items-start">
              {/* Composer */}
              <section className="rounded-xl border border-slate-900 bg-slate-900/10 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-green-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Composer un rôle</h2>
                </div>

                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Nom du rôle (ex : Doctorant avancé)"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50"
                />
                <input
                  type="text"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Description courte du rôle"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 px-3 py-2.5 focus:outline-none focus:border-blue-500/50"
                />

                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Permissions ({newRolePerms.length} sélectionnée(s))
                  </p>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1 rounded-lg border border-slate-900 bg-slate-950/40 p-3">
                    {permGroups.map((group) => (
                      <div key={group}>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{group}</p>
                        <div className="space-y-0.5">
                          {permissions.filter((p) => p.group === group).map((p) => (
                            <label key={p.id} className="flex items-start gap-2 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-900/40">
                              <input
                                type="checkbox"
                                checked={newRolePerms.includes(p.id)}
                                onChange={() => togglePerm(p.id)}
                                className="mt-0.5 accent-blue-500"
                              />
                              <span>
                                <span className="text-[11px] text-slate-200 font-medium block">{p.label}</span>
                                <span className="text-[10px] text-slate-500 block leading-snug">{p.description}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={createRole}
                  disabled={!newRoleName.trim() || newRolePerms.length === 0 || updating === "new-role"}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all"
                >
                  <Plus className="h-4 w-4" /> Créer le rôle
                </button>
              </section>

              {/* Existing roles */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-violet-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Rôles ({roles.length})</h2>
                </div>
                <div className="space-y-3 max-h-[42rem] overflow-y-auto pr-1">
                  {roles.map((role) => (
                    <div key={role.id} className="rounded-xl border border-slate-900 bg-slate-900/10 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-white">{role.name}</h3>
                            {role.system && (
                              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 border border-slate-700 bg-slate-800 px-1.5 py-0.5 rounded">
                                Système
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{role.description}</p>
                        </div>
                        {!role.system && (
                          <button
                            onClick={() => deleteRole(role.id)}
                            disabled={updating === role.id}
                            className="flex-none text-slate-600 hover:text-red-400 disabled:opacity-50 transition-colors"
                            aria-label="Supprimer le rôle"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {role.permissions.map((pid) => (
                          <span key={pid} className="text-[9px] bg-slate-800 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                            {permLabel(pid)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Publication detail modal */}
      {selectedPub && (
        <PublicationDetailModal
          pub={selectedPub}
          onClose={() => setSelectedPub(null)}
          onValidate={(id) => validatePublication(id, "validee")}
          onReject={(id) => validatePublication(id, "rejetee")}
          updating={updating}
          datasets={datasets}
        />
      )}

      <Footer />
    </div>
  );
}
