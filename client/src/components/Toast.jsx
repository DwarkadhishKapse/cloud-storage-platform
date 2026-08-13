import React, { useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";

const Toast = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed right-6 top-6 z-[100] flex w-full max-w-sm items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      {isSuccess ? (
        <FiCheckCircle className="mt-0.5 text-emerald-600" size={22} />
      ) : (
        <FiXCircle className="mt-0.5 text-red-500" size={22} />
      )}

      <p className="flex-1 text-sm font-medium text-slate-700">{message}</p>

      <button
        onClick={onClose}
        className="text-slate-400 transition hover:text-slate-600"
      >
        <FiX size={18} />
      </button>
    </div>
  );
};

export default Toast;
