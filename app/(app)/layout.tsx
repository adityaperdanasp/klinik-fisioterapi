import { getCurrentProfile } from "@/lib/current-user";
import { logout } from "./actions";
import { Logo } from "@/app/components/Logo";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Logo size="compact" />
            <nav className="ml-6 inline-flex gap-4 text-sm text-slate-500">
              <a href="/jadwal" className="hover:text-slate-900">
                Jadwal
              </a>
              <a href="/pasien" className="hover:text-slate-900">
                Pasien
              </a>
              {profile?.role !== "fisioterapis" && (
                <a href="/kasir" className="hover:text-slate-900">
                  Kasir
                </a>
              )}
              {profile?.role === "admin" && (
                <a href="/dashboard" className="hover:text-slate-900">
                  Dashboard
                </a>
              )}
              {profile?.role === "admin" && (
                <a href="/pengaturan" className="hover:text-slate-900">
                  Pengaturan
                </a>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {profile && (
              <span className="text-slate-500">
                {profile.full_name} <span className="text-slate-400">({profile.role})</span>
              </span>
            )}
            <form action={logout}>
              <button type="submit" className="text-slate-500 hover:text-slate-900">
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
