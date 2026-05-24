'use client';

import { motion } from 'framer-motion';
import {
  Pencil,
  Trash2,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Gift } from '@/types';
import { cn } from '@/lib/utils';

interface GiftAdminCardProps {
  gift: Gift;
  index: number;
  onEdit: (gift: Gift) => void;
  onDelete: (gift: Gift) => void;
  onToggleAvailability: (gift: Gift) => void;
}

export function GiftAdminCard({
  gift,
  index,
  onEdit,
  onDelete,
  onToggleAvailability,
}: GiftAdminCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(gift.price);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border bg-zinc-900/30 shadow-xl backdrop-blur-md transition-colors',
        gift.available
          ? 'border-zinc-800/70 hover:border-zinc-700/80'
          : 'border-zinc-800/40 opacity-90'
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
        <img
          src={gift.image}
          alt={gift.name}
          className={cn(
            'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
            !gift.available && 'grayscale'
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{gift.category}</Badge>
          <Badge variant={gift.available ? 'success' : 'destructive'}>
            {gift.available ? 'Disponível' : 'Indisponível'}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-semibold text-zinc-100">
          {gift.name}
        </h3>
        <p className="mt-1 text-lg font-bold text-violet-300">{formattedPrice}</p>
        {gift.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
            {gift.description}
          </p>
        ) : (
          <p className="mt-2 text-sm italic text-zinc-600">Sem descrição</p>
        )}

        {gift.purchaseLink && (
          <a
            href={gift.purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300"
          >
            Ver link de compra
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-800/80 pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(gift)}
            className="flex-1 rounded-lg border-zinc-800 text-zinc-300 hover:bg-zinc-800/60"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleAvailability(gift)}
            className="rounded-lg border-zinc-800 text-zinc-300 hover:bg-zinc-800/60"
            title={gift.available ? 'Marcar indisponível' : 'Marcar disponível'}
          >
            {gift.available ? (
              <ToggleRight className="h-4 w-4 text-emerald-400" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-zinc-500" />
            )}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(gift)}
            className="rounded-lg"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
