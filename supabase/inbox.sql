-- kitchenMagic — Foto-Inbox (3. Tab „Fotos")
-- =============================================================================
-- Einmalig im Supabase-Projekt ausführen:  SQL Editor → New query → einfügen → Run.
--
-- Zweck: hochgeladene Rezeptfotos zwischenlagern, die noch nicht abgetippt
-- sind. Claude liest die offenen Einträge später aus, legt daraus Rezepte an
-- und setzt den Eintrag auf 'erledigt' (das Foto bleibt zum Gegenprüfen da).
-- Gleiche No-Login-Logik wie der Rest der App: öffentlicher Zugriff.
-- =============================================================================

-- 1) Inbox-Tabelle ------------------------------------------------------------
create table if not exists public.recipe_inbox (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  note        text not null default '',
  status      text not null default 'offen',   -- 'offen' | 'erledigt'
  recipe_id   uuid,                             -- gesetzt, sobald abgetippt
  created_at  timestamptz not null default now()
);

create index if not exists recipe_inbox_created_at_idx
  on public.recipe_inbox (created_at desc);

alter table public.recipe_inbox enable row level security;

drop policy if exists "public read recipe_inbox"   on public.recipe_inbox;
drop policy if exists "public write recipe_inbox"  on public.recipe_inbox;
drop policy if exists "public update recipe_inbox" on public.recipe_inbox;
drop policy if exists "public delete recipe_inbox" on public.recipe_inbox;

create policy "public read recipe_inbox"   on public.recipe_inbox for select using (true);
create policy "public write recipe_inbox"  on public.recipe_inbox for insert with check (true);
create policy "public update recipe_inbox" on public.recipe_inbox for update using (true) with check (true);
create policy "public delete recipe_inbox" on public.recipe_inbox for delete using (true);

-- 2) Öffentlicher Bucket für die Inbox-Fotos --------------------------------
insert into storage.buckets (id, name, public)
values ('recipe-inbox', 'recipe-inbox', true)
on conflict (id) do nothing;

drop policy if exists "public read inbox images"   on storage.objects;
drop policy if exists "public upload inbox images" on storage.objects;
drop policy if exists "public delete inbox images" on storage.objects;

create policy "public read inbox images" on storage.objects
  for select using (bucket_id = 'recipe-inbox');
create policy "public upload inbox images" on storage.objects
  for insert with check (bucket_id = 'recipe-inbox');
create policy "public delete inbox images" on storage.objects
  for delete using (bucket_id = 'recipe-inbox');
