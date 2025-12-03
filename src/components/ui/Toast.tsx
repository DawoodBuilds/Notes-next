"use client";
import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "./button_temp";

export type ToastVariant = "success" | "error" | "info" | "warn";

export type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export function showToast(toast: Omit<ToastItem, "id">) {
  if (typeof window === "undefined") return;
  const id = Math.random().toString(36).substring(2, 9);
  const event = new CustomEvent("recap:toast", {
    detail: { id, ...toast },
  });
  window.dispatchEvent(event);
}

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handle = (e: Event) => {
      const ce = e as CustomEvent<ToastItem>;
      const t = ce.detail as ToastItem;
      setToasts((prev) => [t, ...prev]);
      if (t.duration !== 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((x) => x.id !== t.id));
        }, t.duration ?? 4000);
      }
    };
    window.addEventListener("recap:toast", handle as EventListener);
    return () =>
      window.removeEventListener("recap:toast", handle as EventListener);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`flex items-start gap-4 p-3 rounded-lg shadow-lg border transition-all duration-200 overflow-hidden w-full ${
            t.variant === "success"
              ? "bg-green-50 border-green-100"
              : t.variant === "error"
              ? "bg-red-50 border-red-100"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="mt-1 h-6 w-6 text-slate-600">
            {t.variant === "success" ? (
              <CheckCircle className="text-green-500" />
            ) : t.variant === "error" ? (
              <AlertTriangle className="text-red-500" />
            ) : (
              <Info className="text-blue-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {t.title && (
              <div className="font-semibold text-sm text-slate-800">
                {t.title}
              </div>
            )}
            {t.description && (
              <div className="text-sm text-slate-600 truncate">
                {t.description}
              </div>
            )}
          </div>

          <div className="ml-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setToasts((prev) => prev.filter((x) => x.id !== t.id))
              }
            >
              <X className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
