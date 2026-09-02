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
    b.patient_name ?? "",
    b.patient_mr_number ?? "",
    b.physiotherapist_name ?? "",
    b.room_name ?? "",
    String(b.payment.amount),
    b.payment.payment_method,
    new Date(b.payment.paid_at).toLocaleString("id-ID"),
  ]);

  const csv = [header, ...rows].map((row) => row.map((c) => csvEscape(String(c))).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rekap-kasir-${monthKey}.csv"`,
    },
  });
}
