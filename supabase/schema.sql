-- Chá de Casa Nova — Supabase schema
-- Run in Supabase SQL Editor, then run seed.sql

create extension if not exists "pgcrypto";

-- Gifts catalog
create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  image text not null,
  category text not null,
  available boolean not null default true,
  description text not null default '',
  purchase_link text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gifts_category_idx on public.gifts (category);
create index if not exists gifts_available_idx on public.gifts (available);

-- Orders (checkout)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  delivery_method text not null check (
    delivery_method in ('hands', 'surprise', 'online')
  ),
  total numeric(10, 2) not null check (total >= 0),
  created_at timestamptz not null default now()
);

-- Order line items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  gift_id uuid not null references public.gifts (id) on delete restrict,
  gift_name text not null,
  gift_price numeric(10, 2) not null check (gift_price >= 0),
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- Row Level Security (anon key — adjust for production auth)
alter table public.gifts enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "gifts_select" on public.gifts;
create policy "gifts_select" on public.gifts for select using (true);

drop policy if exists "gifts_insert" on public.gifts;
create policy "gifts_insert" on public.gifts for insert with check (true);

drop policy if exists "gifts_update" on public.gifts;
create policy "gifts_update" on public.gifts for update using (true);

drop policy if exists "gifts_delete" on public.gifts;
create policy "gifts_delete" on public.gifts for delete using (true);

drop policy if exists "orders_insert" on public.orders;
create policy "orders_insert" on public.orders for insert with check (true);

drop policy if exists "orders_select" on public.orders;
create policy "orders_select" on public.orders for select using (true);

drop policy if exists "order_items_insert" on public.order_items;
create policy "order_items_insert" on public.order_items for insert with check (true);

drop policy if exists "order_items_select" on public.order_items;
create policy "order_items_select" on public.order_items for select using (true);

-- Realtime: enable in Dashboard → Database → Replication → gifts
