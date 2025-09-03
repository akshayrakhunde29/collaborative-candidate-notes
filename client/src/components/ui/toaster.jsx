import React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "../../hooks/useToast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <RadixToastProvider>
      {toasts.map(({ id, title, description, variant, ...props }) => (
        <Toast key={id} variant={variant} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </RadixToastProvider>
  );
}
