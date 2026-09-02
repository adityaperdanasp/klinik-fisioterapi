"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/schema";
import { getCurrentProfile } from "@/lib/current-user";

export type FormResult = { error?: string };

export async function recordPayment(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  // RLS lama: "admin and resepsionis manage payments".
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin" && profile?.role !== "resepsionis") {
    return { error: "Cuma admin/resepsionis yang bisa catat pembayaran." };
  }

  const bookingId = formData.get("booking_id") as string;
  const patientId = formData.get("patient_id") as string;
  const amount = formData.get("amount") as string;
  const paymentMethod = formData.get("payment_method") as string;

  if (!bookingId || !patientId || !amount || !paymentMethod) {
    return { error: "Semua field wajib diisi." };
  }

  // Doc id = booking id (relasi 1:1, lihat lib/firebase/schema.ts) — pengganti
  // UNIQUE constraint `payments.booking_id` di Postgres.
  await adminDb.collection(COLLECTIONS.payments).doc(bookingId).set({
    patient_id: patientId,
    amount: Number(amount),
    payment_method: paymentMethod,
    paid_at: FieldValue.serverTimestamp(),
    received_by: profile.id,
  });

  revalidatePath("/kasir");
  return {};
}
