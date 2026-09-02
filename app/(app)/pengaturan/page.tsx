import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, type PhysiotherapistDoc, type RoomDoc } from "@/lib/firebase/schema";
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

  const [roomsSnap, physiosSnap] = await Promise.all([
    adminDb.collection(COLLECTIONS.rooms).orderBy("name").get(),
    adminDb.collection(COLLECTIONS.physiotherapists).orderBy("full_name").get(),
  ]);

  const rooms = roomsSnap.docs.map((d) => {
    const data = d.data() as RoomDoc;
    return { id: d.id, name: data.name, active: data.active };
  });
  const physios = physiosSnap.docs.map((d) => {
    const data = d.data() as PhysiotherapistDoc;
    return { id: d.id, full_name: data.full_name, str_number: data.str_number, active: data.active };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Pengaturan</h1>
          <p className="text-sm text-slate-500">Kelola data ruang dan fisioterapis.</p>
        </div>
        <a href="/pengaturan/staff" className="text-sm text-slate-500 hover:text-slate-900">
          Kelola Staff &rarr;
        </a>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-medium text-slate-900">Ruang</h2>
        <RoomForm />
        <div className="mt-4 space-y-2">
          {rooms.map((r) => (
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
          {physios.map((p) => (
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
