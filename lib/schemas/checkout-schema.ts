import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(50, 'Nome muito longo'),
  phone: z
    .string()
    .min(14, 'Telefone inválido. Ex: (11) 99999-9999')
    .max(15, 'Telefone inválido'),
  deliveryMethod: z.enum(['hands', 'surprise', 'online'], {
    message: 'Selecione um método de entrega',
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
