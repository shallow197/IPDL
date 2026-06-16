import { NextRequest } from "next/server";
import db from "@/lib/db";
import { jsonOk } from "@/lib/auth";

interface Params { params: Promise<{ targetId: string }> }

/** Endpoint public : retourne toutes les signatures pour une cible donnée. */
export async function GET(_req: NextRequest, { params }: Params) {
  const { targetId } = await params;

  const sigs = Array.from(db.signatures.values())
    .filter((s) => s.targetId === targetId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return jsonOk(sigs);
}
