import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-user";
import { getSetting } from "@/lib/settings";
import { RampUpChart } from "./RampUpChart";

type BookingWithPayment = {
  starts_at: string;
  status: string;
  physiotherapists: { full_name: string } | null;
  rooms: { name: string } | null;
  payments: { amount: string } | null;
};

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return <p className="text-sm text-slate-500">Halaman dashboard khusus admin.</p>;
  }

  const supabase = await createClient();
  const [kapasitasMax, targetBep, rampUpStart] = await Promise.all([
    getSetting("kapasitas_max_sesi_bulan"),
    getSetting("target_bep_sesi_bulan"),
    getSetting("bulan_mulai_operasional"),
  ]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const { data: monthBookings } = await supabase
    .from("bookings")
    .select("starts_at, status, physiotherapists(full_name), rooms(name), payments(amount)")
    .eq("status", "completed")
    .gte("starts_at", monthStart.toISOString())
    .lte("starts_at", monthEnd.toISOString());

  const bookings = (monthBookings ?? []) as unknown as BookingWithPayment[];
  const sesiAktualBulanIni = bookings.length;
  const kapasitas = Number(kapasitasMax ?? 874);
  const bep = Number(targetBep ?? 290);

  const revenueByPhysio = new Map<string, number>();
  const revenueByRoom = new Map<string, number>();
  for (const b of bookings) {
    const amount = Number(b.payments?.amount ?? 0);
    const physioName = b.physiotherapists?.full_name ?? "-";
    const roomName = b.rooms?.name ?? "-";
    revenueByPhysio.set(physioName, (revenueByPhysio.get(physioName) ?? 0) + amount);
    revenueByRoom.set(roomName, (revenueByRoom.get(roomName) ?? 0) + amount);
  }

  const startDate = new Date(`${rampUpStart ?? "2026-08-01"}T00:00:00`);
  const startMonthFirst = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const currentMonthIndex =
    (now.getFullYear() - startMonthFirst.getFullYear()) * 12 +
    (now.getMonth() - startMonthFirst.getMonth()) +
    1;

  const { data: historyBookings } = await supabase
    .from("bookings")
    .select("starts_at, status")
    .eq("status", "completed")
    .gte("starts_at", startMonthFirst.toISOString())
    .lte("starts_at", monthEnd.toISOString());

  const countByMonthKey = new Map<string, number>();
  for (const b of historyBookings ?? []) {
    const k = monthKey(new Date(b.starts_at));
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
