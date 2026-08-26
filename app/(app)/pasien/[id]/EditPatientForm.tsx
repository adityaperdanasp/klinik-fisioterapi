"use client";

import { useActionState, useEffect, useState } from "react";
import { updatePatient, type FormResult } from "./actions";

type Patient = {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
};

export function EditPatientForm({ patient }: { patient: Patient }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState<FormResult, FormData>(
    updatePatient,
    {}
  );
  const [wasPending, setWasPending] = useState(false);

  useEffect(() => {
    if (wasPending && !pending && !state.error) {
      setEditing(false);
    }
    setWasPending(pending);
  }, [pending, state.error, wasPending]);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-xs text-slate-500 underline hover:text-slate-900"
      >
        Edit Data
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <input type="hidden" name="patient_id" value={patient.id} />
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-600">Nama Lengkap</label>
        <input
          name="full_name"
          defaultValue={patient.full_name}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Tanggal Lahir</label>
        <input
          type="date"
          name="date_of_birth"
          defaultValue={patient.date_of_birth ?? ""}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Jenis Kelamin</label>
        <select
          name="gender"
          defaultValue={patient.gender ?? ""}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        >
          <option value="">Pilih</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">No. HP</label>
        <input
          name="phone"
          defaultValue={patient.phone ?? ""}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div className="sm:col-span-3">
        <label className="block text-xs font-medium text-slate-600">Alamat</label>
        <input
          name="address"
          defaultValue={patient.address ?? ""}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Nama Kontak Darurat</label>
        <input
          name="emergency_contact_name"
          defaultValue={patient.emergency_contact_name ?? ""}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">
          No. HP Kontak Darurat
        </label>
        <input
          name="emergency_contact_phone"
          defaultValue={patient.emergency_contact_phone ?? ""}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>

      <div className="sm:col-span-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Batal
        </button>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </div>
    </form>
  );
}
