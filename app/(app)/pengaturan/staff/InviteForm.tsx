"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { inviteStaff, type FormResult } from "./actions";

export function InviteForm() {
  const [state, formAction, pending] = useActionState<FormResult, FormData>(inviteStaff, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state.error]);

  useEffect(() => {
    setCopied(false);
  }, [state.inviteLink]);

  async function copyLink() {
    if (!state.inviteLink) return;
    await navigator.clipboard.writeText(state.inviteLink);
    setCopied(true);
  }

  return (
    <div className="space-y-3">
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
            {pending ? "Membuat akun..." : "Buat Akun Staff"}
          </button>
        </div>
        {state.error && <p className="sm:col-span-4 text-sm text-red-600">{state.error}</p>}
      </form>

      {state.inviteLink && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs font-medium text-emerald-800">
            Akun staff berhasil dibuat. Kirim link ini ke staff-nya buat set password sendiri:
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              readOnly
              value={state.inviteLink}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 rounded-md border border-emerald-300 bg-white px-2 py-1.5 text-xs text-slate-700"
            />
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
            >
              {copied ? "Tersalin!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
