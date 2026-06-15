"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "./BrandLogo";
import { Menu, X, Lock, Sun, Moon, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.axes"), href: "/axes" },
    { label: "Projets", href: "/projets" },
    { label: t("nav.publications"), href: "/publications" },
    { label: t("nav.datasets"), href: "/datasets" },
    { label: t("nav.simulations"), href: "/simulations" },
    { label: t("nav.equipe"), href: "/equipe" },
    { label: t("nav.partenaires"), href: "/partenaires" },
    { label: t("nav.actualites"), href: "/actualites" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      {/* Decorative blue→green brand accent line */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-green-500/50" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 text-slate-100 hover:text-white flex-none" aria-label="UMMISCO — Accueil">
          <BrandLogo height={60} animated />
          <div className="hidden lg:flex flex-col border-l border-slate-800 pl-2.5">
            <span className="text-[13px] font-bold tracking-wide text-slate-100 leading-tight">
              Systèmes Complexes
            </span>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest leading-none">
              UMI 209 · IRD–Sorbonne
            </span>
          </div>
        </Link>

        {/* Desktop nav — scrollable on medium screens */}
        <nav className="hidden md:flex items-center gap-0.5 mx-4 overflow-x-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-[14px] font-semibold uppercase tracking-wider rounded-md whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "text-white bg-slate-900/80"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-ummisco-blue rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-2 flex-none">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="px-2.5 py-1.5 rounded-md border border-slate-800 bg-slate-950 text-[13px] font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 tracking-widest uppercase transition-all"
            aria-label="Changer la langue"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-900 bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 active:scale-95 transition-all"
            aria-label="Basculer le thème"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-blue-500" />
            )}
          </button>

          {/* Auth actions */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {(user.role === "directeur") && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-[13px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all"
                >
                  <Shield className="h-3 w-3" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg bg-ummisco-blue px-3 py-2 text-[13px] font-semibold uppercase tracking-wider text-white shadow-md hover:bg-ummisco-blue/90 transition-all"
              >
                <LayoutDashboard className="h-3 w-3" />
                <span>{user.nom.split(" ")[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg border border-slate-900 text-slate-500 hover:text-red-400 hover:bg-red-900/10 transition-all"
                aria-label="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/connexion"
              className="inline-flex items-center gap-1.5 rounded-lg bg-ummisco-blue px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow-md hover:bg-ummisco-blue/90 transition-all border border-transparent active:scale-95"
            >
              <Lock className="h-3 w-3" />
              <span>{t("nav.login")}</span>
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="px-2 py-1 rounded border border-slate-800 text-[13px] font-bold text-slate-400 uppercase"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-blue-500" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 py-4 space-y-1 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-base font-medium uppercase tracking-wider rounded-md transition-colors ${
                pathname === link.href
                  ? "text-white bg-slate-900 border-l-4 border-ummisco-blue"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-900 space-y-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-ummisco-blue py-2.5 text-base font-semibold uppercase tracking-wider text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{t("dashboard.title")}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-800 py-2.5 text-base font-semibold uppercase tracking-wider text-slate-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("nav.logout")}</span>
                </button>
              </>
            ) : (
              <Link
                href="/connexion"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ummisco-blue py-2.5 text-base font-semibold uppercase tracking-wider text-white"
              >
                <Lock className="h-4 w-4" />
                <span>{t("nav.login")}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
