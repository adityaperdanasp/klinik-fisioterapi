// Referensi skema Firestore — pengganti tabel Postgres lama (lihat
// supabase/migrations/*.sql buat versi aslinya). Dipake bareng-bareng di
// Fase 5 (rewrite halaman) biar nama koleksi & bentuk field konsisten,
// nggak ada magic string tersebar di banyak file.
//
// Beberapa keputusan desain penting (beda dari Postgres, WAJIB dipahami
// sebelum nulis query/write baru):
//
// - `patient_medical_info/{patientId}` pakai id yang SAMA dengan
//   `patients/{patientId}` — mengganti primary key `patient_id` di Postgres,
//   sekalian jamin relasi 1:1 tanpa perlu query tambahan.
// - `session_notes/{bookingId}` dan `payments/{bookingId}` pakai id booking
//   sebagai document id (bukan id acak) — mengganti UNIQUE constraint di
//   Postgres (`session_notes.booking_id`, `payments.booking_id`), sekalian
//   bikin query "punya catatan/pembayaran belum?" jadi get-by-id, bukan query.
// - `settings/{key}` pakai key aslinya sebagai document id (mis. dokumen
//   `settings/tarif_default`), bukan field terpisah.
// - Nomor rekam medis (dulu Postgres sequence) diganti counter manual di
//   `counters/patients` (field `next: number`), di-increment lewat Firestore
//   transaction pas bikin pasien baru (Fase 5) — WAJIB pakai transaction,
//   jangan read-then-write biasa, biar nggak collision kalau ada race.
// - Anti-bentrok jadwal (dulu EXCLUDE constraint Postgres) belum ada
//   penggantinya di sini — itu scope Fase 4, bookings API baru aman dipakai
//   setelah itu kelar.

export type Role = "admin" | "fisioterapis" | "resepsionis";
export type BookingStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type PaymentMethod = "tunai" | "transfer" | "qris";
export type Gender = "L" | "P";

// Kompatibel sama Timestamp dari `firebase/firestore` (client) maupun
// `firebase-admin/firestore` (server) — dua-duanya punya method ini.
export type TimestampLike = { toDate(): Date };

export const COLLECTIONS = {
  profiles: "profiles",
  rooms: "rooms",
  physiotherapists: "physiotherapists",
  patients: "patients",
  patientMedicalInfo: "patient_medical_info",
  bookings: "bookings",
  sessionNotes: "session_notes",
  payments: "payments",
  settings: "settings",
  counters: "counters",
} as const;

export type ProfileDoc = {
  full_name: string;
  role: Role;
  created_at: TimestampLike;
};

export type RoomDoc = {
  name: string;
  active: boolean;
  created_at: TimestampLike;
};

export type PhysiotherapistDoc = {
  profile_id: string | null;
  full_name: string;
  str_number: string | null;
  active: boolean;
  created_at: TimestampLike;
};

export type PatientDoc = {
  medical_record_number: string; // format "RM-0001", lihat counters/patients
  full_name: string;
  date_of_birth: string | null; // "YYYY-MM-DD", bukan Timestamp — cuma tanggal
  gender: Gender | null;
  phone: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_by: string | null; // uid dari profiles
  created_at: TimestampLike;
  updated_at: TimestampLike;
};

// Doc id = patient id (relasi 1:1, lihat catatan di atas).
export type PatientMedicalInfoDoc = {
  initial_diagnosis: string | null;
  updated_by: string | null;
  updated_at: TimestampLike;
};

export type BookingDoc = {
  patient_id: string;
  physiotherapist_id: string;
  room_id: string;
  starts_at: TimestampLike;
  ends_at: TimestampLike;
  status: BookingStatus;
  created_by: string | null;
  created_at: TimestampLike;
  updated_at: TimestampLike;
};

// Doc id = booking id (relasi 1:1, lihat catatan di atas).
export type SessionNoteDoc = {
  patient_id: string;
  complaint: string | null;
  progress_notes: string | null;
  written_by: string | null;
  created_at: TimestampLike;
  updated_at: TimestampLike;
};

// Doc id = booking id (relasi 1:1, lihat catatan di atas).
export type PaymentDoc = {
  patient_id: string;
  amount: number;
  payment_method: PaymentMethod;
  paid_at: TimestampLike;
  received_by: string | null;
  created_at: TimestampLike;
};

// Doc id = key aslinya, mis. settings/tarif_default.
export type SettingDoc = {
  value: string;
  description: string | null;
  updated_by: string | null;
  updated_at: TimestampLike;
};

// counters/patients — dipake buat generate medical_record_number berurutan.
export type PatientCounterDoc = {
  next: number;
};
