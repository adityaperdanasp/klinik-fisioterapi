import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/current-user";
import { InviteForm } from "./InviteForm";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  fisioterapis: "Fisioterapis",
  resepsionis: "Resepsionis",
};

export default async function StaffPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return <p className="text-sm text-slate-500">Halaman ini khusus admin.</p>;
  }

  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at");

  const admin = createAdminClient();
  const { data: usersData } = await admin.auth.admin.listUsers();
  const emailById = new Map((usersData?.users ?? []).map((u) => [u.id, u.email]));
  const confirmedById = new Map(
    (usersData?.users ?? []).map((u) => [u.id, Boolean(u.email_confirmed_at)])
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Staff</h1>
        <p className="text-sm text-slate-500">Kelola akun staff internal klinik.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-medium text-slate-900">Undang Staff Baru</h2>
        <InviteForm />
        <p className="mt-2 text-xs text-slate-400">
          Staff akan menerima email undangan untuk set password sendiri. Kalau email nggak
          sampai, cek konfigurasi email/SMTP di Supabase Dashboard.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Nama</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2 text-slate-900">{p.full_name}</td>
                <td className="px-4 py-2 text-slate-600">{emailById.get(p.id) ?? "-"}</td>
                <td className="px-4 py-2 text-slate-600">{ROLE_LABEL[p.role]}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      confirmedById.get(p.id)
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {confirmedById.get(p.id) ? "Aktif" : "Menunggu Konfirmasi"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
