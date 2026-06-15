"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X, CheckCircle2, XCircle, ExternalLink, Download,
  Clipboard, Check, ChevronDown, ChevronUp, Tag,
  BookOpen, Calendar, Hash, Database, FileText
} from "lucide-react";
import type { DBPublication } from "@/lib/db";
import { AXES } from "@/data/ummiscoData";
import { useNotification } from "@/context/NotificationContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PublicationCardProps {
  pub: DBPublication;
  /** name → /chercheurs/[id] */
  authorLinks?: Record<string, string>;
  /** id → titre */
  datasetTitles?: Record<string, string>;
  /** Show status badge + validate/reject controls */
  isAdmin?: boolean;
  onValidate?: (id: string) => void;
  onReject?: (id: string) => void;
  updating?: boolean;
  /** Called when the ✕ button is clicked (modal mode) */
  onClose?: () => void;
}

const AXE_COLORS: Record<string, string> = {
  epidemiology:    "bg-blue-500/10   text-blue-400   border-blue-900/30",
  iot:             "bg-green-500/10  text-green-400  border-green-900/30",
  "citizen-science":"bg-purple-500/10 text-purple-400 border-purple-900/30",
  environment:     "bg-amber-500/10  text-amber-400  border-amber-900/30",
  fablab:          "bg-red-500/10    text-red-400    border-red-900/30",
};

const STATUS_STYLES: Record<string, string> = {
  validee:    "text-green-400 border-green-900/30 bg-green-500/10",
  en_attente: "text-amber-400 border-amber-900/30 bg-amber-500/10",
  rejetee:    "text-red-400   border-red-900/30   bg-red-500/10",
};

const ACCESS_STYLES: Record<string, string> = {
  public:    "text-green-400 border-green-900/30 bg-green-500/10",
  protected: "text-blue-400  border-blue-900/30  bg-blue-500/10",
  private:   "text-red-400   border-red-900/30   bg-red-500/10",
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function PublicationCard({
  pub,
  authorLinks = {},
  datasetTitles = {},
  isAdmin = false,
  onValidate,
  onReject,
  updating = false,
  onClose,
}: PublicationCardProps) {
  const [citationOpen, setCitationOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const { notify } = useNotification();

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
    notify("Citation copiée !", "success");
  };

  const axe = AXES.find((a) => a.id === pub.axe);

  const hasPublicationDetails =
    pub.journal || pub.volume || pub.numero || pub.pages || pub.doi;

  return (
    <div className="flex flex-col gap-5 text-slate-100">

      {/* ── Header badges ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {axe && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${AXE_COLORS[pub.axe] ?? "text-slate-400 border-slate-700 bg-slate-800"}`}>
              <Tag className="h-2.5 w-2.5" /> {axe.name}
            </span>
          )}
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${ACCESS_STYLES[pub.accessLevel]}`}>
            {pub.accessLevel}
          </span>
          {isAdmin && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${STATUS_STYLES[pub.statut]}`}>
              {pub.statut.replace("_", " ")}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors flex-none"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Title ──────────────────────────────────────────────────── */}
      <h2 className="text-lg font-extrabold text-white leading-snug">
        {pub.titre}
      </h2>

      {/* ── Authors ────────────────────────────────────────────────── */}
      <div>
        <Label>Auteurs</Label>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
          {pub.auteurs.map((nom, i) => {
            const href = authorLinks[nom];
            return href ? (
              <Link
                key={i}
                href={href}
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
              >
                {nom}
              </Link>
            ) : (
              <span key={i} className="text-xs text-slate-300 font-medium">{nom}</span>
            );
          })}
        </div>
      </div>

      {/* ── Publication details ─────────────────────────────────────── */}
      {hasPublicationDetails && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {pub.journal && (
            <Row icon={<BookOpen className="h-3.5 w-3.5 flex-none" />} label="Revue / Conférence">
              <span className="italic">{pub.journal}</span>
            </Row>
          )}
          {pub.annee && (
            <Row icon={<Calendar className="h-3.5 w-3.5 flex-none" />} label="Année">
              {pub.annee}
            </Row>
          )}
          {(pub.volume || pub.numero || pub.pages) && (
            <Row icon={<Hash className="h-3.5 w-3.5 flex-none" />} label="Vol. / N° / Pages">
              {[
                pub.volume && `Vol. ${pub.volume}`,
                pub.numero && `N° ${pub.numero}`,
                pub.pages && `p. ${pub.pages}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </Row>
          )}
          {pub.doi && (
            <Row icon={<ExternalLink className="h-3.5 w-3.5 flex-none" />} label="DOI">
              <a
                href={`https://doi.org/${pub.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline font-mono break-all"
              >
                {pub.doi}
              </a>
            </Row>
          )}
        </div>
      )}

      {/* ── Abstract ───────────────────────────────────────────────── */}
      <div>
        <Label>Résumé</Label>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed font-serif whitespace-pre-wrap">
          {pub.resume}
        </p>
      </div>

      {/* ── Keywords ───────────────────────────────────────────────── */}
      {pub.motsClefs?.length > 0 && (
        <div>
          <Label>Mots-clefs</Label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pub.motsClefs.map((k) => (
              <span
                key={k}
                className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Linked datasets ────────────────────────────────────────── */}
      {pub.datasetsLies?.length > 0 && (
        <div>
          <Label>Datasets associés</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {pub.datasetsLies.map((dsId) => (
              <Link
                key={dsId}
                href="/datasets"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-[10px] font-semibold text-slate-300 hover:text-blue-400 hover:border-blue-900/40 transition-colors"
              >
                <Database className="h-3 w-3 flex-none" />
                {datasetTitles[dsId] ?? dsId}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Actions row ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800">
        {pub.fichierPdf && (
          <a
            href={pub.fichierPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-[10px] font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Télécharger PDF
          </a>
        )}
        {pub.googleScholarUrl && (
          <a
            href={pub.googleScholarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-[10px] font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Google Scholar
          </a>
        )}
      </div>

      {/* ── Citation accordion ─────────────────────────────────────── */}
      {(pub.citationApa || pub.citationBibtex) && (
        <div className="rounded-xl border border-slate-800">
          <button
            onClick={() => setCitationOpen(!citationOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Citer cette publication
            </span>
            {citationOpen
              ? <ChevronUp className="h-4 w-4" />
              : <ChevronDown className="h-4 w-4" />
            }
          </button>

          {citationOpen && (
            <div className="px-4 pb-4 space-y-4 border-t border-slate-800 pt-4">
              {pub.citationApa && (
                <CitationBlock
                  label="APA"
                  text={pub.citationApa}
                  copyKey="apa"
                  copied={copied}
                  onCopy={copy}
                />
              )}
              {pub.citationBibtex && (
                <CitationBlock
                  label="BibTeX"
                  text={pub.citationBibtex}
                  copyKey="bibtex"
                  copied={copied}
                  onCopy={copy}
                  mono
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Admin actions ──────────────────────────────────────────── */}
      {isAdmin && pub.statut === "en_attente" && onValidate && onReject && (
        <div className="flex gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={() => onValidate(pub.id)}
            disabled={updating}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600/10 px-4 py-2.5 text-xs font-bold text-green-400 border border-green-900/30 hover:bg-green-600/20 disabled:opacity-50 transition-all"
          >
            <CheckCircle2 className="h-4 w-4" /> Valider la publication
          </button>
          <button
            onClick={() => onReject(pub.id)}
            disabled={updating}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600/10 px-4 py-2.5 text-xs font-bold text-red-400 border border-red-900/30 hover:bg-red-600/20 disabled:opacity-50 transition-all"
          >
            <XCircle className="h-4 w-4" /> Rejeter
          </button>
        </div>
      )}
      {isAdmin && pub.statut !== "en_attente" && (
        <p className="text-center text-[10px] text-slate-600 italic border-t border-slate-800 pt-3">
          Publication déjà traitée — statut : <strong>{pub.statut.replace("_", " ")}</strong>
        </p>
      )}
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
      {children}
    </span>
  );
}

function Row({
  icon, label, children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-slate-500 mt-0.5">{icon}</span>
      <div>
        <span className="text-slate-500">{label} : </span>
        <span className="text-slate-200">{children}</span>
      </div>
    </div>
  );
}

function CitationBlock({
  label, text, copyKey, copied, onCopy, mono = false,
}: {
  label: string;
  text: string;
  copyKey: string;
  copied: string | null;
  onCopy: (t: string, k: string) => void;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <button
          onClick={() => onCopy(text, copyKey)}
          className="flex items-center gap-1 text-[9px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          {copied === copyKey
            ? <><Check className="h-3 w-3 text-green-500" /> Copié</>
            : <><Clipboard className="h-3 w-3" /> Copier</>
          }
        </button>
      </div>
      {mono ? (
        <pre className="text-[10px] text-slate-300 font-mono leading-relaxed bg-slate-950/60 border border-slate-800 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
          {text}
        </pre>
      ) : (
        <div className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800 rounded-lg p-3">
          {text}
        </div>
      )}
    </div>
  );
}
