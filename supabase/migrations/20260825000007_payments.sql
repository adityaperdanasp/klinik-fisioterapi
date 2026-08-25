-- ============================================
-- FEATURE #3: KASIR / BILLING PER SESI
-- ============================================

create type payment_method as enum ('tunai', 'transfer', 'qris');

create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings(id) on delete cascade,
  patient_id uuid not null references patients(id),
  amount numeric(12, 2) not null check (amount >= 0),
  payment_method payment_method not null,
  paid_at timestamptz not null default now(),
  received_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

alter table payments enable row level security;

-- billing is front-desk/admin territory, same roles that manage bookings/patients
create policy "admin and resepsionis manage payments" on payments for all
  using (auth_role() in ('admin', 'resepsionis'))
  with check (auth_role() in ('admin', 'resepsionis'));
