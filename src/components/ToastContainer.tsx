import { createContext, useContext, useState, ReactNode } from "react";
import Toast, { ToastProps } from "./Toast";
import "../scss/toast.scss";

interface ToastData extends Omit<ToastProps, "onClose"> {
  id: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastProps["type"], duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (
    message: string,
    type: ToastProps["type"] = "error",
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showError: (message, duration) => showToast(message, "error", duration),
        showSuccess: (message, duration) => showToast(message, "success", duration),
        showWarning: (message, duration) => showToast(message, "warning", duration),
        showInfo: (message, duration) => showToast(message, "info", duration),
      }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
