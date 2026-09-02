"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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
  // dikirim manual (WA/email) ke staff yang diundang.
  //
  // Catatan: `actionCodeSettings.handleCodeInApp` TERNYATA nggak bikin
  // generatePasswordResetLink() langsung ngarah ke app kita (beda dari
  // generateSignInWithEmailLink yang emang didesain gitu) — link yang
  // dibalikin tetep ke halaman hosted Firebase
  // (pulih-fisioterapi.firebaseapp.com/__/auth/action), cuma nambahin
  // `continueUrl`. Solusinya: extract `oobCode`-nya manual dari link yang
  // Firebase kasih, terus susun sendiri URL ke halaman kita
  // (app/undangan/set-password/page.tsx) — verifyPasswordResetCode() dan
  // confirmPasswordReset() di client SDK cuma butuh oobCode mentah, nggak
  // peduli URL apa yang "membungkusnya".
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";

  let inviteLink: string;
  try {
    const firebaseLink = await adminAuth.generatePasswordResetLink(email);
    const oobCode = new URL(firebaseLink).searchParams.get("oobCode");
    if (!oobCode) throw new Error("oobCode tidak ditemukan di link Firebase.");
    inviteLink = `${protocol}://${host}/undangan/set-password?oobCode=${oobCode}`;
  } catch {
    return {
      error:
        "Akun staff berhasil dibuat, tapi gagal generate link undangan. Buka lagi halaman ini buat coba generate ulang.",
    };
  }

  revalidatePath("/pengaturan/staff");
  return { inviteLink };
}
