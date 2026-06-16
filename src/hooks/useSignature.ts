"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import type { SignatureType } from "@/lib/db";

export interface SignPayload {
  type: SignatureType;
  targetId: string;
  targetLabel: string;
  /** Données métier à inclure dans le blob signé (titre, bio, etc.). */
  data: Record<string, unknown>;
}

export interface UseSignatureReturn {
  /** Génère et envoie une signature au serveur. Retourne la signature créée. */
  sign: (payload: SignPayload) => Promise<{ id: string; timestamp: string }>;
  /** true si une opération est en cours */
  signing: boolean;
  /** Message d'erreur de la dernière tentative */
  error: string | null;
  /** true si l'utilisateur n'a pas encore de clé (première utilisation) */
  isFirstUse: (userId: string) => boolean;
}

export function useSignature(): UseSignatureReturn {
  const { user, token } = useAuth();
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFirstUse = useCallback((userId: string) => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(`ummisco_sig_sk_${userId}`);
  }, []);

  const sign = useCallback(
    async (payload: SignPayload): Promise<{ id: string; timestamp: string }> => {
      if (!user || !token) throw new Error("Non authentifié.");

      setSigning(true);
      setError(null);

      try {
        // Import dynamique pour éviter le chargement côté serveur
        const { getOrCreateKeypair, signMessage } = await import("@/lib/crypto-utils");

        const { secretKeyHex, publicKeyHex } = getOrCreateKeypair(user.id);

        const signedData = JSON.stringify({
          type: payload.type,
          targetId: payload.targetId,
          targetLabel: payload.targetLabel,
          signerId: user.id,
          signerName: user.nom,
          timestamp: new Date().toISOString(),
          payload: payload.data,
        });

        const signatureHex = signMessage(signedData, secretKeyHex);

        const res = await fetch("/api/signatures/sign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: payload.type,
            targetId: payload.targetId,
            targetLabel: payload.targetLabel,
            signedData,
            signatureHex,
            publicKeyHex,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Erreur serveur.");
        }

        const created = await res.json();
        return { id: created.id, timestamp: created.timestamp };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Erreur inconnue.";
        setError(msg);
        throw e;
      } finally {
        setSigning(false);
      }
    },
    [user, token]
  );

  return { sign, signing, error, isFirstUse };
}
