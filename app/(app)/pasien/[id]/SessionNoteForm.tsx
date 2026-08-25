"use client";

import { useActionState } from "react";
import { saveSessionNote, type FormResult } from "./actions";

export function SessionNoteForm({
  bookingId,
  patientId,
  complaint,
  progressNotes,
}: {
  bookingId: string;
  patientId: string;
  complaint: string;
  progressNotes: string;
}) {
  const [state, formAction, pending] = useActionState<FormResult, FormData>(
    saveSessionNote,
    {}
  );

  return (
    <form action={formAction} className="mt-2 space-y-2">
      <input type="hidden" name="booking_id" value={bookingId} />
      <input type="hidden" name="patient_id" value={patientId} />
      <div>
        <label className="block text-xs font-medium text-slate-600">Keluhan</label>
        <input
          name="complaint"
          defaultValue={complaint}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Catatan Progres</label>
        <textarea
          name="progress_notes"
          defaultValue={progressNotes}
          rows={2}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-900"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Simpan Catatan"}
        </button>
        {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      </div>
    </form>
  );
}
