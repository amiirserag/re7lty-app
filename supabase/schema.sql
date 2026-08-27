-- Re7lety — Supabase schema
-- Paste this into the SQL editor of your Supabase project.
-- Users themselves are managed by Supabase Auth (auth.users); these tables
-- hold the app data that the client syncs up when a user is signed in.

-- ---------------------------------------------------------------
-- profiles: one row per user, mirrors the in-app profile
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  name         text not null default '',
  email        text not null default '',
  phone        text not null default '',
  city         text not null default '',
  member_since text not null default '',
  membership   text not null default '',
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles: delete own" on public.profiles
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- favorites: saved cars (car ids come from the app's static catalog)
-- ---------------------------------------------------------------
create table if not exists public.favorites (
  user_id    uuid not null references auth.users (id) on delete cascade,
  car_id     text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, car_id)
);

alter table public.favorites enable row level security;

create policy "favorites: select own" on public.favorites
  for select using (auth.uid() = user_id);
create policy "favorites: insert own" on public.favorites
  for insert with check (auth.uid() = user_id);
create policy "favorites: delete own" on public.favorites
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- bookings: client-generated ids (bk-<timestamp>), dates as YYYY-MM-DD
-- ---------------------------------------------------------------
create table if not exists public.bookings (
  id                 text primary key,
  user_id            uuid not null references auth.users (id) on delete cascade,
  reference          text not null,
  car_id             text not null,
  status             text not null check (status in ('upcoming', 'active', 'completed', 'cancelled')),
  start_date         date not null,
  end_date           date not null,
  pickup_location    text not null default '',
  return_location    text not null default '',
  delivery_requested boolean not null default false,
  delivery_address   text not null default '',
  renter_name        text not null default '',
  renter_phone       text not null default '',
  renter_email       text not null default '',
  total              integer not null default 0,
  created_at         date not null,
  synced_at          timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings (user_id);

alter table public.bookings enable row level security;

create policy "bookings: select own" on public.bookings
  for select using (auth.uid() = user_id);
create policy "bookings: insert own" on public.bookings
  for insert with check (auth.uid() = user_id);
create policy "bookings: update own" on public.bookings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bookings: delete own" on public.bookings
  for delete using (auth.uid() = user_id);
