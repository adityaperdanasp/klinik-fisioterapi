# Klinik Fisioterapi — App Internal (Bekasi)

## Konteks Bisnis

Klinik fisioterapi spesialisasi cedera otot di Bekasi. Partner: Adit (fisioterapis, STR ada), Erwin, Maikel.

- Kapasitas: 4 fisioterapis × 4 ruang, sesi 50 menit, 7 jam efektif/hari, 26 hari/bulan → maksimum 874 sesi/bulan.
- BEP: 290 sesi/bulan (~33% dari kapasitas maksimum).
- Tarif default: Rp175.000/sesi (bisa berubah — jangan hardcode, taruh di config/settings, bukan di kode).
- Ramp-up asumsi: utilisasi 15% → 65% linear bulan 1–12.
- Model finansial lengkap ada di Google Sheet (link tidak disertakan di sini — tanya Adit kalau perlu referensi angka).

**Catatan penting:** status perizinan klinik dan harga alat medis masih belum final per Agustus 2026. Jangan asumsikan fitur billing asuransi/BPJS dibutuhkan kecuali diminta eksplisit — belum ada keputusan soal itu.

## Scope Fase 1 (BUILD INI DULU — jangan lebih)

Hanya 5 fitur berikut. Jangan tambah fitur lain tanpa diminta eksplisit, walau "kelihatan berguna":

1. **Jadwal & Booking Ruang/Fisio** — CRUD slot booking per fisioterapis & ruang, cegah double-booking, tampilan kalender mingguan.
2. **Rekam Medis Pasien (EMR ringan)** — data pasien, diagnosa awal, catatan tiap sesi (progres, keluhan), riwayat kunjungan.
3. **Kasir/Billing per Sesi** — catat pembayaran per sesi, harga default dari settings (bukan hardcode), rekap harian.
4. **Dashboard Utilisasi & BEP Tracker** — jumlah sesi aktual per bulan vs target BEP (290) vs kapasitas max (874), revenue per fisio/ruang, grafik ramp-up aktual vs proyeksi.
5. **Landing Page Klinik** — statis, info klinik, layanan, lokasi, CTA ke WA booking. Tidak perlu CMS, cukup konten hardcode yang gampang diedit.

**Non-goals untuk Fase 1** (jangan dibangun sampai diminta): WA bot/auto-reply, payment gateway online, portal login pasien, payroll otomatis, inventory alkes, loyalty/membership, integrasi asuransi.

## Stack

- Framework: Next.js (App Router) + TypeScript
- Database: Supabase (Postgres) — pakai row-level security dasar, jangan expose service key ke client
- Styling: Tailwind CSS
- Deploy target: Vercel (nanti, belum sekarang — dev lokal dulu)
- Auth: Supabase Auth, role sederhana (admin/fisioterapis/resepsionis) — tidak perlu multi-tenant

## Konvensi Kerja

- Setiap fitur baru: tanya dulu kalau ambigu, jangan asumsikan struktur data tanpa konfirmasi — ini klinik nyata, kesalahan data pasien/billing berdampak riil.
- Angka bisnis (tarif, kapasitas, BEP target) selalu dari tabel `settings`, bukan konstanta di kode.
- Commit kecil, satu fitur/perubahan per commit, pesan commit jelas dalam Bahasa Indonesia atau Inggris (konsisten, pilih salah satu di awal project).
- Tulis README singkat cara jalanin project secara lokal begitu setup awal selesai.
- Jangan install package baru tanpa alasan jelas — stack di atas sudah cukup untuk Fase 1.

## Yang Perlu Ditanyakan ke User Sebelum Mulai

- Supabase project sudah dibuat atau perlu dibantu setup?
- Siapa saja role yang akses app ini (berapa akun admin/resepsionis)?
- Nama & branding klinik final untuk landing page?
