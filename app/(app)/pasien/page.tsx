import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-user";
import { PatientForm } from "./PatientForm";

export default async function PasienPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const canCreate = profile?.role === "admin" || profile?.role === "resepsionis";

  const { data: patients } = await supabase
    .from("patients")
    .select("id, medical_record_number, full_name, phone, date_of_birth")
    .order("full_name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Data Pasien</h1>
        <p className="text-sm text-slate-500">Rekam medis administratif pasien klinik.</p>
      </div>

      {canCreate && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-900">Tambah Pasien</h2>
          <PatientForm />
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">No. RM</th>
              <th className="px-4 py-2 font-medium">Nama</th>
              <th className="px-4 py-2 font-medium">No. HP</th>
              <th className="px-4 py-2 font-medium">Tanggal Lahir</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {(patients ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-400">
                  Belum ada data pasien.
                </td>
              </tr>
            )}
            {(patients ?? []).map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2 text-slate-600">{p.medical_record_number}</td>
                <td className="px-4 py-2 font-medium text-slate-900">{p.full_name}</td>
                <td className="px-4 py-2 text-slate-600">{p.phone ?? "-"}</td>
                <td className="px-4 py-2 text-slate-600">{p.date_of_birth ?? "-"}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/pasien/${p.id}`}
                    className="text-slate-500 hover:text-slate-900"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
