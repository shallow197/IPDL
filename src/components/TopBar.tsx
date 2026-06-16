"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Moon, Lock, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import { useNotification } from "@/context/NotificationContext";

export default function TopBar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const { isAuthenticated, user, logout } = useAuth();
  const { notify } = useNotification();

  const handleLogout = () => { notify("À bientôt !", "info"); logout(); router.push("/"); };

  return (
    <div className="sticky top-0 z-40 flex items-center justify-end gap-2 px-4 h-12 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <NotificationBell />

      <button
        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
        className="px-2.5 py-1 rounded-md border border-slate-800 text-[11px] font-bold text-slate-400 hover:text-slate-200 uppercase tracking-widest transition-all"
        title={t("nav.langSwitch")}
      >
        {lang === "fr" ? "EN" : "FR"}
      </button>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all"
        aria-label={t("nav.themeSwitch")}
      >
        {theme === "dark"
          ? <Sun  className="h-3.5 w-3.5 text-amber-500" />
          : <Moon className="h-3.5 w-3.5 text-blue-500" />}
      </button>

      {isAuthenticated && user ? (
        <div className="flex items-center gap-1.5">
          {user.role === "directeur" && (
            <Link href="/admin"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>{t("nav.admin")}</span>
            </Link>
          )}
          <Link href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg bg-ummisco-blue px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-90 transition-all"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>{t("dashboard.profile")}</span>
          </Link>
          <button onClick={handleLogout}
            className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-900/10 transition-all"
            title={t("nav.logout")}
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <Link href="/connexion"
          className="flex items-center gap-1.5 rounded-lg bg-ummisco-blue px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-90 transition-all"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>{t("nav.login")}</span>
        </Link>
      )}
    </div>
  );
}
