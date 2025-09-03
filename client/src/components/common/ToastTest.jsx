import React from "react";
import { useToast } from "../../hooks/useToast";
import { Button } from "../ui/button";

const ToastTest = () => {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      title: "Success!",
      description: "This is a success message",
      variant: "success",
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error!",
      description: "This is an error message",
      variant: "destructive",
    });
  };

  const showWarningToast = () => {
    toast({
      title: "Warning!",
      description: "This is a warning message",
      variant: "warning",
    });
  };

  const showDefaultToast = () => {
    toast({
      title: "Info",
      description: "This is an info message",
      variant: "default",
    });
  };

  return (
    <div className="space-x-2 p-4">
      <Button onClick={showSuccessToast} variant="default">
        Success Toast
      </Button>
      <Button onClick={showErrorToast} variant="destructive">
        Error Toast
      </Button>
      <Button onClick={showWarningToast} variant="secondary">
        Warning Toast
      </Button>
      <Button onClick={showDefaultToast} variant="outline">
        Default Toast
      </Button>
    </div>
  );
};

export default ToastTest;
