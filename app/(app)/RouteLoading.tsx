// Loading state generik dipakai lewat re-export di tiap loading.tsx
// per-route (konvensi Next.js App Router — file-nya emang wajib literally
// bernama `loading.tsx` di tiap folder route, jadi isinya cuma re-export
// dari sini biar nggak duplikat markup di 8 tempat).
export default function RouteLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Memuat...">
      <div className="space-y-2">
        <div className="h-5 w-48 animate-pulse rounded" style={{ background: "var(--brand-cream-alt)" }} />
        <div className="h-3 w-32 animate-pulse rounded" style={{ background: "var(--brand-cream-alt)" }} />
      </div>
      <div className="card space-y-3">
        <div className="h-4 w-28 animate-pulse rounded" style={{ background: "var(--brand-cream-alt)" }} />
        <div className="h-9 w-full animate-pulse rounded-md" style={{ background: "var(--brand-cream-alt)" }} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card h-20 animate-pulse" style={{ background: "var(--brand-cream-alt)" }} />
        ))}
      </div>
    </div>
  );
}
