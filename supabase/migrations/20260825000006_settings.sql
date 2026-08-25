-- ============================================
-- SETTINGS: business numbers (tarif, kapasitas, BEP) — never hardcode these
-- ============================================

create table settings (
  key text primary key,
  value text not null,
  description text,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);

create trigger settings_set_updated_at
  before update on settings
  for each row execute function set_updated_at();

alter table settings enable row level security;

create policy "all roles read settings" on settings for select
  using (auth.uid() is not null);

create policy "admin manages settings" on settings for all
  using (auth_role() = 'admin')
  with check (auth_role() = 'admin');

insert into settings (key, value, description) values
  ('tarif_default', '175000', 'Tarif default per sesi (Rupiah)'),
  ('kapasitas_max_sesi_bulan', '874', 'Kapasitas maksimum sesi per bulan (4 fisio x 4 ruang x sesi efektif)'),
  ('target_bep_sesi_bulan', '290', 'Target BEP (break-even point) sesi per bulan');
