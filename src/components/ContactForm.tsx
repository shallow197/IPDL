"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useLang } from "@/context/LangContext";

export default function ContactForm() {
  const { t } = useLang();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, email, sujet, message }),
      });

      const body = await response.json();
      if (!response.ok) {
        setError(body?.error || t("contact.sendError"));
        setStatus("error");
        return;
      }

      setStatus("success");
      setNom("");
      setEmail("");
      setSujet("");
      setMessage("");
    } catch (err) {
      setError(t("contact.sendError"));
      setStatus("error");
    }
  };

  return (
    <section className="rounded-3xl border border-slate-900 bg-slate-900/40 p-8 shadow-xl shadow-slate-950/30">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm text-slate-400">
            {t("contact.name")}
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10"
              placeholder={t("contact.name")}
            />
          </label>

          <label className="block text-sm text-slate-400">
            {t("contact.email")}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10"
              placeholder={t("contact.emailPlaceholder")}
            />
          </label>
        </div>

        <label className="block text-sm text-slate-400">
          {t("contact.subject")}
          <input
            type="text"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10"
            placeholder={t("contact.subjectPlaceholder")}
          />
        </label>

        <label className="block text-sm text-slate-400">
          {t("contact.message")}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={8}
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10"
            placeholder={t("contact.messagePlaceholder")}
          />
        </label>

        {status === "error" && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-700/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            <AlertCircle className="h-4 w-4" />
            <span>{error || t("common.error")}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-700/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
            <CheckCircle className="h-4 w-4" />
            <span>{t("contact.success")}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {status === "sending" ? t("contact.loading") : t("contact.submit")}
        </button>
      </form>
    </section>
  );
}
