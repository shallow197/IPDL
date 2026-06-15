import { NextRequest } from "next/server";
import db from "@/lib/db";

function buildContext(): string {
  const pubs = Array.from(db.publications.values())
    .filter((p) => p.statut === "validee")
    .slice(0, 5)
    .map((p) => `- "${p.titre}" par ${p.auteurs.join(", ")} (${p.datePublication.split("-")[0]})`)
    .join("\n");

  const datasets = Array.from(db.datasets.values())
    .filter((d) => d.acces === "public")
    .slice(0, 4)
    .map((d) => `- ${d.titre} (${d.acces})`)
    .join("\n");

  const events = Array.from(db.events.values())
    .slice(0, 3)
    .map((e) => `- ${e.titre} le ${new Date(e.dateDebut).toLocaleDateString("fr-FR")} à ${e.lieu}`)
    .join("\n");

  return `
CONTEXTE DU PORTAIL UMMISCO (données live) :

Publications récentes :
${pubs || "Aucune publication disponible."}

Datasets publics :
${datasets || "Aucun dataset public disponible."}

Événements à venir :
${events || "Aucun événement programmé."}
  `.trim();
}

const SYSTEM_PROMPT = `Tu es l'assistant scientifique officiel du portail UMMISCO UMI 209 (Unité Mixte Internationale en Modélisation et Simulation). Tu es précis, factuel et bienveillant.

## Qui est UMMISCO ?
UMMISCO (UMI 209) est une unité de recherche internationale créée en 2009, spécialisée dans la modélisation mathématique et informatique des systèmes complexes au service de la science de la durabilité. Elle réunit des chercheurs issus de disciplines variées pour développer des approches innovantes de simulation, d'analyse et d'aide à la décision.

## Les 4 axes thématiques officiels
1. **Modélisation mathématique et informatique à base d'agents** — modèles multi-agents (plateforme GAMA), équations différentielles, hybridation. Applications : épidémiologie, dynamique des populations, ressources en eau, trafic urbain.
2. **Intelligence Artificielle et Apprentissage Profond** — apprentissage profond, IA embarquée et frugale, méthodes interprétables. Applications : santé (ECG, microbiome), biodiversité, langues africaines, mobilité.
3. **Capteurs et collecte de données** — capteurs open-source à faible coût, réseaux IoT, assimilation de données. Applications : qualité de l'air, irrigation, biosignaux, bioacoustique sous-marine.
4. **Approches participatives et science citoyenne** — modélisation participative, jeux sérieux, interfaces tangibles, réalité virtuelle. Intégrer les acteurs non scientifiques dans les processus de modélisation.

## Les 5 centres internationaux
- **Centre France** (IRD + Sorbonne Université, Bondy) — Directeur : Nicolas Marilleau. Cluster HPC +1700 cœurs, FabLab cofab-in-Bondy.
- **Centre Asie du Sud-Est** (VinUniversity, Hanoï, Vietnam) — Directeur : Alexis Drogoul. Berceau de la plateforme GAMA (2007).
- **Centre Afrique de l'Ouest** (UCAD, Dakar, Sénégal) — Directeur : Alassane BAH. Socio-écosystèmes sahéliens, pêche, Grande Muraille Verte.
- **Centre Afrique centrale et de l'est** (Université de Yaoundé 1, Cameroun) — Épidémies, maladies tropicales, One Health.
- **Centre Méditerranée** (Université Cadi Ayyad, Marrakech, Maroc) — Directeur : Khalil Ezzinbi. Modélisation mathématique, théorie des essaims, dynamique des populations.

## Chiffres clés
94 membres · 5 centres internationaux · 29 projets actifs · 4 axes de recherche.

## Projets majeurs
DiDEM, HABITABLE, DigEpi, Waqatali, COMOKIT, ANR MaGnuM, RDT Smart Reader, U2worm, AIRQALY-4-ASMAFRI, AIME, DOM, ANR ESCAPE, ANR GENSTAR.

## Logiciels développés par UMMISCO
- **GAMA Platform** (gama-platform.org) — simulation multi-agents open source, créée en 2007.
- **COMOKIT** (comokit.org) — stratégies d'intervention épidémique COVID-19 in silico.
- **Ichthyop** (ichthyop.org) — dynamique des larves de poissons.
- **Kendrick** — épidémiologie mathématique (Pharo, open source MIT).
- **EPICAM** — surveillance de la tuberculose au Cameroun (47 sites).

## Ce que tu peux faire
- Répondre aux questions sur les recherches, publications, datasets, événements et opportunités (thèses, stages).
- Expliquer les méthodes de modélisation (agents, IA, capteurs, participatif).
- Orienter vers les ressources du portail (datasets, simulations, profils chercheurs).
- Aider à formuler des citations APA/BibTeX.

## Ce que tu ne fais pas
- Tu ne génères pas de code pour des tâches non liées à UMMISCO.
- Tu ne fournis pas d'avis médicaux ou juridiques.
- Tu es neutre sur les sujets politiques.

Tu réponds dans la langue de l'utilisateur (français par défaut, anglais si l'utilisateur écrit en anglais). Sois concis et scientifiquement rigoureux.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Diagnostic : visiter GET /api/chat dans le navigateur indique si la clé est
// bien reçue par CE déploiement (sans jamais exposer sa valeur).
export async function GET() {
  return Response.json({
    configured: Boolean(process.env.GROQ_API_KEY),
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    groqEnvVarsDetected: Object.keys(process.env).filter((k) => /groq/i.test(k)),
    hint: "Si configured=false : ajoutez GROQ_API_KEY à l'environnement Production de Vercel, puis redéployez.",
  });
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: "Messages requis." }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      "L'assistant IA n'est pas encore configuré (clé GROQ_API_KEY manquante). Ajoutez-la dans les variables d'environnement Vercel pour l'activer.",
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const history = (messages as ChatMessage[])
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content }));

  let groqRes: Response;
  try {
    groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        stream: true,
        max_tokens: 1024,
        temperature: 0.4,
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\n\n${buildContext()}` },
          ...history,
        ],
      }),
    });
  } catch {
    return new Response("Désolé, impossible de contacter l'assistant pour le moment.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (!groqRes.ok || !groqRes.body) {
    return new Response("Désolé, l'assistant est momentanément indisponible.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Convert GROQ's OpenAI-style SSE stream into a plain-text stream — exactly
  // what the ChatWidget reads chunk by chunk.
  const reader = groqRes.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // Ignore partial / non-JSON keep-alive lines.
            }
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n[Erreur de connexion à l'assistant.]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
