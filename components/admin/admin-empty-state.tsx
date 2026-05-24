'use client';

import { motion } from 'framer-motion';
import { Gift, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminEmptyStateProps {
  variant: 'no-gifts' | 'no-results';
  onAction?: () => void;
}

export function AdminEmptyState({ variant, onAction }: AdminEmptyStateProps) {
  const isNoResults = variant === 'no-results';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-900/20 px-8 py-16 text-center backdrop-blur-md"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/60">
        {isNoResults ? (
          <Search className="h-6 w-6 text-zinc-500" />
        ) : (
          <Gift className="h-6 w-6 text-violet-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-zinc-100">
        {isNoResults ? 'Nenhum presente encontrado' : 'Sua lista está vazia'}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
        {isNoResults
          ? 'Tente outro termo de busca ou limpe os filtros de categoria.'
          : 'Comece adicionando o primeiro presente à lista do chá de casa nova.'}
      </p>
      {!isNoResults && onAction && (
        <Button
          onClick={onAction}
          className="mt-6 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-fuchsia-500"
        >
          Adicionar presente
        </Button>
      )}
    </motion.div>
  );
}
