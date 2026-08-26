"use client";

import { useActionState, useRef, useEffect } from "react";
import { inviteStaff, type FormResult } from "./actions";

export function InviteForm() {
  const [state, formAction, pending] = useActionState<FormResult, FormData>(inviteStaff, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
      <div>
        <label className="block text-xs font-medium text-slate-600">Nama Lengkap</label>
        <input
          name="full_name"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Email</label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Role</label>
        <select
          name="role"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
        >
          <option value="">Pilih</option>
          <option value="admin">Admin</option>
          <option value="fisioterapis">Fisioterapis</option>
          <option value="resepsionis">Resepsionis</option>
        </select>
      </div>
      <div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? "Mengundang..." : "Kirim Undangan"}
        </button>
      </div>
      {state.error && <p className="sm:col-span-4 text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
