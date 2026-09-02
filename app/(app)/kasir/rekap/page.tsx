import { getCurrentProfile } from "@/lib/current-user";
import { toDateKey } from "@/lib/week";
import { getMonthlyPayments } from "./data";

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  tunai: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
};

export default async function RekapBulananPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (profile?.role === "fisioterapis") {
    return <p className="text-sm text-slate-500">Halaman rekap tidak tersedia untuk role fisioterapis.</p>;
  }

  const { month } = await searchParams;
  const { monthStart, monthKey, paid } = await getMonthlyPayments(month);

  const totalRevenue = paid.reduce((sum, b) => sum + b.payment.amount, 0);

  const byDay = new Map<string, { count: number; revenue: number }>();
  const byMethod = new Map<string, { count: number; revenue: number }>();
  for (const b of paid) {
    const dayKey = toDateKey(new Date(b.starts_at));
    const amount = b.payment.amount;
    const day = byDay.get(dayKey) ?? { count: 0, revenue: 0 };
    day.count += 1;
    day.revenue += amount;
    byDay.set(dayKey, day);

    const method = b.payment.payment_method;
    const m = byMethod.get(method) ?? { count: 0, revenue: 0 };
    m.count += 1;
    m.revenue += amount;
    byMethod.set(method, m);
  }

  const prevMonth = new Date(monthStart);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  const nextMonth = new Date(monthStart);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const prevKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;
  const nextKey = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`;

  const sortedDays = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Rekap Bulanan Kasir</h1>
        <p className="text-sm text-slate-500">
          {monthStart.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <a href={`/kasir/rekap?month=${prevKey}`} className="text-sm text-slate-500 hover:text-slate-900">
          &larr; Bulan sebelumnya
        </a>
        <div className="flex items-center gap-3">
          <a href="/kasir" className="text-sm text-slate-500 hover:text-slate-900">
            Kembali ke Kasir
          </a>
          <a
            href={`/kasir/rekap/export?month=${monthKey}`}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Download CSV
          </a>
        </div>
        <a href={`/kasir/rekap?month=${nextKey}`} className="text-sm text-slate-500 hover:text-slate-900">
          Bulan berikutnya &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total Sesi Terbayar</p>
          <p className="text-2xl font-semibold text-slate-900">{paid.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total Pendapatan</p>
          <p className="text-2xl font-semibold text-slate-900">
            Rp{totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-medium text-slate-900">Per Metode Pembayaran</h2>
        {byMethod.size === 0 && <p className="text-sm text-slate-400">Belum ada data.</p>}
        <ul className="space-y-1 text-sm">
          {[...byMethod.entries()].map(([method, v]) => (
            <li key={method} className="flex justify-between">
              <span className="text-slate-600">
                {PAYMENT_METHOD_LABEL[method] ?? method} ({v.count} sesi)
              </span>
              <span className="font-medium text-slate-900">Rp{v.revenue.toLocaleString("id-ID")}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Tanggal</th>
              <th className="px-4 py-2 font-medium">Sesi Terbayar</th>
              <th className="px-4 py-2 font-medium">Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            {sortedDays.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                  Tidak ada data pembayaran bulan ini.
                </td>
              </tr>
            )}
            {sortedDays.map(([day, v]) => (
              <tr key={day} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2 text-slate-900">
                  {new Date(`${day}T00:00:00`).toLocaleDateString("id-ID", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-2 text-slate-600">{v.count}</td>
                <td className="px-4 py-2 text-slate-900">Rp{v.revenue.toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
