import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/firebase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // robots.txt & sitemap.xml itu ROUTE DINAMIS (app/robots.ts, app/sitemap.ts),
  // bukan file statis di /public — jadi nggak ketangkep exclude ekstensi di
  // bawah (yang cuma buat file gambar/video). Tanpa exclude eksplisit ini,
  // crawler (nggak punya session cookie) bakal di-redirect ke /login, sama
  // persis kayak bug video .mp4 yang pernah kejadian (lihat gotcha CLAUDE.md).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|mov)$).*)",
  ],
};
