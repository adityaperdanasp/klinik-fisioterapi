"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/schema";
import { getCurrentProfile } from "@/lib/current-user";

export type FormResult = { error?: string; inviteLink?: string };

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

  let userId: string;
  try {
    const user = await adminAuth.createUser({ email, displayName: full_name });
    userId = user.uid;
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "auth/email-already-exists") {
      return { error: "Email ini sudah terdaftar sebagai staff." };
    }
    return { error: "Gagal bikin akun staff, coba lagi." };
  }

  await adminDb.collection(COLLECTIONS.profiles).doc(userId).set({
    full_name,
    role,
    created_at: FieldValue.serverTimestamp(),
  });

  // Firebase nggak punya "kirim email undangan" otomatis kayak Supabase —
  // link "set password" ini di-generate terus ditampilin ke admin buat
  // dikirim manual (WA/email) ke staff yang diundang. Belum ada custom
  // action handler (masih pakai halaman hosted default Firebase pas staff
  // klik link-nya) — cukup buat sekarang, bisa dipercantik belakangan.
  let inviteLink: string;
  try {
    inviteLink = await adminAuth.generatePasswordResetLink(email);
  } catch {
    return {
      error:
        "Akun staff berhasil dibuat, tapi gagal generate link undangan. Buka lagi halaman ini buat coba generate ulang.",
    };
  }

  revalidatePath("/pengaturan/staff");
  return { inviteLink };
}
