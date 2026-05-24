import { z } from 'zod';
import { GIFT_CATEGORIES } from '@/types';

export const giftFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(80, 'Nome muito longo'),
  price: z
    .number({ message: 'Informe um preço válido' })
    .positive('O preço deve ser maior que zero'),
  category: z.enum(GIFT_CATEGORIES, { message: 'Selecione uma categoria' }),
  image: z.string().url('Informe uma URL de imagem válida'),
  description: z.string().max(300, 'Descrição muito longa'),
  purchaseLink: z
    .string()
    .refine(
      (value) => value === '' || z.url().safeParse(value).success,
      'Informe um link de compra válido ou deixe em branco'
    ),
  available: z.boolean(),
});

export type GiftFormValues = z.infer<typeof giftFormSchema>;
