"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mail, Copy, Check, ExternalLink } from "lucide-react";

interface ContactButtonProps {
  email: string;
  /** Nom du destinataire — utilisé pour personnaliser le corps du message. */
  name?: string;
  subject?: string;
  body?: string;
  /** Texte du bouton déclencheur (par défaut "Contact"). */
  label?: string;
  /** Classes appliquées au bouton déclencheur, pour coller au style de chaque page. */
  className?: string;
  /** Icône à gauche du label (true par défaut). */
  withIcon?: boolean;
}

/**
 * Bouton de contact qui ne dépend PAS du client mail du système.
 * Au clic, ouvre un petit menu : Gmail / Outlook (compose web), client mail
 * classique (mailto), et copie de l'adresse. Fonctionne donc même quand aucun
 * logiciel de messagerie n'est configuré sur la machine.
 */
export default function ContactButton({
  email,
  name,
  subject,
  body,
  label = "Contact",
  className,
  withIcon = true,
}: ContactButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const subj = subject ?? "Contact UMMISCO";
  const bod = body ?? `Bonjour${name ? " " + name : ""},\n\n`;
  const enc = encodeURIComponent;

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(email)}&su=${enc(subj)}&body=${enc(bod)}`;
  const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${enc(email)}&subject=${enc(subj)}&body=${enc(bod)}`;
  const mailtoUrl = `mailto:${email}?subject=${enc(subj)}&body=${enc(bod)}`;

  // Fermeture au clic extérieur
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard indisponible — non bloquant */
    }
  };

  const itemClass =
    "flex items-center gap-2 w-full px-3 py-2 rounded-md text-[13px] text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left";

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={className}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {withIcon && <Mail className="h-3 w-3" />} {label}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 bottom-full mb-2 z-50 w-60 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-1.5"
        >
          <div className="px-3 py-2 mb-1 border-b border-slate-800">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Écrire à</p>
            <p className="text-[12px] text-slate-300 font-mono truncate">{email}</p>
          </div>

          <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className={itemClass} onClick={() => setOpen(false)}>
            <ExternalLink className="h-3.5 w-3.5 text-red-400 flex-none" /> Gmail
          </a>
          <a href={outlookUrl} target="_blank" rel="noopener noreferrer" className={itemClass} onClick={() => setOpen(false)}>
            <ExternalLink className="h-3.5 w-3.5 text-blue-400 flex-none" /> Outlook (web)
          </a>
          <a href={mailtoUrl} className={itemClass} onClick={() => setOpen(false)}>
            <Mail className="h-3.5 w-3.5 text-slate-400 flex-none" /> Application mail
          </a>

          <div className="my-1 border-t border-slate-800" />

          <button type="button" onClick={copyEmail} className={itemClass}>
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-400 flex-none" /> Adresse copiée !
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400 flex-none" /> Copier l'adresse
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
