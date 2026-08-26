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

export async function updatePatient(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  const patientId = formData.get("patient_id") as string;
  const full_name = (formData.get("full_name") as string)?.trim();
  const date_of_birth = (formData.get("date_of_birth") as string) || null;
  const gender = (formData.get("gender") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const address = (formData.get("address") as string) || null;
  const emergency_contact_name = (formData.get("emergency_contact_name") as string) || null;
  const emergency_contact_phone = (formData.get("emergency_contact_phone") as string) || null;

  if (!full_name) {
    return { error: "Nama pasien wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("patients")
    .update({
      full_name,
      date_of_birth,
      gender,
      phone,
      address,
      emergency_contact_name,
      emergency_contact_phone,
    })
    .eq("id", patientId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/pasien/${patientId}`);
  revalidatePath("/pasien");
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
