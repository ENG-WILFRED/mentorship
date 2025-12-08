"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Toast = { id: number; message: string; type?: "success" | "error" | "info" };

const ToastContext = createContext<(msg: string, type?: Toast["type"]) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function show(message: string, type: Toast["type"] = "info") {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="px-4 py-3 rounded-lg shadow-lg text-white max-w-xs transform transition-all"
            style={{
              background: t.type === "success" ? "#10B981" : t.type === "error" ? "#EF4444" : "#3B82F6",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
