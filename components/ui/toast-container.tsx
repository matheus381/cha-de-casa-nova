'use client';

import { useToastStore } from '@/store/use-toast-store';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm px-4 md:px-0 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="pointer-events-auto flex items-start gap-3 w-full bg-zinc-900/80 border border-zinc-800/60 backdrop-blur-md p-4 rounded-xl shadow-2xl"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                ) : (
                  <Info className="w-5 h-5 text-sky-400" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 flex flex-col">
                <span className="text-sm font-semibold text-zinc-100">{toast.title}</span>
                {toast.description && (
                  <span className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {toast.description}
                  </span>
                )}
              </div>

              {/* Close */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded-md hover:bg-zinc-800/40"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
