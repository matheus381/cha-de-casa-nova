/**
 * Legacy seed data — used only to generate supabase/seed.sql.
 * Runtime catalog is loaded from Supabase (see lib/supabase/gifts.ts).
 */
import { normalizeGift, type GiftSeed } from '@/lib/gifts';

const giftSeeds: GiftSeed[] = [
  // COZINHA
  {
    id: 'cozinha-1',
    name: 'Jogo de Panelas Ceramic Premium',
    price: 899.90,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
    category: 'Cozinha',
    available: true,
  },
  {
    id: 'cozinha-2',
    name: 'Cafeteira Espresso Nespresso Vertuo',
    price: 799.00,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
    category: 'Cozinha',
    available: true,
  },
  {
    id: 'cozinha-3',
    name: 'Liquidificador Vitamix Pro-Series',
    price: 459.90,
    image: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=600&q=80',
    category: 'Cozinha',
    available: true,
  },
  {
    id: 'cozinha-4',
    name: 'Jogo de Pratos de Cerâmica Artesanal',
    price: 349.90,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
    category: 'Cozinha',
    available: true,
  },
  {
    id: 'cozinha-5',
    name: 'Batedeira Planetária KitchenAid Artisan',
    price: 2499.00,
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f9d8a8f6?auto=format&fit=crop&w=600&q=80',
    category: 'Cozinha',
    available: true,
  },

  // BANHEIRO
  {
    id: 'banheiro-1',
    name: 'Jogo de Toalhas de Algodão Egípcio (5 peças)',
    price: 299.90,
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80',
    category: 'Banheiro',
    available: true,
  },
  {
    id: 'banheiro-2',
    name: 'Kit Organizador de Banheiro em Bambu',
    price: 149.90,
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=600&q=80',
    category: 'Banheiro',
    available: true,
  },
  {
    id: 'banheiro-3',
    name: 'Espelho Inteligente com LED e Touch Screen',
    price: 549.00,
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80',
    category: 'Banheiro',
    available: true,
  },
  {
    id: 'banheiro-4',
    name: 'Difusor Aromático Ultrassônico de Cerâmica',
    price: 189.90,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    category: 'Banheiro',
    available: true,
  },
  {
    id: 'banheiro-5',
    name: 'Roupão de Banho de Microfibra Premium',
    price: 220.00,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80',
    category: 'Banheiro',
    available: true,
  },

  // SALA DE ESTAR
  {
    id: 'sala-1',
    name: 'Luminária de Chão Minimalista Nordic',
    price: 389.90,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    category: 'Sala de Estar',
    available: true,
  },
  {
    id: 'sala-2',
    name: 'Par de Almofadas Premium em Linho Cru',
    price: 129.90,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=600&q=80',
    category: 'Sala de Estar',
    available: true,
  },
  {
    id: 'sala-3',
    name: 'Mesa de Apoio Lateral em Madeira Maciça',
    price: 420.00,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
    category: 'Sala de Estar',
    available: true,
  },
  {
    id: 'sala-4',
    name: 'Vaso de Cerâmica Off-White com Planta Seca',
    price: 99.90,
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80',
    category: 'Sala de Estar',
    available: true,
  },
  {
    id: 'sala-5',
    name: 'Tapete Geométrico Premium Soft (2.0x1.5m)',
    price: 649.90,
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80',
    category: 'Sala de Estar',
    available: true,
  },

  // QUARTO
  {
    id: 'quarto-1',
    name: 'Jogo de Cama de Cetim de Algodão 400 Fios',
    price: 499.90,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    category: 'Quarto',
    available: true,
  },
  {
    id: 'quarto-2',
    name: 'Par de Travesseiros Viscoelásticos Nasa Duoflex',
    price: 189.90,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=600&q=80&q=80',
    category: 'Quarto',
    available: true,
  },
  {
    id: 'quarto-3',
    name: 'Manta Aconchegante de Tricô Artesanal',
    price: 179.90,
    image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=600&q=80',
    category: 'Quarto',
    available: true,
  },
  {
    id: 'quarto-4',
    name: 'Kit Cabides de Veludo Preto (30 unidades)',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    category: 'Quarto',
    available: true,
  },
  {
    id: 'quarto-5',
    name: 'Luminária de Cabeceira com Indução Smart',
    price: 249.90,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    category: 'Quarto',
    available: true,
  },

  // PRESENTES ESPECIAIS
  {
    id: 'especial-1',
    name: 'Caixa de Som Inteligente Echo Show 8 Alexa',
    price: 899.00,
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=600&q=80',
    category: 'Presentes Especiais',
    available: true,
  },
  {
    id: 'especial-2',
    name: 'Adega de Vinhos Climatizada (12 Garrafas)',
    price: 1299.90,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    category: 'Presentes Especiais',
    available: true,
  },
  {
    id: 'especial-3',
    name: 'Robô Aspirador Mapeamento Inteligente Eufy',
    price: 1599.00,
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80',
    category: 'Presentes Especiais',
    available: true,
  },
  {
    id: 'especial-4',
    name: 'Fritadeira Elétrica Airfryer Philips Walita',
    price: 679.90,
    image: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=600&q=80',
    category: 'Presentes Especiais',
    available: true,
  },
  {
    id: 'especial-5',
    name: 'Fechadura Digital Inteligente Yale Smart',
    price: 949.00,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    category: 'Presentes Especiais',
    available: true,
  },
];

export const initialGifts = giftSeeds.map(normalizeGift);
