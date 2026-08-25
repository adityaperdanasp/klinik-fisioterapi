"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FormResult = { error?: string };

export async function updateDiagnosis(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  const patientId = formData.get("patient_id") as string;
  const initial_diagnosis = (formData.get("initial_diagnosis") as string) || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("patient_medical_info")
    .upsert({
      patient_id: patientId,
      initial_diagnosis,
      updated_by: user?.id,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/pasien/${patientId}`);
  return {};
}

export async function saveSessionNote(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  const bookingId = formData.get("booking_id") as string;
  const patientId = formData.get("patient_id") as string;
  const complaint = (formData.get("complaint") as string) || null;
  const progress_notes = (formData.get("progress_notes") as string) || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("session_notes").upsert(
    {
      booking_id: bookingId,
      patient_id: patientId,
      complaint,
      progress_notes,
      written_by: user?.id,
    },
    { onConflict: "booking_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/pasien/${patientId}`);
  return {};
}
