"use client";

import { useActionState } from "react";
import { updateDiagnosis, type FormResult } from "./actions";

export function DiagnosisForm({
  patientId,
  initialDiagnosis,
}: {
  patientId: string;
  initialDiagnosis: string;
}) {
  const [state, formAction, pending] = useActionState<FormResult, FormData>(
    updateDiagnosis,
    {}
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="patient_id" value={patientId} />
      <textarea
        name="initial_diagnosis"
        defaultValue={initialDiagnosis}
        rows={3}
        placeholder="Diagnosa awal..."
        className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Simpan Diagnosa"}
        </button>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </div>
    </form>
  );
}
