"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FormResult = { error?: string };

export async function createPatient(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  const full_name = formData.get("full_name") as string;
  const date_of_birth = (formData.get("date_of_birth") as string) || null;
  const gender = (formData.get("gender") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const address = (formData.get("address") as string) || null;
  const emergency_contact_name = (formData.get("emergency_contact_name") as string) || null;
  const emergency_contact_phone = (formData.get("emergency_contact_phone") as string) || null;

  if (!full_name?.trim()) {
    return { error: "Nama pasien wajib diisi." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("patients").insert({
    full_name: full_name.trim(),
    date_of_birth,
    gender,
    phone,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    created_by: user?.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/pasien");
  return {};
}
