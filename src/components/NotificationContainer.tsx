"use client";

import React from "react";
import { useNotification } from "@/context/NotificationContext";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const icons = {
  success: <CheckCircle className="h-4 w-4 text-green-400 flex-none" />,
  error:   <XCircle    className="h-4 w-4 text-red-400   flex-none" />,
  info:    <Info       className="h-4 w-4 text-blue-400  flex-none" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-400 flex-none" />,
};

const borders = {
  success: "border-green-500/40",
  error:   "border-red-500/40",
  info:    "border-blue-500/40",
  warning: "border-amber-500/40",
};

export default function NotificationContainer() {
  const { notifications, dismiss } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-slate-900/95 backdrop-blur-sm px-4 py-3 shadow-xl animate-in slide-in-from-right-4 fade-in duration-300 ${borders[n.type]}`}
        >
          {icons[n.type]}
          <p className="flex-1 text-[13px] text-slate-200 leading-snug">{n.message}</p>
          <button
            onClick={() => dismiss(n.id)}
            className="text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
            aria-label="Fermer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
