'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  // SVG draw paths animation properties
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: 0.25, type: 'spring' as const, stiffness: 100, damping: 15 },
        opacity: { delay: 0.25, duration: 0.01 },
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          {/* Success Box */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl flex flex-col items-center"
          >
            {/* Ambient Sparkles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-violet-600/10 blur-3xl pointer-events-none rounded-full" />

            {/* Checkmark Animation */}
            <div className="relative w-20 h-20 bg-violet-600/10 border border-violet-500/20 rounded-full flex items-center justify-center mb-6 z-10">
              <motion.svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                className="text-violet-400 stroke-current stroke-[2.5]"
                fill="none"
                initial="hidden"
                animate="visible"
              >
                <motion.path
                  d="M20 6L9 17L4 12"
                  variants={draw}
                />
              </motion.svg>
              
              {/* Pulsing overlay */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border border-violet-500/40"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-3 mb-8">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-400">
                <Sparkles className="w-3.5 h-3.5" />
                Reserva Confirmada
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-100 tracking-tight">
                Muito obrigado!
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                Seu presente foi reservado com sucesso e marcado como indisponível na nossa lista. 
                Sua ajuda fará toda a diferença no começo do nosso novo lar!
              </p>
            </div>

            {/* Back to List CTA */}
            <div className="w-full relative z-10">
              <Button
                onClick={onClose}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-transform"
              >
                Voltar para a Lista
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
