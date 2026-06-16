"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LangContext";

export default function ContactsPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-8 font-semibold">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à l'accueil</span>
        </Link>

        <div className="border-b border-slate-900 pb-8 mb-10">
          <span className="text-[10px] mono-text uppercase tracking-widest text-slate-500 font-bold block mb-2">
            {t("contact.heroTag")}
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            {t("contact.heroTitle")}
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-3xl">
            {t("contact.heroDescription")}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <ContactForm />

          <aside className="rounded-3xl border border-slate-900 bg-slate-900/40 p-8 space-y-6 text-sm text-slate-400">
            <div>
              <h2 className="text-lg font-bold text-white">{t("contact.asideTitle")}</h2>
              <p className="mt-3 leading-relaxed text-slate-300">
                {t("contact.asideDescription")}
              </p>
            </div>

            <div>
              <ul className="mt-4 space-y-3">
                <li>
                  <strong className="text-slate-200">{t("contact.asideTypeLabel")}</strong> {t("contact.asideTypeValue")}
                </li>
                <li>
                  <strong className="text-slate-200">{t("contact.asideEmailLabel")}</strong> {t("contact.asideEmailValue")}
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
