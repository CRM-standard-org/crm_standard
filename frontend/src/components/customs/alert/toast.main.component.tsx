/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState, useMemo, useCallback } from "react";
import * as Toast from "@radix-ui/react-toast";

type ToastContextType = {
  showToast: (
    message: string,
    isSuccess: boolean,
    options?: { title?: string; durationMs?: number }
  ) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastProviderComponent = ({ children }: { children: ReactNode }) => {
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [toastTitle, setToastTitle] = useState("");
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null);

  const showToast = useCallback<ToastContextType["showToast"]>(
    (message, isSuccess, options) => {
      if (toastTimeout) clearTimeout(toastTimeout);

      setToastMessage(message);
      setIsSuccess(isSuccess);
      setToastTitle(
        options?.title ?? (isSuccess ? "Success!" : "Error!")
      );
      setIsToastOpen(true);

      const timeoutId = setTimeout(() => {
        setIsToastOpen(false);
      }, options?.durationMs ?? 3000);

      setToastTimeout(timeoutId);
    },
    [toastTimeout]
  );

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={isToastOpen}
          onOpenChange={setIsToastOpen}
          className={`fixed top-[70px] right-4 z-[2147483647] max-w-lg w-128 px-4 py-3 rounded-lg shadow-lg border transition-all duration-500 transform ${
            isSuccess
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-red-100 border-red-400 text-red-700"
          } ${isToastOpen ? "opacity-100 animate-fade-in" : "opacity-0 animate-fade-out"}`}
        >
          <div className="flex items-center">
            <strong className="font-bold text-lg" role="heading" aria-level={2}>
              {toastTitle}
            </strong>
            <span className="ml-2 text-sm" role="status">
              {toastMessage}
            </span>
            <button
              type="button"
              aria-label="close"
              className="ml-auto cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded"
              onClick={() => setIsToastOpen(false)}
            >
              ×
            </button>
          </div>
        </Toast.Root>
  <Toast.Viewport className="fixed top-0 right-0 p-4 z-[2147483647]" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};

export const ToastProvider = ToastProviderComponent; // named export for existing imports
export default ToastProviderComponent;

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};