import { NextRequest } from "next/server";

// Génère un titre court (façon Claude) qui résume le sujet de la conversation,
// au lieu d'afficher tel quel le texte brut du premier message de l'utilisateur.
export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Message requis." }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ title: message.slice(0, 40) });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        stream: false,
        max_tokens: 20,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "Tu résumes la question de l'utilisateur en un titre très court (3 à 6 mots), dans la même langue que la question, sans guillemets ni point final. Réponds uniquement par ce titre, rien d'autre.",
          },
          { role: "user", content: message.slice(0, 500) },
        ],
      }),
    });

    if (!groqRes.ok) {
      return Response.json({ title: message.slice(0, 40) });
    }

    const data = await groqRes.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    const title = raw.replace(/^["'«]+|["'»]+$/g, "").replace(/[.!?]+$/, "").slice(0, 60);

    return Response.json({ title: title || message.slice(0, 40) });
  } catch {
    return Response.json({ title: message.slice(0, 40) });
  }
}
