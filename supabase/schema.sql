-- Jairus Car Shop – minimal Supabase schema
-- Run this in Supabase Dashboard → SQL Editor (one-time).
--
-- Setup:
-- 1. Create a project at https://supabase.com
-- 2. Project Settings → API: copy "Project URL" and "anon public" key
-- 3. Add to .env.local:
--    NEXT_PUBLIC_SUPABASE_URL=<Project URL>
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
-- 4. Paste and run this entire file in SQL Editor

-- Cart items (anonymous session-based)
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  car_id text not null,
  quantity int not null default 1 check (quantity >= 1),
  created_at timestamptz not null default now(),
  unique(session_id, car_id)
);

-- Orders (checkout)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  customer_name text not null,
  customer_address text not null,
  customer_phone text,
  total numeric not null check (total >= 0),
  created_at timestamptz not null default now()
);

-- Order line items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  car_id text not null,
  quantity int not null check (quantity >= 1),
  unit_price numeric not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_cart_items_session on public.cart_items(session_id);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- Allow anonymous read/write for cart and orders (no auth)
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Allow all for cart_items"
  on public.cart_items for all
  using (true) with check (true);

create policy "Allow all for orders"
  on public.orders for all
  using (true) with check (true);

create policy "Allow all for order_items"
  on public.order_items for all
  using (true) with check (true);
