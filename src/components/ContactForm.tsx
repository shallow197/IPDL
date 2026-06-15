"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("Recommandation");
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
        setError(body?.error || "Une erreur est survenue.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setNom("");
      setEmail("");
      setSujet("Recommandation");
      setMessage("");
    } catch (err) {
      setError("Impossible d'envoyer le message. Réessayez plus tard.");
      setStatus("error");
    }
  };

  return (
    <section className="rounded-3xl border border-slate-900 bg-slate-900/40 p-8 shadow-xl shadow-slate-950/30">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm text-slate-400">
            Nom complet
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10"
              placeholder="Votre nom"
            />
          </label>

          <label className="block text-sm text-slate-400">
            Adresse e-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10"
              placeholder="prenom@exemple.com"
            />
          </label>
        </div>

        <label className="block text-sm text-slate-400">
          Objet
          <input
            type="text"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10"
            placeholder="Sujet de votre recommandation"
          />
        </label>

        <label className="block text-sm text-slate-400">
          Message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={8}
            className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10"
            placeholder="Décrivez votre recommandation ou votre demande..."
          />
        </label>

        {status === "error" && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-700/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            <AlertCircle className="h-4 w-4" />
            <span>{error || "Une erreur est survenue."}</span>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-700/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
            <CheckCircle className="h-4 w-4" />
            <span>Message envoyé avec succès. Merci pour votre recommandation.</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-blue-500 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {status === "sending" ? "Envoi..." : "Envoyer ma recommandation"}
        </button>
      </form>
    </section>
  );
}
