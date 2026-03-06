"use client";

import { useToastStore, ToastMessage } from "@/lib/store/toastStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const getIcon = (type: ToastMessage["type"]) => {
  if (type === "success") return <CheckCircle className="w-5 h-5 text-green-400" />;
  if (type === "error") return <AlertCircle className="w-5 h-5 text-red-400" />;
  return <Info className="w-5 h-5 text-blue-400" />;
};

const getBg = (type: ToastMessage["type"]) => {
  if (type === "success") return "bg-green-950/40 border-green-500/20";
  if (type === "error") return "bg-red-950/40 border-red-500/20";
  return "bg-blue-950/40 border-blue-500/20";
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl min-w-[300px] max-w-sm ${getBg(t.type)}`}
          >
            <div className="shrink-0 mt-0.5">{getIcon(t.type)}</div>
            <p className="text-white text-sm font-medium leading-relaxed flex-1">
              {t.message}
            </p>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
