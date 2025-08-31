import { ReactNode, useState, useCallback } from "react";
import * as Toast from "@radix-ui/react-toast";
import { ToastContext } from "./ToastContextBase";

type ToastItem = {
  id: string;
  message: string;
  isSuccess: boolean;
};

// Context is defined in ToastContextBase to satisfy fast refresh constraints

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, isSuccess: boolean) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, isSuccess }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast.Provider swipeDirection="right">
        {toasts.map((t) => (
          <Toast.Root
            key={t.id}
            duration={6000}
            onOpenChange={(open) => {
              if (!open) removeToast(t.id);
            }}
            className={`max-w-lg w-128 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ${
              t.isSuccess
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
          >
            <div className="flex items-start gap-2">
              <strong className="font-bold text-lg shrink-0">
                {t.isSuccess ? "Success!" : "Error!"}
              </strong>
              <span className="text-sm leading-relaxed break-words">
                {t.message}
              </span>
            </div>
          </Toast.Root>
        ))}
  <Toast.Viewport className="fixed top-16 right-4 z-[2147483647] flex flex-col gap-2 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};
