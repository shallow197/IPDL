import { NextRequest } from "next/server";
import db, { type DBSignature, type SignatureType } from "@/lib/db";
import { getBearerToken, verifyToken, jsonError, jsonOk } from "@/lib/auth";
import { verifySignature } from "@/lib/crypto-utils";

const ALLOWED_ROLES = ["chercheur", "responsable_axe", "directeur"];
const VALID_TYPES: SignatureType[] = ["profile", "dataset", "publication", "attestation"];

export async function POST(req: NextRequest) {
  // Auth
  const token = getBearerToken(req);
  if (!token) return jsonError("Non authentifié.", 401);
  const payload = await verifyToken(token);
  if (!payload) return jsonError("Token invalide ou expiré.", 401);
  if (!ALLOWED_ROLES.includes(payload.role)) {
    return jsonError("Seuls les chercheurs peuvent signer des documents.", 403);
  }

  const body = await req.json();
  const { type, targetId, targetLabel, signedData, signatureHex, publicKeyHex } = body as {
    type: SignatureType;
    targetId: string;
    targetLabel: string;
    signedData: string;
    signatureHex: string;
    publicKeyHex: string;
  };

  // Validation des champs
  if (!VALID_TYPES.includes(type) || !targetId || !targetLabel || !signedData || !signatureHex || !publicKeyHex) {
    return jsonError("Champs requis manquants ou invalides.", 400);
  }

  // Vérification cryptographique côté serveur (intégrité)
  const valid = verifySignature(signedData, signatureHex, publicKeyHex);
  if (!valid) {
    return jsonError("Signature cryptographique invalide.", 422);
  }

  // Pour les profils : vérifier que c'est autorisé (propre profil ou directeur)
  if (type === "profile") {
    if (targetId !== payload.sub && payload.role !== "directeur") {
      return jsonError("Vous ne pouvez signer que votre propre profil.", 403);
    }
  }

  // Pour les datasets : vérifier que l'utilisateur en est le créateur
  if (type === "dataset") {
    const ds = db.datasets.get(targetId);
    if (!ds) return jsonError("Dataset introuvable.", 404);
    if (ds.creatorId !== payload.sub && payload.role !== "directeur") {
      return jsonError("Vous ne pouvez signer que vos propres datasets.", 403);
    }
  }

  // Pour les publications DB : vérifier que l'utilisateur est bien auteur
  if (type === "publication") {
    const pub = db.publications.get(targetId);
    // Si publication DB existante, vérifier authorship
    if (pub && !pub.authorIds.includes(payload.sub) && payload.role !== "directeur") {
      return jsonError("Vous n'êtes pas auteur de cette publication.", 403);
    }
    // Si publication statique (id non trouvé dans db.publications) → auto-certification permise
  }

  const id = `sig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const signature: DBSignature = {
    id,
    signerId: payload.sub,
    signerName: payload.nom,
    type,
    targetId,
    targetLabel,
    signedData,
    signatureHex,
    publicKeyHex,
    timestamp: new Date().toISOString(),
  };

  db.signatures.set(id, signature);
  return jsonOk(signature, 201);
}
