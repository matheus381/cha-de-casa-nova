import { getSupabaseClient } from '@/lib/supabase/client';
import {
  giftFormToInsert,
  giftFormToUpdate,
  partialGiftToUpdate,
  rowToGift,
} from '@/lib/supabase/mappers';
import { getErrorMessage } from '@/lib/errors';
import type { Gift } from '@/types';
import type { GiftFormValues } from '@/lib/schemas/gift-form-schema';

export async function fetchAllGifts(): Promise<Gift[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(getErrorMessage(error, 'Não foi possível carregar os presentes.'));
  }

  return (data ?? []).map(rowToGift);
}

export async function createGift(values: GiftFormValues): Promise<Gift> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('gifts')
    .insert(giftFormToInsert(values))
    .select('*')
    .single();

  if (error) {
    throw new Error(getErrorMessage(error, 'Não foi possível criar o presente.'));
  }

  return rowToGift(data);
}

export async function updateGift(
  id: string,
  values: GiftFormValues
): Promise<Gift> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('gifts')
    .update(giftFormToUpdate(values))
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(getErrorMessage(error, 'Não foi possível atualizar o presente.'));
  }

  return rowToGift(data);
}

export async function deleteGiftById(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('gifts').delete().eq('id', id);

  if (error) {
    throw new Error(getErrorMessage(error, 'Não foi possível excluir o presente.'));
  }
}

export async function toggleGiftAvailability(id: string, available: boolean): Promise<Gift> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('gifts')
    .update({
      available,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(
      getErrorMessage(error, 'Não foi possível alterar a disponibilidade.')
    );
  }

  return rowToGift(data);
}

export async function markGiftsUnavailable(giftIds: string[]): Promise<void> {
  if (giftIds.length === 0) return;

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('gifts')
    .update({
      available: false,
      updated_at: new Date().toISOString(),
    })
    .in('id', giftIds);

  if (error) {
    throw new Error(
      getErrorMessage(error, 'Não foi possível reservar os presentes selecionados.')
    );
  }
}

export async function patchGift(id: string, updates: Partial<Gift>): Promise<Gift> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('gifts')
    .update(partialGiftToUpdate(updates))
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(getErrorMessage(error, 'Não foi possível atualizar o presente.'));
  }

  return rowToGift(data);
}

export function subscribeToGiftsChanges(onChange: () => void): () => void {
  const supabase = getSupabaseClient();

  const channel = supabase
    .channel('gifts-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'gifts' },
      () => {
        onChange();
      }
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
