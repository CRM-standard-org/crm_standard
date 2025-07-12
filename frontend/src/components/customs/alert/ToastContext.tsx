import { createContext, ReactNode, useContext, useState } from "react";
import * as Toast from "@radix-ui/react-toast";

type ToastContextType = {
  showToast: (message: string, isSuccess: boolean) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);

  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null);

  const showToast = (message: string, isSuccess: boolean) => {
    // ยกเลิก timeout ที่ตั้งไว้ก่อนหน้านี้ถ้ามี
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    setToastMessage(message);
    setIsSuccess(isSuccess);
    setIsToastOpen(true);

    // ตั้งเวลาให้แสดง 3 วินาที
    const timeoutId = setTimeout(() => {
      setIsToastOpen(false);
    }, 3000); // 3 วินาที (3000 มิลลิวินาที)

    // เก็บ timeout id ไว้เพื่อใช้ยกเลิกในครั้งถัดไป
    setToastTimeout(timeoutId);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={isToastOpen}
          onOpenChange={setIsToastOpen}
          className={`fixed top-16 right-4 max-w-lg w-128 px-4 py-3 rounded-lg shadow-lg border transition-all duration-500 transform ${
            isSuccess ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"
          } ${isToastOpen ? "opacity-100 animate-fade-in" : "opacity-0 animate-fade-out"}`}
        >
          <div className="flex items-center">
            <strong className="font-bold text-lg">{isSuccess ? "Success!" : "Error!"}</strong>
            <span className="ml-2 text-sm">{toastMessage}</span>
            <span className="ml-auto cursor-pointer text-gray-700" onClick={() => setIsToastOpen(false)}></span>
          </div>
        </Toast.Root>
        <Toast.Viewport className="fixed top-0 right-0 p-4" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};