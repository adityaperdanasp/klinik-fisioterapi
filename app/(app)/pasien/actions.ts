"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/schema";
import { nextMedicalRecordNumber } from "@/lib/firebase/patients";
import { getCurrentProfile } from "@/lib/current-user";

export type FormResult = { error?: string };

export async function createPatient(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  // Dulu ditegakkan RLS Postgres ("admin and resepsionis manage patients"),
  // sekarang Admin SDK bypass semua rules — jadi cek role manual di sini.
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin" && profile?.role !== "resepsionis") {
    return { error: "Cuma admin/resepsionis yang bisa nambah pasien." };
  }

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

  const medical_record_number = await nextMedicalRecordNumber();

  await adminDb.collection(COLLECTIONS.patients).add({
    medical_record_number,
    full_name: full_name.trim(),
    date_of_birth,
    gender,
    phone,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    created_by: profile.id,
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  });

  revalidatePath("/pasien");
  return {};
}
