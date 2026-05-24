'use client';

import { Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Gift } from '@/types';

interface DeleteGiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gift: Gift | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteGiftDialog({
  open,
  onOpenChange,
  gift,
  onConfirm,
  isDeleting,
}: DeleteGiftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="border-zinc-800/80 bg-zinc-950/95 text-zinc-100 backdrop-blur-xl sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-rose-400">
            <Trash2 className="h-5 w-5" />
            Excluir presente
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Tem certeza que deseja remover{' '}
            <span className="font-medium text-zinc-300">
              {gift?.name ?? 'este item'}
            </span>
            ? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 border-t border-zinc-800/80 bg-transparent sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-xl border-zinc-800 text-zinc-400"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
            className="rounded-xl"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
