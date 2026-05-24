'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/store/use-cart-store';
import { useToastStore } from '@/store/use-toast-store';
import { submitGiftSelection } from '@/lib/webhook';
import { BuyerInfo, DeliveryMethod } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Handshake, Gift as GiftIcon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Zod Validation Schema
const checkoutSchema = z.object({
  name: z
    .string()
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

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const cart = useCartStore((state) => state.cart);
  const confirmPurchase = useCartStore((state) => state.confirmPurchase);
  const addToast = useToastStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      phone: '',
      deliveryMethod: 'hands',
    },
  });

  // Phone number auto-formatter (mask)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    setValue('phone', value, { shouldValidate: true });
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    if (cart.length === 0) {
      addToast({
        title: 'Carrinho Vazio',
        description: 'Seu carrinho de presentes está vazio.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const buyer: BuyerInfo = {
        name: values.name,
        phone: values.phone,
        deliveryMethod: values.deliveryMethod as DeliveryMethod,
      };

      // 1. Submit to n8n webhook (handles mock mode fallback internally)
      await submitGiftSelection(buyer, cart);

      // 2. Mark gifts as taken in the Zustand store
      const giftIds = cart.map((item) => item.gift.id);
      confirmPurchase(giftIds);

      // 3. Clear checkout form
      reset();

      // 4. Trigger success notification
      addToast({
        title: 'Escolha confirmada!',
        description: 'Seu presente foi reservado com sucesso.',
        type: 'success',
      });

      // 5. Open Success modal
      onSuccess();
      onClose();
    } catch (error) {
      addToast({
        title: 'Erro ao processar',
        description: 'Não foi possível confirmar seu presente. Tente novamente.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deliveryOptions = [
    {
      id: 'hands',
      title: 'Entrega em mãos',
      desc: 'Entrega pessoalmente no dia do chá',
      icon: Handshake,
    },
    {
      id: 'surprise',
      title: 'Presente surpresa',
      desc: 'Enviar diretamente para o nosso endereço',
      icon: GiftIcon,
    },
    {
      id: 'online',
      title: 'Compra online',
      desc: 'Enviar cupom ou código de rastreamento',
      icon: Globe,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                disabled={isSubmitting}
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
                  Finalizar Escolha do Presente
                </h3>
                <p className="text-sm text-zinc-400 mt-1.5">
                  Preencha as informações para reservarmos os presentes em seu nome.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    disabled={isSubmitting}
                    placeholder="Seu nome"
                    className="h-11 rounded-xl bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                    {...register('name')}
                  />
                  {errors.name && (
                    <span className="text-xs font-medium text-rose-400">{errors.name.message}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Número de Celular
                  </Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="phone"
                        disabled={isSubmitting}
                        type="tel"
                        placeholder="(00) 00000-0000"
                        className="h-11 rounded-xl bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus-visible:ring-violet-500 focus-visible:border-violet-500"
                        {...field}
                        onChange={(e) => {
                          handlePhoneChange(e);
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors.phone && (
                    <span className="text-xs font-medium text-rose-400">{errors.phone.message}</span>
                  )}
                </div>

                {/* Delivery Method */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Método de Entrega
                  </Label>
                  <Controller
                    name="deliveryMethod"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 gap-3">
                        {deliveryOptions.map((opt) => {
                          const Icon = opt.icon;
                          const isSelected = field.value === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => field.onChange(opt.id)}
                              className={`flex items-start gap-4 p-3.5 rounded-xl border text-left transition-all duration-300 ${
                                isSelected
                                  ? 'bg-violet-600/10 border-violet-500 text-zinc-100 shadow-md shadow-violet-500/5'
                                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700/60'
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                              <div className={`mt-0.5 p-2 rounded-lg border ${
                                isSelected 
                                  ? 'bg-violet-600 border-violet-400 text-white' 
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className={`text-sm font-semibold block ${
                                  isSelected ? 'text-zinc-100' : 'text-zinc-300'
                                }`}>
                                  {opt.title}
                                </span>
                                <span className="text-xs text-zinc-500 block mt-1 font-normal leading-normal">
                                  {opt.desc}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.deliveryMethod && (
                    <span className="text-xs font-medium text-rose-400">
                      {errors.deliveryMethod.message}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    variant="ghost"
                    onClick={onClose}
                    className="flex-1 h-12 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/20 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Confirmar Presente
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
