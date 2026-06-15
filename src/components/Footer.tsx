"use client";

import React from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { Mail, MapPin, Globe } from "lucide-react";
import { useLang } from "@/context/LangContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative border-t border-slate-900 bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative blue→green brand accent line */}
      <div aria-hidden className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500/60 via-blue-400/30 to-green-500/60" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <BrandLogo height={36} />
            </div>
            <p className="text-sm leading-relaxed text-slate-500">{t("footer.brandDesc")}</p>
          </div>

          {/* Research axes links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4 border-l-2 border-ummisco-blue pl-2">
              {t("footer.axesTitle")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/axes" className="hover:text-slate-200 transition-colors">{t("footer.axesLink1")}</Link>
              </li>
              <li>
                <Link href="/axes" className="hover:text-slate-200 transition-colors">{t("footer.axesLink2")}</Link>
              </li>
              <li>
                <Link href="/axes" className="hover:text-slate-200 transition-colors">{t("footer.axesLink3")}</Link>
              </li>
              <li>
                <Link href="/axes" className="hover:text-slate-200 transition-colors">{t("footer.axesLink4")}</Link>
              </li>
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4 border-l-2 border-ummisco-blue pl-2">
              {t("footer.resourcesTitle")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/publications" className="hover:text-slate-200 transition-colors">{t("footer.resourcesPublications")}</Link>
              </li>
              <li>
                <Link href="/datasets" className="hover:text-slate-200 transition-colors">{t("footer.resourcesDatasets")}</Link>
              </li>
              <li>
                <Link href="/equipe" className="hover:text-slate-200 transition-colors">{t("footer.resourcesTeam")}</Link>
              </li>
              <li>
                <Link href="/#centres" className="hover:text-slate-200 transition-colors">{t("footer.resourcesCenters")}</Link>
              </li>
              <li>
                <Link href="/presse" className="hover:text-slate-200 transition-colors">{t("footer.resourcesPress")}</Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-slate-200 transition-colors">{t("footer.resourcesContact")}</Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-slate-200 transition-colors">{t("footer.resourcesLogin")}</Link>
              </li>
            </ul>
          </div>

          {/* Contacts & Locations */}
          <div className="space-y-3 text-sm text-slate-500">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4 border-l-2 border-ummisco-blue pl-2">
              {t("footer.contactsTitle")}
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-600 flex-none mt-0.5" />
              <span>{t("footer.contactsEsp")}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-600 flex-none mt-0.5" />
              <span>{t("footer.contactsHann")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-600 flex-none" />
              <span>{t("footer.contactsEmail")}</span>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-[13px] text-slate-600 gap-4">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} UMMISCO UMI 209 — {t("footer.copyRight")}</span>
            <span>·</span>
            <span>{t("footer.hostInfo")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            <span>{t("footer.hostInfo")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
