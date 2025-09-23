"use client"
import { useEffect } from "react"

export function Toast({ message, show, onClose }: { message: string; show: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;
  return (
    <div className="fixed top-6 right-6 z-50 bg-red-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
