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

export type PaidBooking = {
  id: string;
  starts_at: string;
  patient_name: string | null;
  patient_mr_number: string | null;
  physiotherapist_name: string | null;
  room_name: string | null;
  payment: {
    amount: number;
    payment_method: string;
    paid_at: string;
  };
};

export function getMonthRange(monthParam: string | undefined) {
  const now = new Date();
  const [y, m] = monthParam
    ? monthParam.split("-").map(Number)
    : [now.getFullYear(), now.getMonth() + 1];
  const monthStart = new Date(y, m - 1, 1);
  const monthEnd = new Date(y, m, 0, 23, 59, 59, 999);
  const monthKey = `${y}-${String(m).padStart(2, "0")}`;
  return { monthStart, monthEnd, monthKey };
}

export async function getMonthlyPayments(monthParam: string | undefined) {
  const { monthStart, monthEnd, monthKey } = getMonthRange(monthParam);

  const [bookingsSnap, patientsSnap, physiosSnap, roomsSnap] = await Promise.all([
    adminDb
      .collection(COLLECTIONS.bookings)
      .where("status", "==", "completed")
      .where("starts_at", ">=", Timestamp.fromDate(monthStart))
      .where("starts_at", "<=", Timestamp.fromDate(monthEnd))
      .orderBy("starts_at")
      .get(),
    adminDb.collection(COLLECTIONS.patients).get(),
    adminDb.collection(COLLECTIONS.physiotherapists).get(),
    adminDb.collection(COLLECTIONS.rooms).get(),
  ]);

  const patientById = new Map(patientsSnap.docs.map((d) => [d.id, d.data() as PatientDoc]));
  const physioNameById = new Map(
    physiosSnap.docs.map((d) => [d.id, (d.data() as PhysiotherapistDoc).full_name])
  );
  const roomNameById = new Map(roomsSnap.docs.map((d) => [d.id, (d.data() as RoomDoc).name]));

  const bookingDocs = bookingsSnap.docs;
  const paymentSnaps =
    bookingDocs.length > 0
      ? await adminDb.getAll(
          ...bookingDocs.map((d) => adminDb.collection(COLLECTIONS.payments).doc(d.id))
        )
      : [];

  const paid: PaidBooking[] = [];
  bookingDocs.forEach((d, i) => {
    const paymentSnap = paymentSnaps[i];
    if (!paymentSnap?.exists) return; // cuma sesi yang UDAH dibayar masuk rekap

    const b = d.data() as BookingDoc;
    const p = paymentSnap.data() as PaymentDoc;
    const patient = patientById.get(b.patient_id);

    paid.push({
      id: d.id,
      starts_at: b.starts_at.toDate().toISOString(),
      patient_name: patient?.full_name ?? null,
      patient_mr_number: patient?.medical_record_number ?? null,
      physiotherapist_name: physioNameById.get(b.physiotherapist_id) ?? null,
      room_name: roomNameById.get(b.room_id) ?? null,
      payment: {
        amount: p.amount,
        payment_method: p.payment_method,
        paid_at: p.paid_at.toDate().toISOString(),
      },
    });
  });

  return { monthStart, monthEnd, monthKey, paid };
}
