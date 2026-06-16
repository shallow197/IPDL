"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, SquarePen } from "lucide-react";
import { useLang } from "@/context/LangContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "ummisco_chat_v1";

export default function ChatWidget() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("chatbot.welcome") },
  ]);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Charge la conversation sauvegardée au montage (mémoire persistante, comme Claude)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) setMessages(saved);
      }
    } catch {}
    setReady(true);
  }, []);

  // Sauvegarde à chaque changement, une fois le chargement initial terminé
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages, ready]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const newConversation = () => {
    const fresh: Message[] = [{ role: "assistant", content: t("chatbot.welcome") }];
    setMessages(fresh);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); } catch {}
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Add empty assistant message to stream into
    const assistantIndex = newMessages.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIndex] = { role: "assistant", content: accumulated };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
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

      {/* Chat panel — plein écran, façon Claude */}
      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex-none">
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
      )}
    </>
  );
}
