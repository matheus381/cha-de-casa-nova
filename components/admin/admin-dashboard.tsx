'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus,
  Search,
  LayoutGrid,
  Package,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useGiftsStore } from '@/store/use-gifts-store';
import { useCartStore } from '@/store/use-cart-store';
import { useToastStore } from '@/store/use-toast-store';
import {
  createGift,
  updateGift,
  deleteGiftById,
  toggleGiftAvailability,
} from '@/lib/supabase/gifts';
import { getErrorMessage } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GiftFormDialog } from '@/components/admin/gift-form-dialog';
import { DeleteGiftDialog } from '@/components/admin/delete-gift-dialog';
import { GiftAdminCard } from '@/components/admin/gift-admin-card';
import { AdminEmptyState } from '@/components/admin/admin-empty-state';
import type { GiftFormValues } from '@/lib/schemas/gift-form-schema';
import { GIFT_CATEGORIES, type Gift, type GiftCategory } from '@/types';
import { cn } from '@/lib/utils';

type CategoryFilter = GiftCategory | 'all';

export function AdminDashboard() {
  const gifts = useGiftsStore((state) => state.gifts);
  const upsertGiftLocal = useGiftsStore((state) => state.upsertGiftLocal);
  const removeGiftLocal = useGiftsStore((state) => state.removeGiftLocal);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const addToast = useToastStore((state) => state.addToast);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingGift, setEditingGift] = useState<Gift | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingGift, setDeletingGift] = useState<Gift | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statsSource = useMemo(() => {
  if (categoryFilter === 'all') {
    return gifts;
  }

  return gifts.filter((gift) => gift.category === categoryFilter);
}, [gifts, categoryFilter]);

const stats = useMemo(() => {
  const available = statsSource.filter((g) => g.available).length;

  return {
    total: statsSource.length,
    available,
    unavailable: statsSource.length - available,
  };
}, [statsSource]);

  const filteredGifts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return gifts.filter((gift) => {
      const matchesCategory =
        categoryFilter === 'all' || gift.category === categoryFilter;
      const matchesSearch =
        !query ||
        gift.name.toLowerCase().includes(query) ||
        gift.description.toLowerCase().includes(query) ||
        gift.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [gifts, search, categoryFilter]);

  const openCreate = () => {
    setFormMode('create');
    setEditingGift(undefined);
    setFormOpen(true);
  };

  const openEdit = (gift: Gift) => {
    setFormMode('edit');
    setEditingGift(gift);
    setFormOpen(true);
  };

  const openDelete = (gift: Gift) => {
    setDeletingGift(gift);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (values: GiftFormValues) => {
    setIsSaving(true);
    try {
      if (formMode === 'create') {
        const gift = await createGift(values);
        upsertGiftLocal(gift);
        addToast({
          title: 'Presente adicionado',
          description: `"${values.name}" foi incluído na lista.`,
          type: 'success',
        });
      } else if (editingGift) {
        const gift = await updateGift(editingGift.id, values);
        upsertGiftLocal(gift);
        addToast({
          title: 'Presente atualizado',
          description: `As alterações em "${values.name}" foram salvas.`,
          type: 'success',
        });
      }
      setFormOpen(false);
    } catch (error) {
      addToast({
        title: 'Erro ao salvar',
        description: getErrorMessage(error, 'Não foi possível salvar o presente.'),
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingGift) return;
    setIsDeleting(true);
    try {
      await deleteGiftById(deletingGift.id);
      removeGiftLocal(deletingGift.id);
      removeFromCart(deletingGift.id);
      addToast({
        title: 'Presente removido',
        description: `"${deletingGift.name}" foi excluído da lista.`,
        type: 'info',
      });
      setDeleteOpen(false);
      setDeletingGift(null);
    } catch (error) {
      addToast({
        title: 'Erro ao excluir',
        description: getErrorMessage(error, 'Não foi possível excluir o presente.'),
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async (gift: Gift) => {
    try {
      const updated = await toggleGiftAvailability(gift.id, !gift.available);
      upsertGiftLocal(updated);
      addToast({
        title: updated.available
          ? 'Marcado como disponível'
          : 'Marcado como indisponível',
        description: gift.name,
        type: 'info',
      });
    } catch (error) {
      addToast({
        title: 'Erro ao atualizar',
        description: getErrorMessage(
          error,
          'Não foi possível alterar a disponibilidade.'
        ),
        type: 'error',
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar à loja
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                <Sparkles className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400/90">
                  Admin
                </p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Painel de Presentes
                </h1>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
              Gerencie a lista do chá de casa nova. Todas as alterações são
              sincronizadas com o Supabase em tempo real.
            </p>
          </div>

          <Button
            onClick={openCreate}
            disabled={isSaving}
            className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-fuchsia-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo presente
          </Button>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { label: 'Total', value: stats.total, icon: Package, tone: 'text-zinc-200' },
            {
              label: 'Disponíveis',
              value: stats.available,
              icon: CheckCircle2,
              tone: 'text-emerald-400',
            },
            {
              label: 'Indisponíveis',
              value: stats.unavailable,
              icon: XCircle,
              tone: 'text-rose-400',
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-zinc-800/70 bg-zinc-900/30 p-5 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {stat.label}
                  </p>
                  <Icon className={cn('h-4 w-4', stat.tone)} />
                </div>
                <p className={cn('mt-2 text-3xl font-bold', stat.tone)}>{stat.value}</p>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4 rounded-2xl border border-zinc-800/70 bg-zinc-900/25 p-4 backdrop-blur-md sm:p-5"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, categoria ou descrição..."
              className="h-11 rounded-xl border-zinc-800 bg-zinc-950/60 pl-10 text-zinc-100 placeholder:text-zinc-600"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                categoryFilter === 'all'
                  ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
                  : 'border-zinc-800 bg-zinc-950/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
              )}
            >
              Todas
            </button>
            {GIFT_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCategoryFilter(category)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                  categoryFilter === category
                    ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {gifts.length === 0 ? (
          <AdminEmptyState variant="no-gifts" onAction={openCreate} />
        ) : filteredGifts.length === 0 ? (
          <AdminEmptyState variant="no-results" />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredGifts.map((gift, index) => (
                <GiftAdminCard
                  key={gift.id}
                  gift={gift}
                  index={index}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onToggleAvailability={handleToggle}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredGifts.length > 0 && (
          <p className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-600">
            <LayoutGrid className="h-3.5 w-3.5" />
            Exibindo {filteredGifts.length} de {gifts.length} presentes
          </p>
        )}
      </div>

      <GiftFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        gift={editingGift}
        onSubmit={handleFormSubmit}
        isSubmitting={isSaving}
      />

      <DeleteGiftDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        gift={deletingGift}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
