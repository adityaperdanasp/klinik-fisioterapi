"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FormResult = { error?: string };

export async function createRoom(_prev: FormResult, formData: FormData): Promise<FormResult> {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "Nama ruang wajib diisi." };

  const supabase = await createClient();
  const { error } = await supabase.from("rooms").insert({ name });
  if (error) return { error: error.message };

  revalidatePath("/pengaturan");
  return {};
}

export async function toggleRoomActive(roomId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("rooms").update({ active }).eq("id", roomId);
  revalidatePath("/pengaturan");
  revalidatePath("/jadwal");
}

export async function createPhysio(_prev: FormResult, formData: FormData): Promise<FormResult> {
  const full_name = (formData.get("full_name") as string)?.trim();
  const str_number = (formData.get("str_number") as string)?.trim() || null;
  if (!full_name) return { error: "Nama fisioterapis wajib diisi." };

  const supabase = await createClient();
  const { error } = await supabase.from("physiotherapists").insert({ full_name, str_number });
  if (error) return { error: error.message };

  revalidatePath("/pengaturan");
  return {};
}

export async function togglePhysioActive(physioId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("physiotherapists").update({ active }).eq("id", physioId);
  revalidatePath("/pengaturan");
  revalidatePath("/jadwal");
}
