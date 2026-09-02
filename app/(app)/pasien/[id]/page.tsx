import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import {
  COLLECTIONS,
  type BookingDoc,
  type PatientDoc,
  type PatientMedicalInfoDoc,
  type PhysiotherapistDoc,
  type RoomDoc,
  type SessionNoteDoc,
} from "@/lib/firebase/schema";
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
  physiotherapist_name: string | null;
  room_name: string | null;
  complaint: string | null;
  progress_notes: string | null;
};

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  const canSeeClinical = profile?.role === "admin" || profile?.role === "fisioterapis";
  const canEditPatient = profile?.role === "admin" || profile?.role === "resepsionis";

  const patientSnap = await adminDb.collection(COLLECTIONS.patients).doc(id).get();
  if (!patientSnap.exists) {
    return <p className="text-sm text-slate-500">Pasien tidak ditemukan.</p>;
  }
  const patientData = patientSnap.data() as PatientDoc;
  // Cuma field yang plain-serializable (bukan Timestamp) yang boleh nyebrang
  // ke Client Component (EditPatientForm) — created_at/updated_at/created_by
  // sengaja di-drop di sini, nggak dipakai form itu juga.
  const patient = {
    id: patientSnap.id,
    medical_record_number: patientData.medical_record_number,
    full_name: patientData.full_name,
    date_of_birth: patientData.date_of_birth,
    gender: patientData.gender,
    phone: patientData.phone,
    address: patientData.address,
    emergency_contact_name: patientData.emergency_contact_name,
    emergency_contact_phone: patientData.emergency_contact_phone,
  };

  let medicalInfo: PatientMedicalInfoDoc | null = null;
  let visits: VisitRow[] = [];

  if (canSeeClinical) {
    const [medicalSnap, bookingsSnap, physiosSnap, roomsSnap] = await Promise.all([
      adminDb.collection(COLLECTIONS.patientMedicalInfo).doc(id).get(),
      adminDb
        .collection(COLLECTIONS.bookings)
        .where("patient_id", "==", id)
        .orderBy("starts_at", "desc")
        .get(),
      adminDb.collection(COLLECTIONS.physiotherapists).get(),
      adminDb.collection(COLLECTIONS.rooms).get(),
    ]);

    medicalInfo = medicalSnap.exists ? (medicalSnap.data() as PatientMedicalInfoDoc) : null;

    const physioNameById = new Map(
      physiosSnap.docs.map((d) => [d.id, (d.data() as PhysiotherapistDoc).full_name])
    );
    const roomNameById = new Map(roomsSnap.docs.map((d) => [d.id, (d.data() as RoomDoc).name]));

    // session_notes/{bookingId} — 1 dokumen per booking, ambil sekaligus
    // (bukan satu-satu di loop) pakai getAll biar cuma 1 round-trip.
    const bookingDocs = bookingsSnap.docs;
    const noteRefs = bookingDocs.map((d) =>
      adminDb.collection(COLLECTIONS.sessionNotes).doc(d.id)
    );
    const noteSnaps = noteRefs.length > 0 ? await adminDb.getAll(...noteRefs) : [];

    visits = bookingDocs.map((d, i) => {
      const b = d.data() as BookingDoc;
      const noteSnap = noteSnaps[i];
      const note = noteSnap?.exists ? (noteSnap.data() as SessionNoteDoc) : null;
      return {
        id: d.id,
        starts_at: b.starts_at.toDate().toISOString(),
        status: b.status,
        physiotherapist_name: physioNameById.get(b.physiotherapist_id) ?? null,
        room_name: roomNameById.get(b.room_id) ?? null,
        complaint: note?.complaint ?? null,
        progress_notes: note?.progress_notes ?? null,
      };
    });
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
              {visits.map((v) => (
                <div key={v.id} className="rounded-md border border-slate-100 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">
                      {new Date(v.starts_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "Asia/Jakarta",
                      })}{" "}
                      · {formatTime(v.starts_at)}
                    </span>
                    <span className="text-xs text-slate-500">{STATUS_LABEL[v.status]}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {v.physiotherapist_name} · {v.room_name}
                  </div>
                  <SessionNoteForm
                    bookingId={v.id}
                    patientId={patient.id}
                    complaint={v.complaint ?? ""}
                    progressNotes={v.progress_notes ?? ""}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
