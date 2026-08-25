-- ============================================
-- EXTENSIONS
-- ============================================
create extension if not exists "btree_gist";

-- ============================================
-- HELPER: reusable updated_at trigger
-- ============================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================
-- PROFILES (extends auth.users with role)
-- ============================================
create type user_role as enum ('admin', 'fisioterapis', 'resepsionis');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER: safe to call inside RLS policies without recursion
create or replace function auth_role()
returns user_role language sql security definer stable as $$
  select role from profiles where id = auth.uid();
$$;

alter table profiles enable row level security;

create policy "users read own profile, admin reads all"
  on profiles for select
  using (id = auth.uid() or auth_role() = 'admin');

create policy "only admin manages profiles"
  on profiles for all
  using (auth_role() = 'admin')
  with check (auth_role() = 'admin');
