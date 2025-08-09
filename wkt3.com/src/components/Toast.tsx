import React, { useEffect, useState } from "react";

/**
 * Simple toast system
 * - Exported `toast` object with placeholder `.success(msg)` and `.error(msg)` functions
 * - `Toast` component subscribes to the simple in-module event bus and renders toasts
 * - Uses Tailwind classes for basic styling and transition
 *
 * Usage:
 * 1. Add <Toast /> somewhere near the root of your app (e.g. inside app/layout.tsx)
 * 2. Import and call toast.success("Saved!") or toast.error("Something went wrong") from anywhere
 */

type ToastType = "success" | "error";

type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

// Simple in-module event bus
const listeners = new Set<(t: ToastItem) => void>();

function emitToast(t: ToastItem) {
  for (const l of listeners) l(t);
}

// exported placeholder API
export const toast = {
  success: (message: string) => {
    const t: ToastItem = {
      id: String(Date.now()) + Math.random(),
      type: "success",
      message,
    };
    // This is a placeholder function — you can hook this up to any real toast library later
    emitToast(t);
  },
  error: (message: string) => {
    const t: ToastItem = {
      id: String(Date.now()) + Math.random(),
      type: "error",
      message,
    };
    emitToast(t);
  },
};

export default function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts((prev) => [t, ...prev]);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    // Auto-dismiss logic per toast
    const timers = toasts.map((t) => {
      const id = setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 4000); // 4s default
      return { id: t.id, timer: id };
    });

    return () => {
      timers.forEach((tt) => clearTimeout(tt.timer));
    };
  }, [toasts]);

  return (
    // Container fixed to top-right. Adjust position as you like.
    <div className="pointer-events-none fixed inset-0 flex items-start justify-end p-4 z-50">
      <div className="w-full max-w-xs space-y-2 md:mx-4">
        {toasts.map((t) => (
          <ToastCard
            key={t.id}
            toast={t}
            onClose={() =>
              setToasts((prev) => prev.filter((x) => x.id !== t.id))
            }
          />
        ))}
      </div>
    </div>
  );
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) {
  // Local state to handle enter/leave animation
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger enter
    const id = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(id);
  }, []);

  const bg = toast.type === "success" ? "bg-emerald-600" : "bg-rose-600";
  const icon =
    toast.type === "success" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l5.516 9.803c.75 1.333-.213 2.998-1.742 2.998H4.483c-1.53 0-2.492-1.665-1.742-2.998L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );

  return (
    <div
      className={`pointer-events-auto transform transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div
        className={`${bg} rounded-lg shadow-lg p-3 text-white flex items-start gap-3`}
      >
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1 text-sm leading-snug break-words">
          {toast.message}
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 200);
          }}
          className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-white/10"
          aria-label="Dismiss toast"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
