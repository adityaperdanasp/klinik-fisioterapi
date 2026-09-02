import "server-only";
import { Timestamp, FieldValue, type WithFieldValue } from "firebase-admin/firestore";
import { adminDb } from "./admin";
import { COLLECTIONS, type BookingDoc } from "./schema";

// Pengganti dua EXCLUDE constraint GiST di Postgres (booking.sql) yang
// mencegah bentrok jadwal fisioterapis DAN ruang. Firestore nggak punya
// constraint kayak gitu, jadi dicek manual di dalam transaction:
//
// - Firestore cuma bisa range-filter (< , >, dst) SATU field per query,
//   jadi query-nya cuma pakai `starts_at < sesi_baru.ends_at` (equality +
//   1 range field ini otomatis ke-cover index bawaan Firestore, nggak perlu
//   bikin composite index manual). Sisa syarat overlap (`ends_at > starts_at`
//   punya sesi baru, dan `status != 'cancelled'`) disaring manual di kode.
// - Query di dalam `runTransaction` otomatis jadi bagian dari read-set
//   transaction itu — kalau ada booking BARU yang match query ini nongol di
//   antara read dan commit (race condition), Firestore bakal retry
//   transaction-nya otomatis. Ini yang bikin cek bentroknya aman dari race,
//   setara constraint level-database di Postgres.
export class BookingConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookingConflictError";
  }
}

export type CreateBookingInput = {
  patient_id: string;
  physiotherapist_id: string;
  room_id: string;
  starts_at: Date;
  ends_at: Date;
  created_by: string | null;
};

async function findOverlap(
  tx: FirebaseFirestore.Transaction,
  field: "physiotherapist_id" | "room_id",
  value: string,
  startsAt: Timestamp,
  endsAt: Timestamp,
  excludeBookingId?: string
): Promise<boolean> {
  const bookingsRef = adminDb.collection(COLLECTIONS.bookings);
  const snap = await tx.get(
    bookingsRef.where(field, "==", value).where("starts_at", "<", endsAt)
  );
  return snap.docs.some((d) => {
    if (d.id === excludeBookingId) return false;
    const b = d.data() as BookingDoc;
    return b.status !== "cancelled" && (b.ends_at as Timestamp).toMillis() > startsAt.toMillis();
  });
}

export async function createBooking(input: CreateBookingInput): Promise<string> {
  if (input.ends_at <= input.starts_at) {
    throw new Error("ends_at harus setelah starts_at.");
  }

  const startsAt = Timestamp.fromDate(input.starts_at);
  const endsAt = Timestamp.fromDate(input.ends_at);
  const bookingsRef = adminDb.collection(COLLECTIONS.bookings);

  return adminDb.runTransaction(async (tx) => {
    const [physioConflict, roomConflict] = await Promise.all([
      findOverlap(tx, "physiotherapist_id", input.physiotherapist_id, startsAt, endsAt),
      findOverlap(tx, "room_id", input.room_id, startsAt, endsAt),
    ]);

    if (physioConflict) {
      throw new BookingConflictError("Fisioterapis ini sudah ada jadwal di jam yang sama.");
    }
    if (roomConflict) {
      throw new BookingConflictError("Ruang ini sudah dipakai di jam yang sama.");
    }

    const newRef = bookingsRef.doc();
    const booking: WithFieldValue<BookingDoc> = {
      patient_id: input.patient_id,
      physiotherapist_id: input.physiotherapist_id,
      room_id: input.room_id,
      starts_at: startsAt,
      ends_at: endsAt,
      status: "scheduled",
      created_by: input.created_by,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };
    tx.set(newRef, booking);
    return newRef.id;
  });
}

// Dipake pas reschedule (ganti jam/fisio/ruang booking yang udah ada) —
// exclude id booking itu sendiri dari cek bentrok.
export async function rescheduleBooking(
  bookingId: string,
  input: Omit<CreateBookingInput, "created_by" | "patient_id">
): Promise<void> {
  if (input.ends_at <= input.starts_at) {
    throw new Error("ends_at harus setelah starts_at.");
  }

  const startsAt = Timestamp.fromDate(input.starts_at);
  const endsAt = Timestamp.fromDate(input.ends_at);
  const bookingRef = adminDb.collection(COLLECTIONS.bookings).doc(bookingId);

  await adminDb.runTransaction(async (tx) => {
    const [physioConflict, roomConflict] = await Promise.all([
      findOverlap(tx, "physiotherapist_id", input.physiotherapist_id, startsAt, endsAt, bookingId),
      findOverlap(tx, "room_id", input.room_id, startsAt, endsAt, bookingId),
    ]);

    if (physioConflict) {
      throw new BookingConflictError("Fisioterapis ini sudah ada jadwal di jam yang sama.");
    }
    if (roomConflict) {
      throw new BookingConflictError("Ruang ini sudah dipakai di jam yang sama.");
    }

    tx.update(bookingRef, {
      physiotherapist_id: input.physiotherapist_id,
      room_id: input.room_id,
      starts_at: startsAt,
      ends_at: endsAt,
      updated_at: FieldValue.serverTimestamp(),
    });
  });
}
