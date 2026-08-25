"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { addSessionMinutes } from "@/lib/week";

export type CreateBookingResult = { error?: string };

export async function createBooking(
  _prev: CreateBookingResult,
  formData: FormData
): Promise<CreateBookingResult> {
  const patientId = formData.get("patient_id") as string;
  const physiotherapistId = formData.get("physiotherapist_id") as string;
  const roomId = formData.get("room_id") as string;
  const startsAt = formData.get("starts_at") as string;

  if (!patientId || !physiotherapistId || !roomId || !startsAt) {
    return { error: "Semua field wajib diisi." };
  }

  const startIso = new Date(startsAt).toISOString();
  const endIso = addSessionMinutes(startIso);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("bookings").insert({
    patient_id: patientId,
    physiotherapist_id: physiotherapistId,
    room_id: roomId,
    starts_at: startIso,
    ends_at: endIso,
    created_by: user?.id,
  });

  if (error) {
    if (error.code === "23P01") {
      return {
        error: "Bentrok jadwal: fisioterapis atau ruang sudah dibooking di jam itu.",
      };
    }
    return { error: error.message };
  }

  revalidatePath("/jadwal");
  return {};
}

export async function updateBookingStatus(
  bookingId: string,
  status: "completed" | "cancelled" | "no_show"
) {
  const supabase = await createClient();
  await supabase.from("bookings").update({ status }).eq("id", bookingId);
  revalidatePath("/jadwal");
  revalidatePath("/kasir");
}
