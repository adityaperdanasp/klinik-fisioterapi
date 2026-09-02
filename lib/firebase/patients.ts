import "server-only";
import { adminDb } from "./admin";
import { COLLECTIONS } from "./schema";

// Pengganti Postgres sequence `patient_mr_seq` (lihat migrations/..._patients...sql).
// Firestore nggak punya auto-increment, jadi pakai counter manual di dalam
// transaction — WAJIB transaction (bukan read-then-write biasa), biar 2
// pasien yang dibikin bersamaan nggak dapet nomor RM yang sama (race).
export async function nextMedicalRecordNumber(): Promise<string> {
  const counterRef = adminDb.collection(COLLECTIONS.counters).doc("patients");

  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists ? (snap.data()!.next as number) : 1;
    tx.set(counterRef, { next: current + 1 }, { merge: true });
    return `RM-${String(current).padStart(4, "0")}`;
  });
}
