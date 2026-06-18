"use client";
import { useEffect, useState } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
}

let toastQueue: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

export function toast({ title, description, variant = "default" }: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  const newToast: Toast = { id, title, description, variant };
  toastQueue = [...toastQueue, newToast];
  listeners.forEach((l) => l(toastQueue));
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toastQueue));
  }, 3500);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => { listeners = listeners.filter((l) => l !== setToasts); };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex flex-col gap-0.5 rounded-xl border bg-card px-4 py-3 shadow-xl text-sm animate-in slide-in-from-bottom-2 fade-in-0 duration-200 ${
            t.variant === "success" ? "border-green-500/30" :
            t.variant === "error" ? "border-red-500/30" :
            "border-border"
          }`}
        >
          <p className="font-medium">{t.title}</p>
          {t.description && <p className="text-muted-foreground text-xs">{t.description}</p>}
        </div>
      ))}
    </div>
  );
}
