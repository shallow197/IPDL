"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "./BrandLogo";
import {
  Home, Layers, FolderKanban, BookOpen, Database,
  Play, Users, Handshake, Newspaper,
  ChevronLeft, ChevronRight, Menu, X,
  Lock, Sun, Moon, LogOut, LayoutDashboard, Shield,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { theme, toggleTheme }  = useTheme();
  const { lang, setLang, t }    = useLang();
  const { isAuthenticated, user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Communicate sidebar width to the rest of the layout via data attribute
  useEffect(() => {
    document.body.setAttribute("data-sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { label: t("nav.home"),        href: "/",            icon: Home },
    { label: t("nav.axes"),        href: "/axes",         icon: Layers },
    { label: "Projets",             href: "/projets",      icon: FolderKanban },
    { label: t("nav.publications"),href: "/publications", icon: BookOpen },
    { label: t("nav.datasets"),    href: "/datasets",     icon: Database },
    { label: t("nav.simulations"), href: "/simulations",  icon: Play },
    { label: t("nav.equipe"),      href: "/equipe",       icon: Users },
    { label: t("nav.partenaires"), href: "/partenaires",  icon: Handshake },
    { label: t("nav.actualites"),  href: "/actualites",   icon: Newspaper },
  ];

  const handleLogout = () => { logout(); router.push("/"); };

  /* ── Shared link renderer ── */
  const NavLink = ({ label, href, icon: Icon }: typeof navLinks[0]) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        title={collapsed ? label : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
          isActive
            ? "bg-ummisco-blue/15 text-white border-l-2 border-ummisco-blue"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
        } ${collapsed ? "justify-center" : ""}`}
      >
        <Icon className={`h-4 w-4 flex-none ${isActive ? "text-ummisco-blue-light" : ""}`} />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen z-50 border-r border-slate-900 bg-slate-950 transition-all duration-300 overflow-hidden ${
          collapsed ? "w-[68px]" : "w-[220px]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center px-3 py-4 border-b border-slate-900">
          <Link href="/" aria-label="UMMISCO — Accueil">
            <span className="logo-glow inline-flex">
              <BrandLogo height={collapsed ? 52 : 140} withChip={false} animated />
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navLinks.map((link) => <NavLink key={link.href} {...link} />)}
        </nav>

        {/* Bottom — collapse toggle only (lang/thème/connexion sont dans la TopBar) */}
        <div className="border-t border-slate-900 p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
            title={collapsed ? "Étendre la barre" : "Réduire la barre"}
          >
            {collapsed
              ? <ChevronRight className="h-4 w-4" />
              : <><ChevronLeft className="h-4 w-4" /><span className="text-[13px] font-bold">Réduire</span></>}
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/90 backdrop-blur-md flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <BrandLogo height={32} animated />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/98 pt-16 px-4 py-4 overflow-y-auto space-y-1">
          {navLinks.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold transition-colors ${
                pathname === href
                  ? "text-white bg-slate-900 border-l-4 border-ummisco-blue"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-900 space-y-2">
            <div className="flex gap-2">
              <button onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                className="flex-1 py-2 rounded-md border border-slate-800 text-sm font-bold text-slate-400 uppercase"
              >
                {lang === "fr" ? "EN" : "FR"}
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-lg border border-slate-800 text-slate-400">
                {theme === "dark"
                  ? <Sun  className="h-5 w-5 text-amber-500" />
                  : <Moon className="h-5 w-5 text-blue-500" />}
              </button>
            </div>

            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-ummisco-blue py-2.5 text-base font-semibold text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{t("dashboard.title")}</span>
                </Link>
                <button onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-800 py-2.5 text-base font-semibold text-slate-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("nav.logout")}</span>
                </button>
              </>
            ) : (
              <Link href="/connexion"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ummisco-blue py-2.5 text-base font-semibold text-white"
              >
                <Lock className="h-4 w-4" />
                <span>{t("nav.login")}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
