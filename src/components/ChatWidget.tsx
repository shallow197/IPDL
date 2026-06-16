"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Bot, User, Loader2, SquarePen, Menu, Trash2 } from "lucide-react";
import { useLang } from "@/context/LangContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

const STORAGE_KEY = "ummisco_chat_conversations_v1";
const LEGACY_STORAGE_KEY = "ummisco_chat_v1";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Hier";
  if (d < 7) return `Il y a ${d}j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function ChatWidget() {
  const { t } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const makeConversation = (firstMessage?: Message): Conversation => ({
    id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: t("chatbot.newChat"),
    messages: [firstMessage ?? { role: "assistant", content: t("chatbot.welcome") }],
    updatedAt: new Date().toISOString(),
  });

  // Charge les conversations sauvegardées au montage (mémoire persistante, comme Claude),
  // avec migration depuis l'ancien format mono-conversation si présent.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { conversations: Conversation[]; activeId: string };
        if (Array.isArray(saved.conversations) && saved.conversations.length > 0) {
          const activeId = saved.activeId || saved.conversations[0].id;
          // Nettoyage des conversations jamais utilisées (créées par erreur via plusieurs clics
          // sur "nouvelle conversation"), pour ne pas polluer l'historique avec des doublons vides.
          const cleaned = saved.conversations.filter(
            (c) => c.id === activeId || c.messages.some((m) => m.role === "user")
          );
          setConversations(cleaned.length > 0 ? cleaned : saved.conversations);
          setActiveId(activeId);
          setReady(true);
          return;
        }
      }
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacyMessages = JSON.parse(legacyRaw) as Message[];
        if (Array.isArray(legacyMessages) && legacyMessages.length > 0) {
          const migrated: Conversation = {
            id: `conv-${Date.now()}`,
            title: legacyMessages.find((m) => m.role === "user")?.content.slice(0, 40) || t("chatbot.newChat"),
            messages: legacyMessages,
            updatedAt: new Date().toISOString(),
          };
          setConversations([migrated]);
          setActiveId(migrated.id);
          localStorage.removeItem(LEGACY_STORAGE_KEY);
          setReady(true);
          return;
        }
      }
    } catch {}
    const first = makeConversation();
    setConversations([first]);
    setActiveId(first.id);
    setReady(true);
  }, []);

  // Ferme le chat dès qu'on navigue vers une autre page du site (clic sur un
  // lien de la sidebar) — la conversation reste sauvegardée, seul le panneau se ferme.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Sauvegarde à chaque changement, une fois le chargement initial terminé
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ conversations, activeId })); } catch {}
  }, [conversations, activeId, ready]);

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [conversations, activeId]
  );
  const messages = activeConv?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, activeId]);

  const updateActiveMessages = (updater: (prev: Message[]) => Message[]) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: updater(c.messages), updatedAt: new Date().toISOString() } : c))
    );
  };

  const newConversation = () => {
    // Si la conversation active n'a encore reçu aucun message, c'est déjà une
    // conversation "neuve" : on la réutilise au lieu d'empiler un doublon vide.
    const current = conversations.find((c) => c.id === activeId);
    if (current && !current.messages.some((m) => m.role === "user")) {
      setSidebarOpen(false);
      return;
    }
    const fresh = makeConversation();
    setConversations((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
    setSidebarOpen(false);
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
    setSidebarOpen(false);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (remaining.length === 0) {
        const fresh = makeConversation();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(remaining[0].id);
      return remaining;
    });
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    updateActiveMessages(() => [...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    // Première question de la conversation → titre provisoire immédiat, puis on
    // demande à l'IA un titre court qui résume le sujet (façon Claude).
    const convId = activeId;
    const isFirstUserMessage = !messages.some((m) => m.role === "user");
    if (isFirstUserMessage) {
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, title: text.slice(0, 40) } : c))
      );
      fetch("/api/chat/title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.title) {
            setConversations((prev) =>
              prev.map((c) => (c.id === convId ? { ...c, title: data.title } : c))
            );
          }
        })
        .catch(() => {});
    }

    const assistantIndex = newMessages.length;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const content = accumulated;
        updateActiveMessages((prev) => {
          const updated = [...prev];
          updated[assistantIndex] = { role: "assistant", content };
          return updated;
        });
      }
    } catch {
      updateActiveMessages((prev) => {
        const updated = [...prev];
        updated[assistantIndex] = {
          role: "assistant",
          content: "Désolé, une erreur est survenue. Veuillez réessayer.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const sortedConversations = useMemo(
    () =>
      [...conversations]
        // On masque les conversations vides (jamais utilisées) sauf celle en cours,
        // pour éviter une liste d'historique remplie de "Nouvelle conversation" identiques.
        .filter((c) => c.id === activeId || c.messages.some((m) => m.role === "user"))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [conversations, activeId]
  );

  const HistoryList = () => (
    <>
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-800 flex-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Conversations</span>
        <button
          onClick={newConversation}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          title={t("chatbot.newChat")}
          aria-label={t("chatbot.newChat")}
        >
          <SquarePen className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {sortedConversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => selectConversation(conv.id)}
            role="button"
            tabIndex={0}
            className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
              conv.id === activeId ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{conv.title}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{relativeTime(conv.updatedAt)}</p>
            </div>
            <button
              onClick={(e) => deleteConversation(conv.id, e)}
              className="flex-none p-1 rounded text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-slate-800 transition-all"
              title="Supprimer"
              aria-label="Supprimer la conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 bg-ummisco-blue text-white hover:bg-ummisco-blue/90"
          aria-label="Ouvrir le chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel — plein écran sous la navbar horizontale (top-16 = 64px). */}
      {open && (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-[100] flex bg-slate-950">
          {/* Sidebar historique — desktop */}
          <div className="hidden md:flex md:w-[260px] flex-none flex-col border-r border-slate-800 bg-slate-900/40">
            <HistoryList />
          </div>

          {/* Sidebar historique — mobile (drawer) */}
          {sidebarOpen && (
            <div className="md:hidden fixed inset-0 z-[110] flex">
              <div className="w-[78vw] max-w-[300px] flex flex-col bg-slate-950 border-r border-slate-800">
                <HistoryList />
              </div>
              <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
            </div>
          )}

          {/* Colonne principale */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex-none">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all flex-none"
                aria-label="Historique des conversations"
              >
                <Menu className="h-4.5 w-4.5" />
              </button>
              <div className="h-9 w-9 rounded-full bg-ummisco-blue/20 border border-blue-900/30 flex items-center justify-center flex-none">
                <Bot className="h-4.5 w-4.5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{t("chatbot.title")}</div>
                <div className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                  En ligne — Propulsé par GROQ
                </div>
              </div>
              <button
                onClick={newConversation}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all flex-none"
                title={t("chatbot.newChat")}
                aria-label={t("chatbot.newChat")}
              >
                <SquarePen className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all flex-none"
                title={t("chatbot.close")}
                aria-label={t("chatbot.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex-none h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      msg.role === "assistant"
                        ? "bg-blue-600/15 text-blue-400 border border-blue-900/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}>
                      {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "assistant"
                        ? "bg-slate-900 text-slate-200 rounded-tl-sm"
                        : "bg-ummisco-blue text-white rounded-tr-sm"
                    }`}>
                      {msg.content || (loading && i === messages.length - 1 ? (
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Loader2 className="h-3 w-3 animate-spin" /> {t("chatbot.thinking")}
                        </span>
                      ) : "")}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-slate-800 bg-slate-900/50 flex-none">
              <form onSubmit={sendMessage} className="max-w-3xl mx-auto w-full flex gap-2 p-3 sm:p-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("chatbot.placeholder")}
                  disabled={loading}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="h-10 w-10 rounded-full bg-ummisco-blue flex items-center justify-center text-white disabled:opacity-40 hover:bg-ummisco-blue/90 active:scale-95 transition-all flex-none"
                  aria-label={t("chatbot.send")}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
