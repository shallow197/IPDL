import { NextRequest } from "next/server";
import db from "@/lib/db";
import { getBearerToken, verifyToken, jsonError, jsonOk } from "@/lib/auth";

/** Liste les signatures du compte connecté (ou toutes si directeur). */
export async function GET(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) return jsonError("Non authentifié.", 401);
  const payload = await verifyToken(token);
  if (!payload) return jsonError("Token invalide ou expiré.", 401);

  const all = Array.from(db.signatures.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filtered =
    payload.role === "directeur"
      ? all
      : all.filter((s) => s.signerId === payload.sub);

  return jsonOk(filtered);
}
