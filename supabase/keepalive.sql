-- kitchenMagic — Keepalive-Tabelle für den GitHub-Job „Supabase wachhalten"
-- =============================================================================
-- Einmalig im Supabase-Projekt ausführen:  SQL Editor → New query → einfügen → Run.
--
-- Zweck: Reine Lese-Pings haben das Projekt nicht zuverlässig wachgehalten
-- (Pause am 24.09.2026 trotz grünem Ping 2 Tage vorher). Der Job schreibt
-- deshalb bei jedem Lauf einen Zeitstempel in diese Mini-Tabelle — ein echter
-- Schreibzugriff auf die Datenbank. Es gibt immer nur genau eine Zeile (id = 1).
-- Die App selbst benutzt diese Tabelle nicht.
-- =============================================================================

create table if not exists public.keepalive (
  id         int primary key,
  source     text not null default '',
  pinged_at  timestamptz not null default now()
);

alter table public.keepalive enable row level security;

drop policy if exists "public read keepalive"   on public.keepalive;
drop policy if exists "public write keepalive"  on public.keepalive;
drop policy if exists "public update keepalive" on public.keepalive;

create policy "public read keepalive"   on public.keepalive for select using (true);
create policy "public write keepalive"  on public.keepalive for insert with check (id = 1);
create policy "public update keepalive" on public.keepalive for update using (id = 1) with check (id = 1);

insert into public.keepalive (id, source) values (1, 'setup')
on conflict (id) do nothing;
