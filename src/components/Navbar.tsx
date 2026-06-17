"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "./BrandLogo";
import {
  Home, Layers, FolderKanban, BookOpen, Database,
  Play, Users, Handshake, Newspaper, Boxes,
  ChevronDown, Menu, X, Sun, Moon, Lock, LogOut,
  LayoutDashboard, Shield,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const { isAuthenticated, user, logout } = useAuth();
  const { notify } = useNotification();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMobileOpen(false); setMoreOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    notify(t("dashboard.goodbye"), "info");
    logout();
    router.push("/");
  };

  const primary = [
    { href: "/",             icon: Home,         key: "nav.home" },
    { href: "/publications", icon: BookOpen,     key: "nav.publications" },
    { href: "/projets",      icon: FolderKanban, key: "nav.projets" },
    { href: "/equipe",       icon: Users,        key: "nav.equipe" },
    { href: "/actualites",   icon: Newspaper,    key: "nav.actualites" },
  ];

  const secondary = [
    { href: "/axes",        icon: Layers,    key: "nav.axes" },
    { href: "/datasets",    icon: Database,  key: "nav.datasets" },
    { href: "/simulations", icon: Play,      key: "nav.simulations" },
    { href: "/logiciels",   icon: Boxes,     key: "nav.logiciels" },
    { href: "/partenaires", icon: Handshake, key: "nav.partenaires" },
  ];

  const isSecondaryActive = secondary.some((l) => pathname === l.href);

  // CORRECTIONS :
  // dark inactif : text-slate-400 → text-slate-200  (contraste WCAG AA sur bg-slate-950)
  // dark hover   : hover:text-slate-200 → hover:text-white
  // light inactif: text-slate-700 → text-slate-600  (légèrement plus doux, reste très lisible)
  // light hover  : hover:text-black → hover:text-gray-900
  const linkCls = (active: boolean) =>
    `relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all ${
      active
        ? (theme === "dark"
            ? "text-ummisco-blue bg-blue-500/20"
            : "text-ummisco-blue bg-blue-50")
        : (theme === "dark"
            ? "text-slate-200 hover:text-white hover:bg-slate-800"
            : "text-slate-400 hover:text-slate-100 hover:bg-slate-900")
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        theme === "dark" ? "bg-slate-950" : "bg-[#ffffff]"
      } ${
        scrolled
          ? (theme === "dark" ? "shadow-lg shadow-black/40 border-b border-slate-800" : "shadow-md border-b border-slate-200")
          : (theme === "dark" ? "shadow-sm border-b border-slate-900" : "shadow-sm border-b border-slate-100")
      }`}
    >
      {/* Barre de couleur en haut */}
      <div className="h-0.5 w-full bg-gradient-to-r from-ummisco-blue via-blue-400 to-green-400" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[5rem] flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2.5" aria-label="UMMISCO — Accueil">
          <BrandLogo height={52} withChip animated />
          <div className="hidden sm:block leading-tight">
            <div className={`text-[13px] font-black tracking-tight ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>UMMISCO</div>
            {/* dark: text-slate-500 → text-slate-400 */}
            <div className={`text-[9px] font-bold tracking-widest uppercase ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}>UMI 209 · IRD</div>
          </div>
        </Link>

        {/* Séparateur : bg-slate-200 fixe → adapté au thème */}
        <div className={`hidden md:block h-6 w-px flex-shrink-0 ${
          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
        }`} />

        {/* Liens primaires */}
        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {primary.map(({ href, icon: Icon, key }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={linkCls(active)}>
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                {t(key)}
                {active && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-ummisco-blue rounded-full" />
                )}
              </Link>
            );
          })}

          {/* Dropdown Plus */}
          <div className="relative" ref={moreRef}>
            <button onClick={() => setMoreOpen((o) => !o)} className={linkCls(isSecondaryActive)}>
              <Boxes className="h-3.5 w-3.5 flex-shrink-0" />
              {t("nav.more")}
              <ChevronDown className={`h-3 w-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              {isSecondaryActive && (
                <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-ummisco-blue rounded-full" />
              )}
            </button>

            {moreOpen && (
              // dark border-slate-800 → border-slate-700 (plus visible)
              <div className={`absolute top-full left-0 mt-2 w-52 rounded-xl shadow-xl py-1.5 z-50 border ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-700"
                  : "bg-[#ffffff] border-slate-800"
              }`}>
                {secondary.map(({ href, icon: Icon, key }) => (
                  <Link
                    key={href}
                    href={href}
                    // dark inactif: text-slate-400 → text-slate-200 ; hover: text-white
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                      pathname === href
                        ? (theme === "dark"
                            ? "text-ummisco-blue bg-blue-500/20"
                            : "text-ummisco-blue bg-blue-50")
                        : (theme === "dark"
                            ? "text-slate-200 hover:text-white hover:bg-slate-800"
                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-900")
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {t(key)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contrôles droite */}
        <div className="flex items-center gap-1.5 ml-auto">
          <NotificationBell />

          {/* Bouton langue — dark: text-slate-500 → text-slate-300 ; hover: text-white */}
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className={`hidden sm:flex px-2.5 py-1 rounded-md border text-[11px] font-bold uppercase tracking-widest transition-all ${
              theme === "dark"
                ? "border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800"
                : "border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 hover:bg-slate-900"
            }`}
            title={t("nav.langSwitch")}
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>

          {/* Bouton thème — icônes déjà colorées, on améliore juste le conteneur */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all ${
              theme === "dark"
                ? "border-slate-700 hover:bg-slate-800"
                : "border-slate-800 hover:bg-slate-900"
            }`}
            aria-label={t("nav.themeSwitch")}
          >
            {theme === "dark"
              ? <Sun className="h-4 w-4 text-amber-400" />
              : <Moon className="h-4 w-4 text-slate-500" />}
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-1">
              {user.role === "directeur" && (
                // dark: text-slate-500 → text-slate-300 ; hover: text-white
                <Link
                  href="/admin"
                  className={`hidden sm:flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                    theme === "dark"
                      ? "border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500"
                      : "border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  {t("nav.admin")}
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg bg-ummisco-blue px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("dashboard.profile")}</span>
              </Link>
              {/* dark: text-slate-500 → text-slate-300 ; hover rouge plus visible */}
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg border transition-all ${
                  theme === "dark"
                    ? "border-slate-700 text-slate-300 hover:text-red-300 hover:bg-red-900/20 hover:border-red-800"
                    : "border-slate-800 text-slate-400 hover:text-red-600 hover:bg-red-500/10"
                }`}
                title={t("nav.logout")}
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/connexion"
              className="flex items-center gap-1.5 rounded-lg bg-ummisco-blue px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
            >
              <Lock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("nav.login")}</span>
            </Link>
          )}

          {/* Hamburger — dark: text-slate-500 → text-slate-200 ; hover: text-white */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={`md:hidden p-2 rounded-lg border transition-all ${
              theme === "dark"
                ? "border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800"
                : "border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900"
            }`}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className={`md:hidden border-t px-4 py-3 space-y-0.5 ${
          theme === "dark"
            ? "border-slate-800 bg-slate-950"
            : "border-slate-100 bg-[#ffffff]"
        }`}>
          {[...primary, ...secondary].map(({ href, icon: Icon, key }) => (
            <Link
              key={href}
              href={href}
              // dark inactif: text-slate-400 → text-slate-200 ; hover: text-white
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                pathname === href
                  ? (theme === "dark"
                      ? "text-ummisco-blue bg-blue-500/20"
                      : "text-ummisco-blue bg-blue-50")
                  : (theme === "dark"
                      ? "text-slate-200 hover:text-white hover:bg-slate-800"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900")
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {t(key)}
            </Link>
          ))}

          {/* Séparateur bas du drawer — border fixe border-slate-100 → adapté au thème */}
          <div className={`pt-3 border-t flex gap-2 mt-2 ${
            theme === "dark" ? "border-slate-800" : "border-slate-100"
          }`}>
            {/* dark: text-slate-500 → text-slate-300 */}
            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className={`flex-1 py-2 rounded-md border text-sm font-bold uppercase tracking-widest transition-all ${
                theme === "dark"
                  ? "border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                  : "border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900"
              }`}
            >
              {lang === "fr" ? "EN" : "FR"}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg border transition-all ${
                theme === "dark"
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-slate-800 hover:bg-slate-900"
              }`}
            >
              {theme === "dark"
                ? <Sun className="h-5 w-5 text-amber-400" />
                : <Moon className="h-5 w-5 text-slate-500" />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}