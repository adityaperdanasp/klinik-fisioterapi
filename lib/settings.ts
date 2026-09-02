import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, type SettingDoc } from "@/lib/firebase/schema";

export async function getSetting(key: string): Promise<string | null> {
  const snap = await adminDb.collection(COLLECTIONS.settings).doc(key).get();
  if (!snap.exists) return null;
  return (snap.data() as SettingDoc).value;
}
