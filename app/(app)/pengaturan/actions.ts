"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/schema";
import { getCurrentProfile } from "@/lib/current-user";

export type FormResult = { error?: string };

async function requireAdmin() {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}

export async function createRoom(_prev: FormResult, formData: FormData): Promise<FormResult> {
  // RLS lama: "admin manages rooms".
  if (!(await requireAdmin())) return { error: "Cuma admin yang bisa nambah ruang." };

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Nama ruang wajib diisi." };

  await adminDb.collection(COLLECTIONS.rooms).add({
    name,
    active: true,
    created_at: FieldValue.serverTimestamp(),
  });

  revalidatePath("/pengaturan");
  return {};
}

export async function toggleRoomActive(roomId: string, active: boolean) {
  if (!(await requireAdmin())) return;

  await adminDb.collection(COLLECTIONS.rooms).doc(roomId).update({ active });
  revalidatePath("/pengaturan");
  revalidatePath("/jadwal");
}

export async function createPhysio(_prev: FormResult, formData: FormData): Promise<FormResult> {
  // RLS lama: "admin manages physiotherapists".
  if (!(await requireAdmin())) return { error: "Cuma admin yang bisa nambah fisioterapis." };

  const full_name = (formData.get("full_name") as string)?.trim();
  const str_number = (formData.get("str_number") as string)?.trim() || null;
  if (!full_name) return { error: "Nama fisioterapis wajib diisi." };

  await adminDb.collection(COLLECTIONS.physiotherapists).add({
    profile_id: null,
    full_name,
    str_number,
    active: true,
    created_at: FieldValue.serverTimestamp(),
  });

  revalidatePath("/pengaturan");
  return {};
}

export async function togglePhysioActive(physioId: string, active: boolean) {
  if (!(await requireAdmin())) return;

  await adminDb.collection(COLLECTIONS.physiotherapists).doc(physioId).update({ active });
  revalidatePath("/pengaturan");
  revalidatePath("/jadwal");
}
