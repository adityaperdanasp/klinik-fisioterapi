import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { Logo } from "./components/Logo";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-display",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

// Halaman 404 ikut identitas brand landing page (cream/earth-tone) — dulu
// generic bawaan Next.js. Ini bisa ke-hit dari mana aja (publik atau nyasar
// dari halaman internal), jadi desainnya sengaja netral, cuma nunjuk balik
// ke beranda.
export default function NotFound() {
  return (
    <div
      className={`${fraunces.variable} ${plexSans.variable} flex min-h-screen flex-col items-center justify-center px-4 text-center`}
      style={{ backgroundColor: "#FAF5EE", color: "#231F1A", fontFamily: "var(--font-body)" }}
    >
      <Logo />
      <p
        className="mt-10 text-7xl sm:text-8xl"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "#7A5D39" }}
      >
        404
      </p>
      <h1 className="mt-4 text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed" style={{ color: "#57503F" }}>
        Alamat yang Anda tuju mungkin salah ketik atau sudah tidak tersedia.
      </p>
      <a
        href="/"
        className="mt-8 inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-white"
        style={{ backgroundColor: "#7A5D39" }}
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
