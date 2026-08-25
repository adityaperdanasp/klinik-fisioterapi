"use client";

import { useActionState } from "react";
import { recordPayment, type FormResult } from "./actions";

export function PaymentForm({
  bookingId,
  patientId,
  defaultAmount,
}: {
  bookingId: string;
  patientId: string;
  defaultAmount: string;
}) {
  const [state, formAction, pending] = useActionState<FormResult, FormData>(
    recordPayment,
    {}
  );

  return (
    <form action={formAction} className="mt-2 flex flex-wrap items-end gap-2">
      <input type="hidden" name="booking_id" value={bookingId} />
      <input type="hidden" name="patient_id" value={patientId} />
      <div>
        <label className="block text-xs font-medium text-slate-600">Nominal (Rp)</label>
        <input
          type="number"
          name="amount"
          defaultValue={defaultAmount}
          min="0"
          step="1000"
          required
          className="mt-1 w-32 rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Metode</label>
        <select
          name="payment_method"
          required
          className="mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900"
        >
          <option value="tunai">Tunai</option>
          <option value="transfer">Transfer</option>
          <option value="qris">QRIS</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {pending ? "Menyimpan..." : "Catat Bayar"}
      </button>
      {state.error && <p className="w-full text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
