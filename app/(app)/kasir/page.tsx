import { createClient } from "@/lib/supabase/server";
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
  patients: { full_name: string; medical_record_number: string } | null;
  physiotherapists: { full_name: string } | null;
  rooms: { name: string } | null;
};

type PaymentRow = {
  booking_id: string;
  amount: string;
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

  const supabase = await createClient();
  const [bookingsRes, tarifDefault] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        "id, starts_at, status, patient_id, patients(full_name, medical_record_number), physiotherapists(full_name), rooms(name)"
      )
      .gte("starts_at", dayStart.toISOString())
      .lte("starts_at", dayEnd.toISOString())
      .order("starts_at"),
    getSetting("tarif_default"),
  ]);

  const bookings = (bookingsRes.data ?? []) as unknown as BookingRow[];
  const bookingIds = bookings.map((b) => b.id);

  const { data: paymentsData } =
    bookingIds.length > 0
      ? await supabase.from("payments").select("*").in("booking_id", bookingIds)
      : { data: [] as PaymentRow[] };

  const paymentsByBooking = new Map<string, PaymentRow>();
  for (const p of (paymentsData ?? []) as unknown as PaymentRow[]) {
    paymentsByBooking.set(p.booking_id, p);
  }

  const paidBookings = bookings.filter((b) => paymentsByBooking.has(b.id));
  const totalRevenue = paidBookings.reduce(
    (sum, b) => sum + Number(paymentsByBooking.get(b.id)?.amount ?? 0),
    0
  );

  const prevDate = new Date(selectedDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return (
    <div className="space-y-6">
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
                  {formatTime(b.starts_at)} · {b.patients?.full_name} ({b.patients?.medical_record_number})
                </span>
                <span className="text-xs text-slate-500">{STATUS_LABEL[b.status]}</span>
              </div>
              <div className="text-xs text-slate-500">
                {b.physiotherapists?.full_name} · {b.rooms?.name}
              </div>

              {payment && (
                <p className="mt-2 text-xs text-emerald-700">
                  Terbayar Rp{Number(payment.amount).toLocaleString("id-ID")} ·{" "}
                  {PAYMENT_METHOD_LABEL[payment.payment_method]} ·{" "}
                  {new Date(payment.paid_at).toLocaleString("id-ID")}
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
