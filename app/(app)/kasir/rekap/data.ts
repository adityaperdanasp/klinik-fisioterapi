import { createClient } from "@/lib/supabase/server";

export type PaidBooking = {
  id: string;
  starts_at: string;
  patients: { full_name: string; medical_record_number: string } | null;
  physiotherapists: { full_name: string } | null;
  rooms: { name: string } | null;
  payments: {
    amount: string;
    payment_method: string;
    paid_at: string;
  } | null;
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
  const supabase = await createClient();

  const { data } = await supabase
    .from("bookings")
    .select(
      "id, starts_at, patients(full_name, medical_record_number), physiotherapists(full_name), rooms(name), payments(amount, payment_method, paid_at)"
    )
    .eq("status", "completed")
    .gte("starts_at", monthStart.toISOString())
    .lte("starts_at", monthEnd.toISOString())
    .order("starts_at");

  const bookings = (data ?? []) as unknown as PaidBooking[];
  const paid = bookings.filter((b) => b.payments !== null);

  return { monthStart, monthEnd, monthKey, paid };
}
