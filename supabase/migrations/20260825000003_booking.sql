-- ============================================
-- FEATURE #1: JADWAL & BOOKING
-- ============================================

create table physiotherapists (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  full_name text not null,
  str_number text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create type booking_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');

create table bookings (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  physiotherapist_id uuid not null references physiotherapists(id),
  room_id uuid not null references rooms(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status booking_status not null default 'scheduled',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint valid_time_range check (ends_at > starts_at),

  -- no double-booking: same physio can't overlap
  exclude using gist (
    physiotherapist_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status != 'cancelled'),

  -- no double-booking: same room can't overlap
  exclude using gist (
    room_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status != 'cancelled')
);

create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

alter table physiotherapists enable row level security;
alter table rooms enable row level security;
alter table bookings enable row level security;

-- all logged-in roles can read (needed for calendar view)
create policy "all roles read physiotherapists" on physiotherapists for select using (auth.uid() is not null);
create policy "all roles read rooms" on rooms for select using (auth.uid() is not null);
create policy "all roles read bookings" on bookings for select using (auth.uid() is not null);

-- only admin manages physio/room master data
create policy "admin manages physiotherapists" on physiotherapists for all using (auth_role() = 'admin') with check (auth_role() = 'admin');
create policy "admin manages rooms" on rooms for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- admin + resepsionis can create/update bookings (front-desk scheduling)
create policy "admin and resepsionis manage bookings" on bookings for all
  using (auth_role() in ('admin', 'resepsionis'))
  with check (auth_role() in ('admin', 'resepsionis'));
