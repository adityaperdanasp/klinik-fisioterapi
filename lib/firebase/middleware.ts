import { NextResponse, type NextRequest } from "next/server";
import { verifySessionCookieEdge } from "./edge-verify";
import { SESSION_COOKIE_NAME } from "./session";

export async function updateSession(request: NextRequest) {
  // Landing page publik nggak butuh info auth sama sekali — skip verifikasi
  // biar halaman ini tetap hidup meski Firebase/Firestore lagi bermasalah.
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next({ request });
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
  const claims = sessionCookie
    ? await verifySessionCookieEdge(sessionCookie, projectId)
    : null;

  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  // Halaman aktivasi akun staff (link "set password" dari undangan) — orang
  // yang buka ini justru BELUM punya sesi sama sekali, wajib publik. Beda
  // dari "/set-password" lama (khusus Supabase, udah dihapus total).
  const isInvitePage = request.nextUrl.pathname.startsWith("/undangan/");

  if (!claims && !isLoginPage && !isInvitePage) {
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
  // app/login/page.tsx sendiri, bukan di sini.
  return NextResponse.next({ request });
}
