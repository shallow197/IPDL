"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, ExternalLink, Loader2 } from "lucide-react";
import type { DBSignature } from "@/lib/db";

interface Props {
  targetId: string;
  /** Signature fraîchement créée (optimistic update sans re-fetch). */
  freshSignature?: { id: string; signerName: string; timestamp: string };
  compact?: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SignatureBadge({ targetId, freshSignature, compact = false }: Props) {
  const [sigs, setSigs] = useState<DBSignature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetId) return;
    fetch(`/api/signatures/target/${encodeURIComponent(targetId)}`)
      .then((r) => r.json())
      .then((data) => setSigs(Array.isArray(data) ? data : []))
      .catch(() => setSigs([]))
      .finally(() => setLoading(false));
  }, [targetId]);

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-slate-600">
        <Loader2 className="h-3 w-3 animate-spin" />
      </span>
    );
  }

  // Fusion avec la signature fraîche (optimistic UI)
  const allSigs = freshSignature
    ? [
        {
          id: freshSignature.id,
          signerName: freshSignature.signerName,
          timestamp: freshSignature.timestamp,
        } as DBSignature,
        ...sigs.filter((s) => s.id !== freshSignature.id),
      ]
    : sigs;

  if (allSigs.length === 0) return null;

  const latest = allSigs[0];

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-green-700/40 bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
        <ShieldCheck className="h-3 w-3" />
        Signé
      </span>
    );
  }

  return (
    <div className="rounded-xl border border-green-700/30 bg-green-500/5 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-green-400 flex-none" />
        <span className="text-xs font-bold text-green-400">
          {allSigs.length === 1 ? "Document signé" : `${allSigs.length} signatures`}
        </span>
      </div>

      <div className="space-y-1.5">
        {allSigs.slice(0, 3).map((sig) => (
          <div key={sig.id} className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 flex-none" />
              <span className="text-slate-300 font-semibold">{sig.signerName}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">{formatDate(sig.timestamp)}</span>
            </div>
            <a
              href={`/api/signatures/verify/${sig.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-green-400 transition-colors flex-none"
              title="Vérifier la signature"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ))}
        {allSigs.length > 3 && (
          <p className="text-[10px] text-slate-600">
            +{allSigs.length - 3} autre(s)
          </p>
        )}
      </div>

      {/* Empreinte courte de la dernière signature */}
      <p className="text-[9px] font-mono text-slate-700 break-all leading-relaxed">
        {latest.signatureHex?.slice(0, 32)}…
      </p>
    </div>
  );
}
