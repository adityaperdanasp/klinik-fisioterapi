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

  // "/set-password" (khusus alur invite Supabase) udah dihapus — invite
  // staff sekarang pakai link hosted Firebase sendiri, bukan halaman kita.
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  if (!claims && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (claims && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/jadwal";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
