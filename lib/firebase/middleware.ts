import { NextResponse, type NextRequest } from "next/server";
import { verifySessionCookieEdge } from "./edge-verify";
import { SESSION_COOKIE_NAME } from "./session";

// Cuma path-path INI yang beneran butuh login (halaman staff/internal).
// SEMUA path lain (termasuk landing page "/", route konvensi Next.js kayak
// /robots.txt|/sitemap.xml|/manifest.webmanifest|/opengraph-image, dan yang
// paling penting: URL SALAH KETIK yang harusnya jadi 404) otomatis PUBLIC,
// nggak perlu dicek sama sekali.
//
// Ini SENGAJA didesain "allow-all-kecuali-yang-di-daftar" (bukan
// "deny-all-kecuali-whitelist" yang dipakai versi sebelumnya) — desain lama
// itu rapuh, ketauan bikin bug berkali-kali (robots.txt, sitemap.xml,
// manifest.webmanifest, opengraph-image ke-redirect ke /login karena lupa
// di-whitelist SATU-SATU), dan bug PALING SERIUS: visitor anonim yang salah
// ketik URL malah ke-redirect ke /login alih-alih lihat halaman 404 biasa —
// membingungkan ("kenapa saya diminta login buat URL yang salah ketik?").
// Kalau nambah halaman internal baru, WAJIB masukin ke daftar ini.
const PROTECTED_PREFIXES = ["/jadwal", "/pasien", "/kasir", "/dashboard", "/pengaturan"];

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!needsAuth) {
    return NextResponse.next({ request });
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
  const claims = sessionCookie
    ? await verifySessionCookieEdge(sessionCookie, projectId)
    : null;

  if (!claims) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Sengaja TIDAK ada "claims truthy di /login -> redirect ke /jadwal" di
  // sini. `claims` cuma keverifikasi signature+expiry (Edge, nggak cek
  // revoke) — kalau cookie-nya udah di-revoke (mis. logout dari device
  // lain) tapi belum expired, redirect kayak gitu bakal ketemu sama
  // app/(app)/layout.tsx yang redirect balik ke /login (dia yang beneran
  // cek revoke), bikin ERR_TOO_MANY_REDIRECTS. Cek "udah login, skip
  // halaman login" yang lebih dipercaya (checkRevoked) ada di
  // app/login/page.tsx sendiri, bukan di sini. (/login sendiri juga nggak
  // masuk PROTECTED_PREFIXES, jadi baris ini nggak akan pernah kena situasi
  // itu — dicatat aja biar nggak keulang salah desain kalau ada yang mau
  // "nyempurnain" logic ini nanti.)
  return NextResponse.next({ request });
}
