"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FormResult = { error?: string };

export async function recordPayment(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  const bookingId = formData.get("booking_id") as string;
  const patientId = formData.get("patient_id") as string;
  const amount = formData.get("amount") as string;
  const paymentMethod = formData.get("payment_method") as string;

  if (!bookingId || !patientId || !amount || !paymentMethod) {
    return { error: "Semua field wajib diisi." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("payments").insert({
    booking_id: bookingId,
    patient_id: patientId,
    amount: Number(amount),
    payment_method: paymentMethod,
    received_by: user?.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/kasir");
  return {};
}
