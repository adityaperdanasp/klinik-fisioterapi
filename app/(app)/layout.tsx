import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/current-user";
import { logout } from "./actions";
import { Logo } from "@/app/components/Logo";

// Font brand yang sama kayak landing page (app/page.tsx) — dipindah ke sini
// biar halaman internal (staff) juga kerasa identitas Pulih Fisioterapi-nya,
// bukan cuma landing page publik doang.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  // proxy.ts (Edge) cuma cek signature+expiry cookie, nggak cek status
  // revoke (network call, mahal per-request) — jadi sesi yang di-revoke
  // (logout dari device lain) masih lolos middleware, baru ketauan di sini
  // (Node runtime, getCurrentProfile() checkRevoked=true). Redirect manual
  // ke /login di sini, jangan biarin render shell kosong yang bingungin.
  if (!profile) {
    redirect("/login");
  }

  return (
    <div
      className={`${fraunces.variable} ${plexSans.variable} app-shell min-h-full flex flex-col`}
      style={{ background: "var(--brand-cream)" }}
    >
      <header
        className="border-b"
        style={{ borderColor: "var(--brand-cream-alt)", background: "#fff" }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Logo size="compact" />
            <nav
              className="ml-6 inline-flex gap-4 text-sm"
              style={{ color: "var(--brand-muted)" }}
            >
              <a href="/jadwal" className="link-muted">
                Jadwal
              </a>
              <a href="/pasien" className="link-muted">
                Pasien
              </a>
              {profile?.role !== "fisioterapis" && (
                <a href="/kasir" className="link-muted">
                  Kasir
                </a>
              )}
              {profile?.role === "admin" && (
                <a href="/dashboard" className="link-muted">
                  Dashboard
                </a>
              )}
              {profile?.role === "admin" && (
                <a href="/pengaturan" className="link-muted">
                  Pengaturan
                </a>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {profile && (
              <span style={{ color: "var(--brand-muted)" }}>
                {profile.full_name}{" "}
                <span style={{ color: "var(--brand-earth)" }}>({profile.role})</span>
              </span>
            )}
            <form action={logout}>
              <button type="submit" className="link-muted">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
