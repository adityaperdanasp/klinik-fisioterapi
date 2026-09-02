"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/schema";
import { createBooking as createBookingRecord, BookingConflictError } from "@/lib/firebase/bookings";
import { getCurrentProfile } from "@/lib/current-user";
import { addSessionMinutes } from "@/lib/week";

export type CreateBookingResult = { error?: string };

export async function createBooking(
  _prev: CreateBookingResult,
  formData: FormData
): Promise<CreateBookingResult> {
  // RLS lama: "admin and resepsionis manage bookings".
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin" && profile?.role !== "resepsionis") {
    return { error: "Cuma admin/resepsionis yang bisa bikin booking." };
  }

  const patientId = formData.get("patient_id") as string;
  const physiotherapistId = formData.get("physiotherapist_id") as string;
  const roomId = formData.get("room_id") as string;
  const startsAt = formData.get("starts_at") as string;

  if (!patientId || !physiotherapistId || !roomId || !startsAt) {
    return { error: "Semua field wajib diisi." };
  }

  const startIso = new Date(startsAt).toISOString();
  const endIso = addSessionMinutes(startIso);

  try {
    await createBookingRecord({
      patient_id: patientId,
      physiotherapist_id: physiotherapistId,
      room_id: roomId,
      starts_at: new Date(startIso),
      ends_at: new Date(endIso),
      created_by: profile.id,
    });
  } catch (err) {
    if (err instanceof BookingConflictError) {
      return { error: err.message };
    }
    return { error: "Gagal bikin booking, coba lagi." };
  }

  revalidatePath("/jadwal");
  return {};
}

export async function updateBookingStatus(
  bookingId: string,
  status: "completed" | "cancelled" | "no_show"
) {
  // RLS lama: "admin and resepsionis manage bookings".
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin" && profile?.role !== "resepsionis") {
    return;
  }

  await adminDb.collection(COLLECTIONS.bookings).doc(bookingId).update({
    status,
    updated_at: FieldValue.serverTimestamp(),
  });

  revalidatePath("/jadwal");
  revalidatePath("/kasir");
}
