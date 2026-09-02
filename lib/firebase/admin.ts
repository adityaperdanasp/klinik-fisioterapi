import "server-only";
import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Pakai service account (Admin SDK) — akses penuh, bypass Firestore Security
// Rules sepenuhnya. Sama sensitifnya kayak SUPABASE_SERVICE_ROLE_KEY lama:
// jangan pernah import file ini dari Client Component atau expose hasilnya
// ke browser. Cuma boleh dipake dari Server Component / Route Handler / Server Action.
function getAdminApp(): App {
  if (getApps().length) return getApp();

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const adminApp = getAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
