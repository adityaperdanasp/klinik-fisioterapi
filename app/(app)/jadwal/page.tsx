import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import {
  COLLECTIONS,
  type BookingDoc,
  type PatientDoc,
  type PhysiotherapistDoc,
  type RoomDoc,
} from "@/lib/firebase/schema";
import { getCurrentProfile } from "@/lib/current-user";
import { DAY_NAMES_ID, formatTime, getWeekRange, toDateKey } from "@/lib/week";
import { BookingForm } from "./BookingForm";
import { BookingStatusActions } from "./BookingStatusActions";
import { DayTimeline, type TimelineBooking } from "./DayTimeline";

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Terjadwal",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  no_show: "Tidak Hadir",
};

type BookingRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  patient_name: string | null;
  physiotherapist_name: string | null;
  room_name: string | null;
};

export default async function JadwalPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const anchor = week ? new Date(`${week}T00:00:00`) : new Date();
  const { monday, sunday, days } = getWeekRange(anchor);

  const profile = await getCurrentProfile();
  const canManageBookings = profile?.role === "admin" || profile?.role === "resepsionis";

  const [bookingsSnap, patientsSnap, physiosSnap, roomsSnap] = await Promise.all([
    adminDb
      .collection(COLLECTIONS.bookings)
      .where("starts_at", ">=", Timestamp.fromDate(monday))
      .where("starts_at", "<=", Timestamp.fromDate(sunday))
      .orderBy("starts_at")
      .get(),
    adminDb.collection(COLLECTIONS.patients).orderBy("full_name").get(),
    adminDb
      .collection(COLLECTIONS.physiotherapists)
      .where("active", "==", true)
      .orderBy("full_name")
      .get(),
    adminDb.collection(COLLECTIONS.rooms).where("active", "==", true).orderBy("name").get(),
  ]);

  const patients = patientsSnap.docs.map((d) => {
    const data = d.data() as PatientDoc;
    return { id: d.id, full_name: data.full_name, medical_record_number: data.medical_record_number };
  });
  const physiotherapists = physiosSnap.docs.map((d) => {
    const data = d.data() as PhysiotherapistDoc;
    return { id: d.id, full_name: data.full_name };
  });
  const rooms = roomsSnap.docs.map((d) => {
    const data = d.data() as RoomDoc;
    return { id: d.id, name: data.name };
  });

  // Firestore nggak punya join — bikin Map id->nama sekali, dipake buat semua booking.
  const physioNameById = new Map(physiotherapists.map((p) => [p.id, p.full_name]));
  const roomNameById = new Map(rooms.map((r) => [r.id, r.name]));
  const patientNameById = new Map(patients.map((p) => [p.id, p.full_name]));

  const bookings: BookingRow[] = bookingsSnap.docs.map((d) => {
    const b = d.data() as BookingDoc;
    return {
      id: d.id,
      starts_at: b.starts_at.toDate().toISOString(),
      ends_at: b.ends_at.toDate().toISOString(),
      status: b.status,
      patient_name: patientNameById.get(b.patient_id) ?? null,
      physiotherapist_name: physioNameById.get(b.physiotherapist_id) ?? null,
      room_name: roomNameById.get(b.room_id) ?? null,
    };
  });

  const bookingsByDay = new Map<string, BookingRow[]>();
  for (const b of bookings) {
    const key = toDateKey(new Date(b.starts_at));
    bookingsByDay.set(key, [...(bookingsByDay.get(key) ?? []), b]);
  }

  const prevWeek = new Date(monday);
  prevWeek.setDate(prevWeek.getDate() - 7);
  const nextWeek = new Date(monday);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Jadwal &amp; Booking</h1>
        <p className="text-sm text-slate-500">
          {monday.toLocaleDateString("id-ID", { day: "numeric", month: "long" })} –{" "}
          {sunday.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {canManageBookings && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-900">Tambah Booking</h2>
          <BookingForm
            patients={patients.map((p) => ({
              id: p.id,
              label: `${p.full_name} (${p.medical_record_number})`,
            }))}
            physiotherapists={physiotherapists.map((p) => ({ id: p.id, label: p.full_name }))}
            rooms={rooms.map((r) => ({ id: r.id, label: r.name }))}
          />
          {patients.length === 0 && (
            <p className="mt-2 text-xs text-amber-600">
              Belum ada data pasien — tambahkan dulu di halaman{" "}
              <a href="/pasien" className="underline">
                Data Pasien
              </a>{" "}
              sebelum bisa bikin booking.
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <a
          href={`/jadwal?week=${toDateKey(prevWeek)}`}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          &larr; Minggu sebelumnya
        </a>
        <a
          href={`/jadwal?week=${toDateKey(nextWeek)}`}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Minggu berikutnya &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
        {days.map((d, i) => {
          const key = toDateKey(d);
          const dayBookings = bookingsByDay.get(key) ?? [];
          const timelineBookings: TimelineBooking[] = dayBookings.map((b) => ({
            id: b.id,
            startsAt: b.starts_at,
            endsAt: b.ends_at,
            status: b.status,
            patientName: b.patient_name,
            physioName: b.physiotherapist_name,
            roomName: b.room_name,
          }));

          return (
            <div key={key} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-xs font-medium text-slate-500">{DAY_NAMES_ID[i]}</div>
              <div className="text-sm font-semibold text-slate-900">
                {d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              </div>

              {/* Timeline visual "sekilas" — biar langsung kebaca jam mana yang
                  padat, tanpa perlu baca satu-satu daftar teks di bawahnya. */}
              <div className="mt-2">
                <DayTimeline bookings={timelineBookings} height={130} hourStep={4} />
              </div>

              <div className="mt-2 space-y-2">
                {dayBookings.length === 0 && (
                  <p className="text-xs text-slate-400">Kosong</p>
                )}
                {dayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-md border border-slate-100 bg-slate-50 p-2 text-xs"
                  >
                    <div className="font-medium text-slate-900">
                      {formatTime(b.starts_at)}–{formatTime(b.ends_at)}
                    </div>
                    <div className="text-slate-600">{b.patient_name}</div>
                    <div className="text-slate-500">
                      {b.physiotherapist_name} · {b.room_name}
                    </div>
                    <div className="text-slate-400">{STATUS_LABEL[b.status]}</div>
                    {canManageBookings && b.status === "scheduled" && (
                      <BookingStatusActions bookingId={b.id} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
