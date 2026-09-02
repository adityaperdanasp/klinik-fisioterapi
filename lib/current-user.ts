import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/firebase/session";

export type CurrentProfile = {
  id: string;
  full_name: string;
  role: "admin" | "fisioterapis" | "resepsionis";
};

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  let uid: string;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    uid = decoded.uid;
  } catch {
    return null;
  }

  const snap = await adminDb.collection("profiles").doc(uid).get();
  if (!snap.exists) return null;

  const data = snap.data()!;
  return {
    id: uid,
    full_name: data.full_name,
    role: data.role,
  };
}
