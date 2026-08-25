"use client";

import { useActionState } from "react";
import { createBooking, type CreateBookingResult } from "./actions";

type Option = { id: string; label: string };

export function BookingForm({
  patients,
  physiotherapists,
  rooms,
}: {
  patients: Option[];
  physiotherapists: Option[];
  rooms: Option[];
}) {
  const [state, formAction, pending] = useActionState<
    CreateBookingResult,
    FormData
  >(createBooking, {});

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end">
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-600">Pasien</label>
        <select
          name="patient_id"
          required
          disabled={patients.length === 0}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="">
            {patients.length === 0 ? "Belum ada data pasien" : "Pilih pasien"}
          </option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600">Fisioterapis</label>
        <select
          name="physiotherapist_id"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="">Pilih</option>
          {physiotherapists.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600">Ruang</label>
        <select
          name="room_id"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="">Pilih</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600">
          Mulai (sesi 50 menit)
        </label>
        <input
          type="datetime-local"
          name="starts_at"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div className="sm:col-span-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || patients.length === 0}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Tambah Booking"}
        </button>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </div>
    </form>
  );
}
