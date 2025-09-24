"use client"
import { useEffect } from "react"

type ToastType = "error" | "success" | "info"

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
  type?: ToastType
}

export function Toast({ message, show, onClose, type = "error" }: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 text-white";
      case "info":
        return "bg-blue-600 text-white";
      case "error":
      default:
        return "bg-red-600 text-white";
    }
  };

  return (
    <div className={`fixed top-6 right-6 z-50 ${getToastStyles()} px-4 py-3 rounded-lg shadow-lg animate-fade-in max-w-sm`}>
      <div className="flex items-center">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-3 text-white/80 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
