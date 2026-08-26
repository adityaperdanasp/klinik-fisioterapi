"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/current-user";

export type FormResult = { error?: string };

export async function inviteStaff(_prev: FormResult, formData: FormData): Promise<FormResult> {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return { error: "Hanya admin yang bisa mengundang staff." };
  }

  const email = (formData.get("email") as string)?.trim();
  const full_name = (formData.get("full_name") as string)?.trim();
  const role = formData.get("role") as string;

  if (!email || !full_name || !role) {
    return { error: "Semua field wajib diisi." };
  }
  if (!["admin", "fisioterapis", "resepsionis"].includes(role)) {
    return { error: "Role tidak valid." };
  }

  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const redirectTo = `${protocol}://${host}/set-password`;

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user.id;
  const { error: profileError } = await admin.from("profiles").insert({
    id: userId,
    full_name,
    role,
  });

  if (profileError) {
    return { error: `Undangan terkirim tapi gagal buat profil: ${profileError.message}` };
  }

  revalidatePath("/pengaturan/staff");
  return {};
}
