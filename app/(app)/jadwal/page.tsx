import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-user";
import { DAY_NAMES_ID, formatTime, getWeekRange, toDateKey } from "@/lib/week";
import { BookingForm } from "./BookingForm";
import { BookingStatusActions } from "./BookingStatusActions";

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
  patients: { full_name: string } | null;
  physiotherapists: { full_name: string } | null;
  rooms: { name: string } | null;
};

export default async function JadwalPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const anchor = week ? new Date(`${week}T00:00:00`) : new Date();
  const { monday, sunday, days } = getWeekRange(anchor);

  const supabase = await createClient();
  const profile = await getCurrentProfile();
  const canManageBookings = profile?.role === "admin" || profile?.role === "resepsionis";

  const [bookingsRes, patientsRes, physiosRes, roomsRes] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        "id, starts_at, ends_at, status, patients(full_name), physiotherapists(full_name), rooms(name)"
      )
      .gte("starts_at", monday.toISOString())
      .lte("starts_at", sunday.toISOString())
      .order("starts_at"),
    supabase.from("patients").select("id, full_name, medical_record_number").order("full_name"),
    supabase.from("physiotherapists").select("id, full_name").eq("active", true).order("full_name"),
    supabase.from("rooms").select("id, name").eq("active", true).order("name"),
  ]);

  const bookings = (bookingsRes.data ?? []) as unknown as BookingRow[];

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

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-medium text-slate-900">Tambah Booking</h2>
        <BookingForm
          patients={(patientsRes.data ?? []).map((p) => ({
            id: p.id,
            label: `${p.full_name} (${p.medical_record_number})`,
          }))}
          physiotherapists={(physiosRes.data ?? []).map((p) => ({
            id: p.id,
            label: p.full_name,
          }))}
          rooms={(roomsRes.data ?? []).map((r) => ({ id: r.id, label: r.name }))}
        />
        {(patientsRes.data ?? []).length === 0 && (
          <p className="mt-2 text-xs text-amber-600">
            Belum ada data pasien — halaman manajemen pasien (fitur #2) belum dibuat, jadi
            booking belum bisa dibuat dulu.
          </p>
        )}
      </div>

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
          return (
            <div key={key} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-xs font-medium text-slate-500">{DAY_NAMES_ID[i]}</div>
              <div className="text-sm font-semibold text-slate-900">
                {d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
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
                    <div className="text-slate-600">{b.patients?.full_name}</div>
                    <div className="text-slate-500">
                      {b.physiotherapists?.full_name} · {b.rooms?.name}
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
