'use client';

import { useCartStore } from '@/store/use-cart-store';
import { GiftCard } from './gift-card';
import { Gift } from '@/types';
import { motion } from 'framer-motion';

interface CategorySectionProps {
  title: string;
  id: string;
  category: Gift['category'];
  description: string;
}

export function CategorySection({ title, id, category, description }: CategorySectionProps) {
  const gifts = useCartStore((state) => state.gifts);
  // Sort gifts by availability so that available gifts appear first, and chosen ones are grouped at the end. Excellent UX!
  const filteredGifts = gifts
    .filter((gift) => gift.category === category)
    .sort((a, b) => (a.available === b.available ? 0 : a.available ? -1 : 1));

  if (filteredGifts.length === 0) return null;

  return (
    <section
      id={id}
      className="py-16 sm:py-20 border-t border-zinc-900/80 bg-zinc-950/40 relative scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              {title}
            </h2>
            <p className="text-sm text-zinc-400">
              {description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
              {filteredGifts.filter(g => g.available).length} disponíveis
            </span>
          </div>
        </div>

        {/* Gift Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredGifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
