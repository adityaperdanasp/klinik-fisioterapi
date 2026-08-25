-- ============================================
-- FEATURE #2 (cont.): CATATAN SESI
-- 1 booking = 1 session note, written by fisioterapis after the session
-- ============================================

create table session_notes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings(id) on delete cascade,
  patient_id uuid not null references patients(id),
  complaint text,
  progress_notes text,
  written_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger session_notes_set_updated_at
  before update on session_notes
  for each row execute function set_updated_at();

alter table session_notes enable row level security;

create policy "clinical staff read session notes" on session_notes for select
  using (auth_role() in ('admin', 'fisioterapis'));
create policy "clinical staff manage session notes" on session_notes for all
  using (auth_role() in ('admin', 'fisioterapis'))
  with check (auth_role() in ('admin', 'fisioterapis'));
