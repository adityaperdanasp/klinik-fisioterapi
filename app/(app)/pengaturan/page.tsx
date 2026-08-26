import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/current-user";
import { RoomForm } from "./RoomForm";
import { PhysioForm } from "./PhysioForm";
import { ActiveToggle } from "./ActiveToggle";
import { toggleRoomActive, togglePhysioActive } from "./actions";

export default async function PengaturanPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return <p className="text-sm text-slate-500">Halaman pengaturan khusus admin.</p>;
  }

  const supabase = await createClient();
  const [roomsRes, physiosRes] = await Promise.all([
    supabase.from("rooms").select("id, name, active").order("name"),
    supabase.from("physiotherapists").select("id, full_name, str_number, active").order("full_name"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Pengaturan</h1>
        <p className="text-sm text-slate-500">Kelola data ruang dan fisioterapis.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-medium text-slate-900">Ruang</h2>
        <RoomForm />
        <div className="mt-4 space-y-2">
          {(roomsRes.data ?? []).map((r) => (
            <div key={r.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-900">{r.name}</span>
              <ActiveToggle id={r.id} active={r.active} action={toggleRoomActive} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-medium text-slate-900">Fisioterapis</h2>
        <PhysioForm />
        <div className="mt-4 space-y-2">
          {(physiosRes.data ?? []).map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-900">
                {p.full_name}
                {p.str_number && <span className="ml-2 text-xs text-slate-400">STR: {p.str_number}</span>}
              </span>
              <ActiveToggle id={p.id} active={p.active} action={togglePhysioActive} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
