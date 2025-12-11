"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Toast = {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
};

const ToastContext = createContext<
  (msg: string, type?: Toast["type"]) => void
>(() => {});

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

  const styles = {
    success: {
      gradient: "linear-gradient(135deg, #34D399, #059669)",
      emoji: "✅",
    },
    error: {
      gradient: "linear-gradient(135deg, #F87171, #DC2626)",
      emoji: "❌",
    },
    info: {
      gradient: "linear-gradient(135deg, #60A5FA, #2563EB)",
      emoji: "ℹ️",
    },
  };

  return (
    <ToastContext.Provider value={show}>
      {children}

      <div className="fixed inset-x-0 top-6 z-50 flex justify-center pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="
                px-4 py-3 rounded-xl shadow-xl text-white max-w-xl mx-auto
                flex items-center gap-3
                transform transition-all duration-300
                animate-slideFade
              "
              style={{
                background: styles[t.type ?? "info"].gradient,
              }}
            >
              <span className="text-lg">{styles[t.type ?? "info"].emoji}</span>
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind animations */}
      <style>
        {`
        @keyframes slideFade {
          0% {
            opacity: 0;
            transform: translateY(-15px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-slideFade {
          animation: slideFade 0.35s ease-out;
        }
      `}
      </style>
    </ToastContext.Provider>
  );
}
