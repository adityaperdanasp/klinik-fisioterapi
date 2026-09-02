// Verifikasi Firebase session cookie yang Edge-runtime-safe (proxy.ts jalan di
// Edge, firebase-admin nggak bisa dipake di sana karena butuh Node crypto/gRPC).
// Ambil public key dari endpoint resmi Google, cocokkan `kid` di header JWT,
// verifikasi signature + issuer + audience pakai `jose` (WebCrypto-based).
import { decodeProtectedHeader, importX509, jwtVerify } from "jose";

const CERTS_URL =
  "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 jam

let certsCache: { certs: Record<string, string>; fetchedAt: number } | null = null;

async function getCerts(): Promise<Record<string, string>> {
  if (certsCache && Date.now() - certsCache.fetchedAt < CACHE_TTL_MS) {
    return certsCache.certs;
  }
  const res = await fetch(CERTS_URL);
  if (!res.ok) throw new Error(`Gagal fetch public keys Firebase: ${res.status}`);
  const certs = (await res.json()) as Record<string, string>;
  certsCache = { certs, fetchedAt: Date.now() };
  return certs;
}

export type EdgeSessionClaims = {
  uid: string;
  email?: string;
};

export async function verifySessionCookieEdge(
  sessionCookie: string,
  projectId: string
): Promise<EdgeSessionClaims | null> {
  try {
    const { kid } = decodeProtectedHeader(sessionCookie);
    if (!kid) return null;

    const certs = await getCerts();
    const pem = certs[kid];
    if (!pem) return null;

    const publicKey = await importX509(pem, "RS256");
    const { payload } = await jwtVerify(sessionCookie, publicKey, {
      issuer: `https://session.firebase.google.com/${projectId}`,
      audience: projectId,
    });

    if (typeof payload.sub !== "string") return null;
    return { uid: payload.sub, email: payload.email as string | undefined };
  } catch {
    return null;
  }
}
