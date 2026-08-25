-- ============================================
-- FEATURE #2: REKAM MEDIS PASIEN (EMR ringan)
-- ============================================

create sequence patient_mr_seq start 1;

create table patients (
  id uuid primary key default gen_random_uuid(),
  medical_record_number text not null unique
    default ('RM-' || lpad(nextval('patient_mr_seq')::text, 4, '0')),
  full_name text not null,
  date_of_birth date,
  gender text check (gender in ('L', 'P')),
  phone text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger patients_set_updated_at
  before update on patients
  for each row execute function set_updated_at();

-- clinical data, split out so resepsionis never sees this table
create table patient_medical_info (
  patient_id uuid primary key references patients(id) on delete cascade,
  initial_diagnosis text,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);

create trigger patient_medical_info_set_updated_at
  before update on patient_medical_info
  for each row execute function set_updated_at();

alter table patients enable row level security;
alter table patient_medical_info enable row level security;

-- administrative patient data: all roles can read (resepsionis needs it for booking)
create policy "all roles read patients" on patients for select using (auth.uid() is not null);
create policy "admin and resepsionis manage patients" on patients for all
  using (auth_role() in ('admin', 'resepsionis'))
  with check (auth_role() in ('admin', 'resepsionis'));

-- clinical data: only admin + fisioterapis
create policy "clinical staff read medical info" on patient_medical_info for select
  using (auth_role() in ('admin', 'fisioterapis'));
create policy "clinical staff manage medical info" on patient_medical_info for all
  using (auth_role() in ('admin', 'fisioterapis'))
  with check (auth_role() in ('admin', 'fisioterapis'));
