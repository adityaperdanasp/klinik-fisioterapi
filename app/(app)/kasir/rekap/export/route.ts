import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/current-user";
import { getMonthlyPayments } from "../data";

function csvEscape(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role === "fisioterapis") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const month = request.nextUrl.searchParams.get("month") ?? undefined;
  const { monthKey, paid } = await getMonthlyPayments(month);

  const header = ["Tanggal", "Pasien", "No. RM", "Fisioterapis", "Ruang", "Nominal", "Metode", "Waktu Bayar"];
  const rows = paid.map((b) => [
    new Date(b.starts_at).toLocaleDateString("id-ID"),
    b.patients?.full_name ?? "",
    b.patients?.medical_record_number ?? "",
    b.physiotherapists?.full_name ?? "",
    b.rooms?.name ?? "",
    b.payments?.amount ?? "0",
    b.payments?.payment_method ?? "",
    b.payments?.paid_at ? new Date(b.payments.paid_at).toLocaleString("id-ID") : "",
  ]);

  const csv = [header, ...rows].map((row) => row.map((c) => csvEscape(String(c))).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rekap-kasir-${monthKey}.csv"`,
    },
  });
}
