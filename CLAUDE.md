# Klinik Fisioterapi — App Internal (Bekasi)

App name: **Pulih Fisioterapi**. Status: **Fase 1 selesai** (semua 5 fitur di bawah sudah dibangun dan live di production). Ini file panduan buat kerja lanjutan (bugfix, penyesuaian, Fase 2).

## Konteks Bisnis

Klinik fisioterapi spesialisasi cedera otot di Bekasi. Partner: Adit (fisioterapis, STR ada), Erwin, Maikel.

- Kapasitas: 4 fisioterapis × 4 ruang, sesi 50 menit, 7 jam efektif/hari, 26 hari/bulan → maksimum 874 sesi/bulan.
- BEP: 290 sesi/bulan (~33% dari kapasitas maksimum).
- Tarif default: Rp175.000/sesi — disimpan di tabel `settings` (key `tarif_default`), bukan hardcode.
- Ramp-up asumsi: utilisasi 15% → 65% linear bulan 1–12. Bulan ke-1 dihitung dari `settings.bulan_mulai_operasional` (lihat TODO di bawah — masih placeholder).
- Model finansial lengkap ada di Google Sheet (link tidak disertakan di sini — tanya Adit kalau perlu referensi angka).

**Catatan penting:** status perizinan klinik dan harga alat medis masih belum final. Jangan asumsikan fitur billing asuransi/BPJS dibutuhkan kecuali diminta eksplisit — belum ada keputusan soal itu.

## Scope Fase 1 — status: SELESAI

Semua 5 fitur berikut sudah dibangun. **Jangan tambah fitur lain di luar ini tanpa diminta eksplisit**, walau "kelihatan berguna" — itu aturan yang masih berlaku meski Fase 1 sudah kelar.

1. ✅ **Jadwal & Booking Ruang/Fisio** (`/jadwal`) — CRUD slot booking, cegah double-booking (DB exclusion constraint di `bookings`), kalender mingguan, update status (Selesai/Tidak Hadir/Batalkan) oleh admin/resepsionis.
2. ✅ **Rekam Medis Pasien / EMR ringan** (`/pasien`, `/pasien/[id]`) — data pasien administratif (semua role baca), diagnosa awal & catatan sesi (`patient_medical_info`, `session_notes` — khusus admin/fisioterapis).
3. ✅ **Kasir/Billing per Sesi** (`/kasir`) — catat pembayaran per sesi (tunai/transfer/QRIS), nominal pre-fill dari `settings.tarif_default` tapi bisa diedit manual, rekap harian. Khusus admin/resepsionis.
4. ✅ **Dashboard Utilisasi & BEP Tracker** (`/dashboard`) — sesi aktual vs BEP vs kapasitas, revenue per fisio/ruang, grafik ramp-up aktual vs proyeksi (custom SVG, tanpa library chart). Khusus admin.
5. ✅ **Landing Page Klinik** (`/`, publik tanpa login) — nomor WA & alamat asli sudah terisi. Desain sudah beberapa kali di-iterate, versi terkini: palet cream/earth-tone, font Fraunces (display) + IBM Plex Sans (body), section: hero, features, trust (STR), alur pelayanan, layanan, tentang, tim, galeri (foto + 2 video looping), FAQ, lokasi, footer. Foto hero/layanan/galeri sekarang dikurasi dari `public/photos/` (asli dari folder asset user, dikompres, BUKAN stok Pexels lagi) — kecuali foto tim (lihat TODO). Link "lihat lokasi"/"Buka di Google Maps" buka Google Maps langsung (`GOOGLE_MAPS_URL`). Kontak di footer pakai email (`cs@pulihfisioterapi.id`), CTA booking lain tetap WA.

**Fitur tambahan di luar 5 asli** (dibangun setelah Fase 1 karena diminta eksplisit, bukan scope creep liar): halaman kelola ruang & fisioterapis (`/pengaturan`), kelola akun staff via email invite (`/pengaturan/staff`), edit data pasien, rekap bulanan kasir + export CSV (`/kasir/rekap`).

**Non-goals** (masih berlaku, jangan dibangun sampai diminta eksplisit): WA bot/auto-reply, payment gateway online, portal login pasien, payroll otomatis, inventory alkes, loyalty/membership, integrasi asuransi.

## TODO sebelum go-live publik penuh

- **Foto tim di landing page** ([app/page.tsx](app/page.tsx), array `TEAM`) — masih foto stok (Erwin/Mia/Fitria/Dhea), BUKAN foto staff asli. User sudah konfirmasi ini placeholder sementara — wajib diganti foto asli staff sebelum benar-benar go-live, supaya nggak menyesatkan pasien yang lihat web.
- **`settings.bulan_mulai_operasional`** — masih `2026-08-01` placeholder, ganti ke tanggal mulai operasional asli begitu pasti (pengaruh ke perhitungan proyeksi ramp-up di dashboard).
- **Data fisioterapis di tabel `physiotherapists`** (dipakai buat booking di `/jadwal`) beda dengan nama di landing page `TEAM` (Erwin/Mia/Fitria/Dhea) — belum disinkronkan, karena TEAM di landing page masih placeholder. Jangan asumsikan keduanya harus sama sampai user konfirmasi roster staff final.

## Stack & Infra

- Framework: Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS
- Database/Auth: Supabase (Postgres + Auth), project `pulih-fisioterapi` (ref `ahlvgfwkyxpbjrxvkffl`), row-level security per role di semua tabel — jangan expose `service_role` key ke client, cuma publishable/anon key yang ada di `.env.local`.
- Role: `admin` / `fisioterapis` / `resepsionis`, disimpan di tabel `profiles` (extend `auth.users`), dicek lewat helper function `auth_role()` di RLS policy.
- Deploy: Vercel, project `ellilo/klinik-fision-app`, production di **https://klinik-fision-app.vercel.app** dan custom domain **https://pulihfisioterapi.id** (aktif penuh + HTTPS, dibeli via SumoPod, DNS A record → Vercel), auto-connect ke GitHub repo (push ke `main` bisa trigger auto-deploy; `vercel --prod` juga bisa manual).
- Repo: `git@github.com:adityaperdanasp/klinik-fisioterapi.git` (pakai SSH — HTTPS gagal karena belum ada credential helper, `gh` CLI juga belum login).
- Dev lokal: `npm run dev` jalan di port 3010 (bukan 3000, karena bentrok dengan project lain di mesin yang sama). Config di `.claude/launch.json` (nama `pulih-fisioterapi`) kalau pakai Claude Code Browser tool.

### Migration database — proses manual

Migration SQL ada di `supabase/migrations/*.sql` tapi **tidak auto-apply** — belum ada `supabase db push` yang ke-link. Tiap migration baru harus di-paste manual ke SQL Editor Supabase (https://supabase.com/dashboard/project/ahlvgfwkyxpbjrxvkffl/sql/new) dan di-Run satu-satu, urut sesuai nomor timestamp filename (dependency order — jangan lompat urutan, beberapa tabel referensi tabel di migration sebelumnya).

## Konvensi Kerja

- Setiap fitur baru: tanya dulu kalau ambigu, jangan asumsikan struktur data tanpa konfirmasi — ini klinik nyata, kesalahan data pasien/billing berdampak riil.
- Angka bisnis (tarif, kapasitas, BEP target, bulan mulai operasional) selalu dari tabel `settings`, bukan konstanta di kode.
- Commit kecil, satu fitur/perubahan per commit, pesan commit dalam Bahasa Indonesia.
- Jangan install package baru tanpa alasan jelas.
- Setelah ubah kode yang observable di browser: jalankan `npx tsc --noEmit` dulu, baru verifikasi manual di preview sebelum bilang "selesai".

## Gotcha teknis (biar nggak keulang)

- **Timezone**: jangan pernah pakai `.toISOString().slice(0,10)` buat bikin date-key kalender — WIB itu UTC+7, konversi ke UTC bisa geser tanggal mundur. Pakai `toDateKey()` di [lib/week.ts](lib/week.ts) (berbasis `getFullYear/getMonth/getDate` lokal), jangan reimplement.
- **Supabase embedded relation cardinality**: tanpa generated types, `select("...,table(col)")` bisa balikin objek tunggal ATAU array tergantung ada tidaknya `UNIQUE` constraint di foreign key-nya — cek dulu sebelum asumsi salah satu (contoh: `payments.booking_id` UNIQUE → objek tunggal, bukan array).
- **Next.js 16**: `middleware.ts` sudah deprecated, pakai `proxy.ts` dengan named export `proxy` (bukan `middleware`).
- File `.env.local` isinya publishable/anon key doang (aman) — jangan pernah taruh `service_role` key di sana atau di kode manapun yang bisa ke-bundle ke client.
- **`proxy.ts` matcher** harus exclude semua ekstensi asset publik yang dipakai, bukan cuma gambar. Pernah kejadian: matcher cuma exclude `svg|png|jpg|jpeg|gif|webp`, jadi request ke `/videos/*.mp4` ke-anggap "halaman" dan di-redirect ke `/login`. Kalau nambah jenis asset baru di `public/` (video, audio, dll), cek dulu matcher regex-nya ikut di-update.
- Foto/video besar (dari kamera/stok, bisa puluhan MB) **wajib dikompres dulu** sebelum masuk `public/` — pakai `sips` (image) atau `ffmpeg` (video, scale + `-crf 28` + strip audio kalau nggak perlu) sampai ukuran wajar (puluhan-ratusan KB), baru commit. Jangan commit file asli yang belum dikompres.
