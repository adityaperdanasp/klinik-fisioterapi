import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/firebase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Matcher ini sengaja LONGGAR (cuma exclude asset internal Next.js) —
  // keputusan "apakah path ini butuh login" udah dipindah ke dalam
  // updateSession() sendiri (lib/firebase/middleware.ts, PROTECTED_PREFIXES),
  // bukan di sini lagi. Dulu matcher ini yang nge-exclude ekstensi file
  // satu-satu (svg/png/jpg/mp4/robots.txt/sitemap.xml/manifest.webmanifest/
  // dst) dan BERKALI-KALI ketinggalan pas ada route/asset baru — sekarang
  // middleware-nya sendiri yang allow-by-default kecuali path match daftar
  // halaman internal, jadi nggak ada lagi yang perlu di-exclude manual di sini.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
