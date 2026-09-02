"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Logo } from "@/app/components/Logo";

// Halaman branded pengganti halaman hosted default Firebase
// (pulih-fisioterapi.firebaseapp.com/__/auth/action) — link diarahin ke
// sini via actionCodeSettings di generatePasswordResetLink()
// (app/(app)/pengaturan/staff/actions.ts). Route ini PUBLIK (dikecualikan
// dari proteksi login di lib/firebase/middleware.ts) karena orang yang
// buka halaman ini justru BELUM punya akun aktif/sesi.
export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState<"checking" | "ready" | "invalid" | "done">("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, [oobCode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (!oobCode) return;

    setPending(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus("done");
    } catch {
      setError("Link ini sudah kedaluwarsa atau sudah dipakai. Minta admin kirim ulang undangan.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--brand-cream)" }}
    >
      <div className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm" style={{ borderColor: "var(--brand-cream-alt)" }}>
        <Logo size="compact" />
        <h1 className="mt-4 text-xl font-semibold" style={{ color: "var(--brand-ink)", fontFamily: "var(--font-display, Georgia, serif)" }}>
          Aktivasi Akun Staff
        </h1>

        {status === "checking" && (
          <p className="mt-4 text-sm" style={{ color: "var(--brand-muted)" }}>
            Memeriksa link undangan...
          </p>
        )}

        {status === "invalid" && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Link undangan tidak valid atau sudah kedaluwarsa. Minta admin kirim ulang undangan
            dari halaman Kelola Staff.
          </p>
        )}

        {status === "ready" && (
          <>
            <p className="mt-1 text-sm" style={{ color: "var(--brand-muted)" }}>
              Buat password buat akun <strong>{email}</strong>.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="password" className="field-label">
                  Password Baru
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="field-label">
                  Konfirmasi Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="field-input"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={pending} className="btn-primary w-full">
                {pending ? "Menyimpan..." : "Aktifkan Akun"}
              </button>
            </form>
          </>
        )}

        {status === "done" && (
          <div className="mt-4 space-y-3">
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Password berhasil diset. Akun kamu sudah aktif.
            </p>
            <button type="button" onClick={() => router.push("/login")} className="btn-primary w-full">
              Masuk Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
