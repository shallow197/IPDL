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
    { href: "/",            icon: Home,        key: "nav.home" },
    { href: "/publications", icon: BookOpen,    key: "nav.publications" },
    { href: "/projets",     icon: FolderKanban, key: "nav.projets" },
    { href: "/equipe",      icon: Users,        key: "nav.equipe" },
    { href: "/actualites",  icon: Newspaper,    key: "nav.actualites" },
  ];

  const secondary = [
    { href: "/axes",        icon: Layers,    key: "nav.axes" },
    { href: "/datasets",    icon: Database,  key: "nav.datasets" },
    { href: "/simulations", icon: Play,      key: "nav.simulations" },
    { href: "/logiciels",   icon: Boxes,     key: "nav.logiciels" },
    { href: "/partenaires", icon: Handshake, key: "nav.partenaires" },
  ];

  const isSecondaryActive = secondary.some((l) => pathname === l.href);

  const linkClass = (active: boolean) =>
    `relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all ${
      active
        ? "text-ummisco-blue bg-blue-50 dark:bg-blue-950/30"
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"
    }`;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
          scrolled
            ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-sm"
            : "bg-white dark:bg-slate-950 border-slate-200/70 dark:border-slate-800/70"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5" aria-label="UMMISCO — Accueil">
            <BrandLogo height={34} withChip={false} animated />
            <div className="hidden sm:block leading-tight">
              <div className="text-[13px] font-black text-slate-900 dark:text-white tracking-tight">UMMISCO</div>
              <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">UMI 209 · IRD</div>
            </div>
          </Link>

          <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

          {/* Primary nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {primary.map(({ href, icon: Icon, key }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} className={linkClass(active)}>
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  {t(key)}
                  {active && (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-ummisco-blue rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((o) => !o)}
                className={linkClass(isSecondaryActive)}
              >
                <Boxes className="h-3.5 w-3.5 flex-shrink-0" />
                {t("nav.more")}
                <ChevronDown className={`h-3 w-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                {isSecondaryActive && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-ummisco-blue rounded-full" />
                )}
              </button>

              {moreOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1.5 z-50">
                  {secondary.map(({ href, icon: Icon, key }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                        pathname === href
                          ? "text-ummisco-blue bg-blue-50 dark:bg-blue-950/30"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
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

          {/* Right controls */}
          <div className="flex items-center gap-1.5 ml-auto">
            <NotificationBell />

            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="hidden sm:flex px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 uppercase tracking-widest transition-all"
              title={t("nav.langSwitch")}
            >
              {lang === "fr" ? "EN" : "FR"}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all"
              aria-label={t("nav.themeSwitch")}
            >
              {theme === "dark"
                ? <Sun className="h-4 w-4 text-amber-500" />
                : <Moon className="h-4 w-4 text-blue-500" />}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-1">
                {user.role === "directeur" && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all"
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
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
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

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-0.5">
            {[...primary, ...secondary].map(({ href, icon: Icon, key }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === href
                    ? "text-ummisco-blue bg-blue-50 dark:bg-blue-950/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {t(key)}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2 mt-2">
              <button
                onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                className="flex-1 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
              >
                {lang === "fr" ? "EN" : "FR"}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
              >
                {theme === "dark"
                  ? <Sun className="h-5 w-5 text-amber-500" />
                  : <Moon className="h-5 w-5 text-blue-500" />}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
