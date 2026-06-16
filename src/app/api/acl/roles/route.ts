import { NextRequest } from "next/server";
import db, { PERMISSIONS, type DBRole } from "@/lib/db";
import { getBearerToken, verifyToken, jsonError, jsonOk } from "@/lib/auth";

async function requireDirector(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) return { error: jsonError("Non authentifié.", 401) };
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "directeur") {
    return { error: jsonError("Accès refusé. Réservé au directeur.", 403) };
  }
  return { payload };
}

// List dynamic roles + the permission catalog (single round-trip for the UI).
export async function GET(req: NextRequest) {
  const { error } = await requireDirector(req);
  if (error) return error;
  const roles = Array.from(db.roles.values());
  return jsonOk({ roles, permissions: PERMISSIONS });
}

// Compose a new ACL role from a set of permissions.
export async function POST(req: NextRequest) {
  const { error } = await requireDirector(req);
  if (error) return error;

  const { name, description, permissions } = await req.json();
  if (!name || !Array.isArray(permissions) || permissions.length === 0) {
    return jsonError("Un nom et au moins une permission sont requis.", 400);
  }
  const valid = new Set(PERMISSIONS.map((p) => p.id));
  const cleaned = (permissions as string[]).filter((p) => valid.has(p));

  const nameNorm = String(name).trim().toLowerCase();
  const exists = Array.from(db.roles.values()).some(
    (r) => r.name.trim().toLowerCase() === nameNorm
  );
  if (exists) return jsonError("Un rôle avec ce nom existe déjà.", 409);

  const id = `role-${Date.now()}`;
  const role: DBRole = {
    id,
    name: String(name).trim(),
    description: String(description ?? "").trim(),
    permissions: cleaned,
    system: false,
    createdAt: new Date().toISOString(),
  };
  db.roles.set(id, role);
  return jsonOk(role, 201);
}

// Update a (non-system) role.
export async function PUT(req: NextRequest) {
  const { error } = await requireDirector(req);
  if (error) return error;

  const { id, name, description, permissions } = await req.json();
  const role = db.roles.get(id);
  if (!role) return jsonError("Rôle introuvable.", 404);
  if (role.system) return jsonError("Les rôles système ne sont pas modifiables.", 400);

  const valid = new Set(PERMISSIONS.map((p) => p.id));
  const updated: DBRole = {
    ...role,
    name: name ? String(name).trim() : role.name,
    description: description !== undefined ? String(description).trim() : role.description,
    permissions: Array.isArray(permissions)
      ? (permissions as string[]).filter((p) => valid.has(p))
      : role.permissions,
  };
  db.roles.set(id, updated);
  return jsonOk(updated);
}

// Delete a (non-system) role.
export async function DELETE(req: NextRequest) {
  const { error } = await requireDirector(req);
  if (error) return error;

  const { id } = await req.json();
  const role = db.roles.get(id);
  if (!role) return jsonError("Rôle introuvable.", 404);
  if (role.system) return jsonError("Les rôles système ne sont pas supprimables.", 400);
  db.roles.delete(id);
  return jsonOk({ ok: true });
}
