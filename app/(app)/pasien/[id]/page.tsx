import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-user";
import { formatTime } from "@/lib/week";
import { DiagnosisForm } from "./DiagnosisForm";
import { SessionNoteForm } from "./SessionNoteForm";
import { EditPatientForm } from "./EditPatientForm";

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Terjadwal",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  no_show: "Tidak Hadir",
};

type VisitRow = {
  id: string;
  starts_at: string;
  status: string;
  physiotherapists: { full_name: string } | null;
  rooms: { name: string } | null;
  session_notes: { complaint: string | null; progress_notes: string | null } | null;
};

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const canSeeClinical = profile?.role === "admin" || profile?.role === "fisioterapis";
  const canEditPatient = profile?.role === "admin" || profile?.role === "resepsionis";

  const { data: patient } = await supabase
    .from("patients")
    .select(
      "id, medical_record_number, full_name, date_of_birth, gender, phone, address, emergency_contact_name, emergency_contact_phone"
    )
    .eq("id", id)
    .single();

  if (!patient) {
    return <p className="text-sm text-slate-500">Pasien tidak ditemukan.</p>;
  }

  let medicalInfo: { initial_diagnosis: string | null } | null = null;
  let visits: VisitRow[] = [];

  if (canSeeClinical) {
    const [medicalRes, visitsRes] = await Promise.all([
      supabase
        .from("patient_medical_info")
        .select("initial_diagnosis")
        .eq("patient_id", id)
        .maybeSingle(),
      supabase
        .from("bookings")
        .select(
          "id, starts_at, status, physiotherapists(full_name), rooms(name), session_notes(complaint, progress_notes)"
        )
        .eq("patient_id", id)
        .order("starts_at", { ascending: false }),
    ]);
    medicalInfo = medicalRes.data;
    visits = (visitsRes.data ?? []) as unknown as VisitRow[];
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/pasien" className="text-sm text-slate-500 hover:text-slate-900">
          &larr; Daftar Pasien
        </Link>
        <h1 className="mt-1 text-lg font-semibold text-slate-900">{patient.full_name}</h1>
        <p className="text-sm text-slate-500">{patient.medical_record_number}</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-medium text-slate-900">Data Administratif</h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500">Tanggal Lahir</dt>
            <dd className="text-slate-900">{patient.date_of_birth ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Jenis Kelamin</dt>
            <dd className="text-slate-900">
              {patient.gender === "L" ? "Laki-laki" : patient.gender === "P" ? "Perempuan" : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">No. HP</dt>
            <dd className="text-slate-900">{patient.phone ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Alamat</dt>
            <dd className="text-slate-900">{patient.address ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Kontak Darurat</dt>
            <dd className="text-slate-900">
              {patient.emergency_contact_name ?? "-"}
              {patient.emergency_contact_phone ? ` (${patient.emergency_contact_phone})` : ""}
            </dd>
          </div>
        </dl>
        {canEditPatient && (
          <div className="mt-3 border-t border-slate-100 pt-3">
            <EditPatientForm patient={patient} />
          </div>
        )}
      </div>

      {canSeeClinical && (
        <>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-medium text-slate-900">Diagnosa Awal</h2>
            <DiagnosisForm
              patientId={patient.id}
              initialDiagnosis={medicalInfo?.initial_diagnosis ?? ""}
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-medium text-slate-900">Riwayat Kunjungan</h2>
            {visits.length === 0 && (
              <p className="text-sm text-slate-400">Belum ada riwayat kunjungan.</p>
            )}
            <div className="space-y-4">
              {visits.map((v) => {
                const note = v.session_notes;
                return (
                  <div key={v.id} className="rounded-md border border-slate-100 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">
                        {new Date(v.starts_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        · {formatTime(v.starts_at)}
                      </span>
                      <span className="text-xs text-slate-500">{STATUS_LABEL[v.status]}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {v.physiotherapists?.full_name} · {v.rooms?.name}
                    </div>
                    <SessionNoteForm
                      bookingId={v.id}
                      patientId={patient.id}
                      complaint={note?.complaint ?? ""}
                      progressNotes={note?.progress_notes ?? ""}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
