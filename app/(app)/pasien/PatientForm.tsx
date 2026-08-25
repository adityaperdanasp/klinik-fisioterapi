"use client";

import { useActionState, useRef, useEffect } from "react";
import { createPatient, type FormResult } from "./actions";

export function PatientForm() {
  const [state, formAction, pending] = useActionState<FormResult, FormData>(
    createPatient,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) {
      formRef.current?.reset();
    }
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-600">Nama Lengkap</label>
        <input
          name="full_name"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Tanggal Lahir</label>
        <input
          type="date"
          name="date_of_birth"
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Jenis Kelamin</label>
        <select
          name="gender"
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
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div className="sm:col-span-3">
        <label className="block text-xs font-medium text-slate-600">Alamat</label>
        <input
          name="address"
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">
          Nama Kontak Darurat
        </label>
        <input
          name="emergency_contact_name"
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">
          No. HP Kontak Darurat
        </label>
        <input
          name="emergency_contact_phone"
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>

      <div className="sm:col-span-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Tambah Pasien"}
        </button>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </div>
    </form>
  );
}
