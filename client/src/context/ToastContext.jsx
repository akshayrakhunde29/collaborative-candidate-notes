import React, { createContext, useState, useCallback } from "react";

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 5000 }) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = {
        id,
        title,
        description,
        variant,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = {
    toast,
    dismiss,
    toasts,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
