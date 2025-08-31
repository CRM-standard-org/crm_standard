import { createContext } from "react";

type ToastContextType = {
  showToast: (message: string, isSuccess: boolean) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
