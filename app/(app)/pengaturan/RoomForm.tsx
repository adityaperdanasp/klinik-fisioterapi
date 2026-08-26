"use client";

import { useActionState, useRef, useEffect } from "react";
import { createRoom, type FormResult } from "./actions";

export function RoomForm() {
  const [state, formAction, pending] = useActionState<FormResult, FormData>(createRoom, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex items-end gap-2">
      <div>
        <label className="block text-xs font-medium text-slate-600">Nama Ruang</label>
        <input
          name="name"
          required
          placeholder="Ruang 5"
          className="mt-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {pending ? "Menyimpan..." : "Tambah Ruang"}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
