"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/firebase/session";

function mapFirebaseAuthError(code?: string): string {
  switch (code) {
    case "EMAIL_NOT_FOUND":
    case "INVALID_PASSWORD":
    case "INVALID_LOGIN_CREDENTIALS":
      return "Email atau password salah.";
    case "USER_DISABLED":
      return "Akun ini dinonaktifkan.";
    default:
      return "Gagal masuk, coba lagi.";
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // NB: redirect() dari next/navigation kerja dengan cara throw internal —
  // jangan dipanggil di dalam try/catch di bawah, nanti ke-tangkep sendiri
  // sama catch-nya. Simpen hasilnya dulu, redirect() dipanggil belakangan.
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  let idToken: string | null = null;
  let errorMessage: string | null = null;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const data = await res.json();

    if (!res.ok) {
      errorMessage = mapFirebaseAuthError(data?.error?.message);
    } else {
      idToken = data.idToken as string;
    }
  } catch {
    errorMessage = "Gagal menghubungi server, coba lagi.";
  }

  if (errorMessage || !idToken) {
    redirect(`/login?error=${encodeURIComponent(errorMessage ?? "Gagal masuk, coba lagi.")}`);
  }

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });

  redirect("/jadwal");
}
