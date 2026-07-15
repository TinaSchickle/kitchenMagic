-- kitchenMagic — Supabase setup
-- =============================================================================
-- Run this once in your Supabase project:  SQL Editor → New query → paste → Run.
--
-- DESIGN NOTE (intentional): kitchenMagic has NO login. It is a single shared
-- recipe collection so the same data shows up on every device. The policies
-- below therefore grant the public (anon) role full access. This is deliberate
-- for a personal, non-secret recipe app — it is NOT the per-account isolation
-- you'd want for multi-user data. If you ever want a lock, add a passphrase
-- gate in the app; the data model doesn't need to change.
-- =============================================================================

-- 1) Recipes table --------------------------------------------------------------
create table if not exists public.recipes (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default '',
  category    text not null default 'lunch',
  image_url   text,
  serves      integer,
  blocks      jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Adds the column for projects created before `serves` existed (safe to re-run).
alter table public.recipes add column if not exists serves integer;

create index if not exists recipes_created_at_idx
  on public.recipes (created_at desc);

alter table public.recipes enable row level security;

-- Public (no-login) access. Drop first so re-running stays clean.
drop policy if exists "public read recipes"   on public.recipes;
drop policy if exists "public write recipes"  on public.recipes;
drop policy if exists "public update recipes" on public.recipes;
drop policy if exists "public delete recipes" on public.recipes;

create policy "public read recipes"   on public.recipes for select using (true);
create policy "public write recipes"  on public.recipes for insert with check (true);
create policy "public update recipes" on public.recipes for update using (true) with check (true);
create policy "public delete recipes" on public.recipes for delete using (true);

-- 2) Planner table (recipes to cook soon) ---------------------------------------
create table if not exists public.planner (
  recipe_id  uuid primary key references public.recipes (id) on delete cascade,
  portions   integer not null default 1,
  added_at   timestamptz not null default now()
);

alter table public.planner enable row level security;

drop policy if exists "public read planner"   on public.planner;
drop policy if exists "public write planner"  on public.planner;
drop policy if exists "public update planner" on public.planner;
drop policy if exists "public delete planner" on public.planner;

create policy "public read planner"   on public.planner for select using (true);
create policy "public write planner"  on public.planner for insert with check (true);
create policy "public update planner" on public.planner for update using (true) with check (true);
create policy "public delete planner" on public.planner for delete using (true);

-- 3) Public image bucket --------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

drop policy if exists "public read images"   on storage.objects;
drop policy if exists "public upload images" on storage.objects;
drop policy if exists "public delete images" on storage.objects;

create policy "public read images" on storage.objects
  for select using (bucket_id = 'recipe-images');
create policy "public upload images" on storage.objects
  for insert with check (bucket_id = 'recipe-images');
create policy "public delete images" on storage.objects
  for delete using (bucket_id = 'recipe-images');
