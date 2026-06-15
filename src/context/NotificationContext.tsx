"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type NotifType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  message: string;
  type: NotifType;
}

interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, type?: NotifType) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  notify: () => {},
  dismiss: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: NotifType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
