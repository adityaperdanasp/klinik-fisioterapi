"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/schema";
import { getCurrentProfile } from "@/lib/current-user";

export type FormResult = { error?: string };

export async function updateDiagnosis(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  // RLS lama: "clinical staff manage medical info" — admin + fisioterapis.
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin" && profile?.role !== "fisioterapis") {
    return { error: "Cuma admin/fisioterapis yang bisa ubah diagnosa." };
  }

  const patientId = formData.get("patient_id") as string;
  const initial_diagnosis = (formData.get("initial_diagnosis") as string) || null;

  await adminDb.collection(COLLECTIONS.patientMedicalInfo).doc(patientId).set(
    {
      initial_diagnosis,
      updated_by: profile.id,
      updated_at: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  revalidatePath(`/pasien/${patientId}`);
  return {};
}

export async function updatePatient(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  // RLS lama: "admin and resepsionis manage patients".
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin" && profile?.role !== "resepsionis") {
    return { error: "Cuma admin/resepsionis yang bisa ubah data pasien." };
  }

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

  await adminDb.collection(COLLECTIONS.patients).doc(patientId).update({
    full_name,
    date_of_birth,
    gender,
    phone,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    updated_at: FieldValue.serverTimestamp(),
  });

  revalidatePath(`/pasien/${patientId}`);
  revalidatePath("/pasien");
  return {};
}

export async function saveSessionNote(
  _prev: FormResult,
  formData: FormData
): Promise<FormResult> {
  // RLS lama: "clinical staff manage session notes" — admin + fisioterapis.
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin" && profile?.role !== "fisioterapis") {
    return { error: "Cuma admin/fisioterapis yang bisa nulis catatan sesi." };
  }

  const bookingId = formData.get("booking_id") as string;
  const patientId = formData.get("patient_id") as string;
  const complaint = (formData.get("complaint") as string) || null;
  const progress_notes = (formData.get("progress_notes") as string) || null;

  // Doc id = booking id (relasi 1:1, lihat lib/firebase/schema.ts) — upsert
  // lewat set({ merge: true }) pengganti `.upsert(..., { onConflict })` Supabase.
  // `created_at` cuma diisi pas dokumennya belum ada — kalau langsung
  // include di tiap merge, created_at bakal ke-reset tiap kali user edit
  // catatan yang udah ada (beda dari perilaku upsert Postgres aslinya).
  const noteRef = adminDb.collection(COLLECTIONS.sessionNotes).doc(bookingId);
  const existing = await noteRef.get();

  await noteRef.set(
    {
      patient_id: patientId,
      complaint,
      progress_notes,
      written_by: profile.id,
      ...(existing.exists ? {} : { created_at: FieldValue.serverTimestamp() }),
      updated_at: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  revalidatePath(`/pasien/${patientId}`);
  return {};
}
