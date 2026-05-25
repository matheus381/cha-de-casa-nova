'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ImageIcon, Link2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { giftFormSchema, type GiftFormValues } from '@/lib/schemas/gift-form-schema';
import { GIFT_CATEGORIES, type Gift } from '@/types';
import { cn } from '@/lib/utils';

interface GiftFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  gift?: Gift;
  onSubmit: (values: GiftFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

const defaultValues: GiftFormValues = {
  name: '',
  price: 1,
  category: 'Cozinha',
  image: '',
  description: '',
  purchaseLink: '',
  available: true,
};

function giftToFormValues(gift: Gift): GiftFormValues {
  return {
    name: gift.name,
    price: gift.price,
    category: gift.category,
    image: gift.image,
    description: gift.description,
    purchaseLink: gift.purchaseLink,
    available: gift.available,
  };
}

export function GiftFormDialog({
  open,
  onOpenChange,
  mode,
  gift,
  onSubmit,
  isSubmitting = false,
}: GiftFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<GiftFormValues>({
    resolver: zodResolver(giftFormSchema),
    defaultValues,
  });

  const imagePreview = watch('image');

  useEffect(() => {
    if (!open) return;
    reset(mode === 'edit' && gift ? giftToFormValues(gift) : defaultValues);
  }, [open, mode, gift, reset]);

  const handleFormSubmit = async (values: GiftFormValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[90vh] overflow-y-auto border-zinc-800/80 bg-zinc-950/95 text-zinc-100 shadow-2xl shadow-violet-500/5 backdrop-blur-xl sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-100">
            {mode === 'create' ? 'Novo presente' : 'Editar presente'}
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            {mode === 'create'
              ? 'Adicione um item à lista no Supabase.'
              : 'Atualize as informações do presente selecionado.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Nome
              </Label>
              <Input
                {...register('name')}
                placeholder="Ex: Jogo de panelas premium"
                className="h-11 rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100"
              />
              {errors.name && (
                <p className="text-xs text-rose-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Preço (R$)
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register('price', { valueAsNumber: true })}
                placeholder="0,00"
                className="h-11 rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100"
              />
              {errors.price && (
                <p className="text-xs text-rose-400">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Categoria
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-800 bg-zinc-950">
                      {GIFT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-xs text-rose-400">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <ImageIcon className="h-3.5 w-3.5" />
                URL da imagem
              </Label>
              <Input
                {...register('image')}
                placeholder="https://..."
                className="h-11 rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100"
              />
              {errors.image && (
                <p className="text-xs text-rose-400">{errors.image.message}</p>
              )}
              {imagePreview && !errors.image && (
                <div className="mt-2 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
                  <img
                    src={imagePreview}
                    alt="Pré-visualização"
                    className="aspect-video w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Descrição
              </Label>
              <Textarea
                {...register('description')}
                placeholder="Detalhes opcionais sobre o presente..."
                className="rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100"
              />
              {errors.description && (
                <p className="text-xs text-rose-400">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <Link2 className="h-3.5 w-3.5" />
                Link de compra
              </Label>
              <Input
                {...register('purchaseLink')}
                placeholder="https://loja.com/produto (opcional)"
                className="h-11 rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-100"
              />
              {errors.purchaseLink && (
                <p className="text-xs text-rose-400">{errors.purchaseLink.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 sm:col-span-2">
              <div>
                <p className="text-sm font-medium text-zinc-200">Disponível na loja</p>
                <p className="text-xs text-zinc-500">
                  Presentes indisponíveis aparecem como já escolhidos
                </p>
              </div>
              <Controller
                name="available"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                    className={cn(
                      'relative h-7 w-12 rounded-full transition-colors',
                      field.value ? 'bg-violet-600' : 'bg-zinc-700'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                        field.value && 'translate-x-5'
                      )}
                    />
                  </button>
                )}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-zinc-800/80 bg-transparent pt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-zinc-800 text-zinc-400"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : mode === 'create' ? (
                'Adicionar presente'
              ) : (
                'Salvar alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
