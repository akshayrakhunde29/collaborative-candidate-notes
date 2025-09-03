import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    console.warn("useToast must be used within a ToastProvider");
    // Return dummy functions to prevent crashes during development
    return {
      toast: ({ title, description }) => {
        console.log("Toast:", title, description);
      },
      dismiss: () => {},
      toasts: [],
    };
  }

  return context;
};
