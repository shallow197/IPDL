import { NextRequest } from "next/server";
import db from "@/lib/db";
import { verifySignature } from "@/lib/crypto-utils";
import { jsonOk, jsonError } from "@/lib/auth";

interface Params { params: Promise<{ id: string }> }

/** Endpoint public : vérifie une signature par son ID. */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const sig = db.signatures.get(id);

  if (!sig) return jsonError("Signature introuvable.", 404);

  const cryptoValid = verifySignature(sig.signedData, sig.signatureHex, sig.publicKeyHex);

  return jsonOk({
    valid: cryptoValid,
    signature: sig,
    message: cryptoValid
      ? "Signature cryptographiquement valide."
      : "Signature corrompue ou modifiée.",
  });
}
