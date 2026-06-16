import { NextRequest } from "next/server";
import db, { DBDataset } from "@/lib/db";
import { getBearerToken, verifyToken, jsonError, jsonOk } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = getBearerToken(req);
  const payload = token ? await verifyToken(token) : null;

  const all = Array.from(db.datasets.values());

  const visible = all.filter((d) => {
    if (d.acces === "public") return true;
    if (!payload) return false;
    if (d.acces === "protected") return true; // any authenticated user
    if (d.acces === "private") return d.creatorId === payload.sub || payload.role === "directeur";
    return false;
  });

  return jsonOk(visible);
}

export async function POST(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) return jsonError("Non authentifié.", 401);
  const payload = await verifyToken(token);
  if (!payload) return jsonError("Token invalide.", 401);
  if (!["chercheur", "responsable_axe", "directeur"].includes(payload.role)) {
    return jsonError("Accès refusé.", 403);
  }

  const body = await req.json();
  const { titre, description, type, licence, acces } = body;
  if (!titre || !description) return jsonError("Champs requis manquants.", 400);

  const id = `data-${Date.now()}`;
  const dataset: DBDataset = {
    id,
    titre,
    description,
    type: type || "csv",
    licence: licence || "CC BY 4.0",
    acces: acces || "public",
    fichiers: [],
    metadonnees: {},
    creatorId: payload.sub,
    creatorName: db.users.get(payload.sub)?.nom,
    size: "0 MB",
    downloads: 0,
    dateDepot: new Date().toISOString().split("T")[0],
  };

  db.datasets.set(id, dataset);
  return jsonOk(dataset, 201);
}
