import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import {
  COLLECTIONS,
  type BookingDoc,
  type PaymentDoc,
  type PhysiotherapistDoc,
  type RoomDoc,
} from "@/lib/firebase/schema";
import { getCurrentProfile } from "@/lib/current-user";
import { getSetting } from "@/lib/settings";
import { RampUpChart } from "./RampUpChart";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return <p className="text-sm text-slate-500">Halaman dashboard khusus admin.</p>;
  }

  const [kapasitasMax, targetBep, rampUpStart] = await Promise.all([
    getSetting("kapasitas_max_sesi_bulan"),
    getSetting("target_bep_sesi_bulan"),
    getSetting("bulan_mulai_operasional"),
  ]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [monthBookingsSnap, physiosSnap, roomsSnap] = await Promise.all([
    adminDb
      .collection(COLLECTIONS.bookings)
      .where("status", "==", "completed")
      .where("starts_at", ">=", Timestamp.fromDate(monthStart))
      .where("starts_at", "<=", Timestamp.fromDate(monthEnd))
      .get(),
    adminDb.collection(COLLECTIONS.physiotherapists).get(),
    adminDb.collection(COLLECTIONS.rooms).get(),
  ]);

  const physioNameById = new Map(
    physiosSnap.docs.map((d) => [d.id, (d.data() as PhysiotherapistDoc).full_name])
  );
  const roomNameById = new Map(roomsSnap.docs.map((d) => [d.id, (d.data() as RoomDoc).name]));

  const monthBookingDocs = monthBookingsSnap.docs;
  const sesiAktualBulanIni = monthBookingDocs.length;
  const kapasitas = Number(kapasitasMax ?? 874);
  const bep = Number(targetBep ?? 290);

  // payments/{bookingId} — batch-get langsung by id (getAll), bukan query.
  const paymentSnaps =
    monthBookingDocs.length > 0
      ? await adminDb.getAll(
          ...monthBookingDocs.map((d) => adminDb.collection(COLLECTIONS.payments).doc(d.id))
        )
      : [];

  const revenueByPhysio = new Map<string, number>();
  const revenueByRoom = new Map<string, number>();
  monthBookingDocs.forEach((d, i) => {
    const b = d.data() as BookingDoc;
    const paymentSnap = paymentSnaps[i];
    const amount = paymentSnap?.exists ? (paymentSnap.data() as PaymentDoc).amount : 0;
    const physioName = physioNameById.get(b.physiotherapist_id) ?? "-";
    const roomName = roomNameById.get(b.room_id) ?? "-";
    revenueByPhysio.set(physioName, (revenueByPhysio.get(physioName) ?? 0) + amount);
    revenueByRoom.set(roomName, (revenueByRoom.get(roomName) ?? 0) + amount);
  });

  const startDate = new Date(`${rampUpStart ?? "2026-08-01"}T00:00:00`);
  const startMonthFirst = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const currentMonthIndex =
    (now.getFullYear() - startMonthFirst.getFullYear()) * 12 +
    (now.getMonth() - startMonthFirst.getMonth()) +
    1;

  const historyBookingsSnap = await adminDb
    .collection(COLLECTIONS.bookings)
    .where("status", "==", "completed")
    .where("starts_at", ">=", Timestamp.fromDate(startMonthFirst))
    .where("starts_at", "<=", Timestamp.fromDate(monthEnd))
    .get();

  const countByMonthKey = new Map<string, number>();
  for (const d of historyBookingsSnap.docs) {
    const b = d.data() as BookingDoc;
    const k = monthKey(b.starts_at.toDate());
    countByMonthKey.set(k, (countByMonthKey.get(k) ?? 0) + 1);
  }

  const rampUpData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const projected = 15 + ((65 - 15) * (month - 1)) / 11;
    let actual: number | null = null;
    if (month <= currentMonthIndex && month >= 1) {
      const d = new Date(startMonthFirst.getFullYear(), startMonthFirst.getMonth() + i, 1);
      const count = countByMonthKey.get(monthKey(d)) ?? 0;
      actual = (count / kapasitas) * 100;
    }
    return { month, actual, projected };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Dashboard Utilisasi &amp; BEP</h1>
        <p className="text-sm text-slate-500">
          {now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Sesi Aktual Bulan Ini</p>
          <p className="text-2xl font-semibold text-slate-900">{sesiAktualBulanIni}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Target BEP</p>
          <p className="text-2xl font-semibold text-slate-900">{bep}</p>
          <p className="text-xs text-slate-400">
            {sesiAktualBulanIni >= bep ? "Sudah tercapai" : `Kurang ${bep - sesiAktualBulanIni} sesi`}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Kapasitas Maksimum</p>
          <p className="text-2xl font-semibold text-slate-900">{kapasitas}</p>
          <p className="text-xs text-slate-400">
            {((sesiAktualBulanIni / kapasitas) * 100).toFixed(1)}% terpakai
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-1 text-sm font-medium text-slate-900">
          Ramp-up Utilisasi: Aktual vs Proyeksi
        </h2>
        <p className="mb-3 text-xs text-slate-400">
          Proyeksi linear 15% → 65% bulan 1–12. Bulan ke-{currentMonthIndex} sejak mulai
          operasional ({rampUpStart}).
        </p>
        <RampUpChart data={rampUpData} />
        <div className="mt-2 flex gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-4 bg-slate-900" /> Aktual
          </span>
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-slate-400" /> Proyeksi
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-900">Revenue per Fisioterapis</h2>
          {revenueByPhysio.size === 0 && (
            <p className="text-sm text-slate-400">Belum ada data bulan ini.</p>
          )}
          <ul className="space-y-1 text-sm">
            {[...revenueByPhysio.entries()].map(([name, amount]) => (
              <li key={name} className="flex justify-between">
                <span className="text-slate-600">{name}</span>
                <span className="font-medium text-slate-900">
                  Rp{amount.toLocaleString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-900">Revenue per Ruang</h2>
          {revenueByRoom.size === 0 && (
            <p className="text-sm text-slate-400">Belum ada data bulan ini.</p>
          )}
          <ul className="space-y-1 text-sm">
            {[...revenueByRoom.entries()].map(([name, amount]) => (
              <li key={name} className="flex justify-between">
                <span className="text-slate-600">{name}</span>
                <span className="font-medium text-slate-900">
                  Rp{amount.toLocaleString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
