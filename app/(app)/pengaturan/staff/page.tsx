import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, type ProfileDoc } from "@/lib/firebase/schema";
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

  const [profilesSnap, usersResult] = await Promise.all([
    adminDb.collection(COLLECTIONS.profiles).orderBy("created_at").get(),
    adminAuth.listUsers(),
  ]);

  const emailById = new Map(usersResult.users.map((u) => [u.uid, u.email]));
  // Firebase nggak punya "email_confirmed_at" kayak Supabase — dipakai
  // lastSignInTime (nol/kosong sampai staff-nya beneran login pertama kali
  // pakai password yang mereka set sendiri lewat link undangan) sebagai
  // penanda "sudah aktifin akun" yang setara.
  const hasSignedInById = new Map(
    usersResult.users.map((u) => [u.uid, Boolean(u.metadata.lastSignInTime)])
  );

  const staffList = profilesSnap.docs.map((d) => {
    const data = d.data() as ProfileDoc;
    return { id: d.id, full_name: data.full_name, role: data.role };
  });

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
          Setelah dibuat, link &quot;set password&quot; bakal muncul di sini — copy &amp; kirim
          sendiri ke staff-nya lewat WA atau email.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
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
            {staffList.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2 text-slate-900">{p.full_name}</td>
                <td className="px-4 py-2 text-slate-600">{emailById.get(p.id) ?? "-"}</td>
                <td className="px-4 py-2 text-slate-600">{ROLE_LABEL[p.role]}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      hasSignedInById.get(p.id)
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {hasSignedInById.get(p.id) ? "Aktif" : "Belum Login Pertama"}
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
