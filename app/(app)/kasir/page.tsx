import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import {
  COLLECTIONS,
  type BookingDoc,
  type PatientDoc,
  type PaymentDoc,
  type PhysiotherapistDoc,
  type RoomDoc,
} from "@/lib/firebase/schema";
import { getCurrentProfile } from "@/lib/current-user";
import { getSetting } from "@/lib/settings";
import { formatTime, toDateKey } from "@/lib/week";
import { PaymentForm } from "./PaymentForm";

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Terjadwal",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  no_show: "Tidak Hadir",
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  tunai: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
};

type BookingRow = {
  id: string;
  starts_at: string;
  status: string;
  patient_id: string;
  patient_name: string | null;
  patient_mr_number: string | null;
  physiotherapist_name: string | null;
  room_name: string | null;
};

type PaymentRow = {
  amount: number;
  payment_method: string;
  paid_at: string;
};

export default async function KasirPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const selectedDate = date ? new Date(`${date}T00:00:00`) : new Date();
  const dateKey = toDateKey(selectedDate);

  const dayStart = new Date(selectedDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(selectedDate);
  dayEnd.setHours(23, 59, 59, 999);

  const profile = await getCurrentProfile();
  if (profile?.role === "fisioterapis") {
    return (
      <p className="text-sm text-slate-500">
        Halaman kasir tidak tersedia untuk role fisioterapis.
      </p>
    );
  }

  const [bookingsSnap, tarifDefault, patientsSnap, physiosSnap, roomsSnap] = await Promise.all([
    adminDb
      .collection(COLLECTIONS.bookings)
      .where("starts_at", ">=", Timestamp.fromDate(dayStart))
      .where("starts_at", "<=", Timestamp.fromDate(dayEnd))
      .orderBy("starts_at")
      .get(),
    getSetting("tarif_default"),
    adminDb.collection(COLLECTIONS.patients).get(),
    adminDb.collection(COLLECTIONS.physiotherapists).get(),
    adminDb.collection(COLLECTIONS.rooms).get(),
  ]);

  const patientById = new Map(
    patientsSnap.docs.map((d) => [d.id, d.data() as PatientDoc])
  );
  const physioNameById = new Map(
    physiosSnap.docs.map((d) => [d.id, (d.data() as PhysiotherapistDoc).full_name])
  );
  const roomNameById = new Map(roomsSnap.docs.map((d) => [d.id, (d.data() as RoomDoc).name]));

  const bookings: BookingRow[] = bookingsSnap.docs.map((d) => {
    const b = d.data() as BookingDoc;
    const patient = patientById.get(b.patient_id);
    return {
      id: d.id,
      starts_at: b.starts_at.toDate().toISOString(),
      status: b.status,
      patient_id: b.patient_id,
      patient_name: patient?.full_name ?? null,
      patient_mr_number: patient?.medical_record_number ?? null,
      physiotherapist_name: physioNameById.get(b.physiotherapist_id) ?? null,
      room_name: roomNameById.get(b.room_id) ?? null,
    };
  });

  // payments/{bookingId} — doc id = booking id, jadi batch-get langsung by id
  // (getAll), bukan query "in" — lebih murah & selalu 1:1 sesuai desain skema.
  const paymentsByBooking = new Map<string, PaymentRow>();
  if (bookings.length > 0) {
    const refs = bookings.map((b) => adminDb.collection(COLLECTIONS.payments).doc(b.id));
    const snaps = await adminDb.getAll(...refs);
    snaps.forEach((snap, i) => {
      if (!snap.exists) return;
      const p = snap.data() as PaymentDoc;
      paymentsByBooking.set(bookings[i].id, {
        amount: p.amount,
        payment_method: p.payment_method,
        paid_at: p.paid_at.toDate().toISOString(),
      });
    });
  }

  const paidBookings = bookings.filter((b) => paymentsByBooking.has(b.id));
  const totalRevenue = paidBookings.reduce(
    (sum, b) => sum + (paymentsByBooking.get(b.id)?.amount ?? 0),
    0
  );

  const prevDate = new Date(selectedDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Kasir</h1>
          <p className="text-sm text-slate-500">
            {selectedDate.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <a href="/kasir/rekap" className="text-sm text-slate-500 hover:text-slate-900">
          Rekap Bulanan &rarr;
        </a>
      </div>

      <div className="flex items-center justify-between">
        <a
          href={`/kasir?date=${toDateKey(prevDate)}`}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          &larr; Hari sebelumnya
        </a>
        <a href={`/kasir?date=${dateKey}`} className="text-sm text-slate-500 hover:text-slate-900">
          Hari ini
        </a>
        <a
          href={`/kasir?date=${toDateKey(nextDate)}`}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Hari berikutnya &rarr;
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Sesi Terbayar</p>
          <p className="text-2xl font-semibold text-slate-900">{paidBookings.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total Pendapatan</p>
          <p className="text-2xl font-semibold text-slate-900">
            Rp{totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {bookings.length === 0 && (
          <p className="text-sm text-slate-400">Tidak ada sesi pada tanggal ini.</p>
        )}
        {bookings.map((b) => {
          const payment = paymentsByBooking.get(b.id);
          return (
            <div key={b.id} className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900">
                  {formatTime(b.starts_at)} · {b.patient_name} ({b.patient_mr_number})
                </span>
                <span className="text-xs text-slate-500">{STATUS_LABEL[b.status]}</span>
              </div>
              <div className="text-xs text-slate-500">
                {b.physiotherapist_name} · {b.room_name}
              </div>

              {payment && (
                <p className="mt-2 text-xs text-emerald-700">
                  Terbayar Rp{payment.amount.toLocaleString("id-ID")} ·{" "}
                  {PAYMENT_METHOD_LABEL[payment.payment_method]} ·{" "}
                  {new Date(payment.paid_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
                </p>
              )}

              {!payment && b.status === "completed" && (
                <PaymentForm
                  bookingId={b.id}
                  patientId={b.patient_id}
                  defaultAmount={tarifDefault ?? "175000"}
                />
              )}

              {!payment && b.status !== "completed" && (
                <p className="mt-2 text-xs text-slate-400">
                  Tandai sesi &quot;Selesai&quot; dulu di halaman Jadwal sebelum bisa dicatat
                  pembayarannya.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
