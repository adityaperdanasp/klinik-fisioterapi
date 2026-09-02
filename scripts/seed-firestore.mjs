import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Idempotent: aman dijalanin ulang kapan aja, tiap seed cek dulu apa udah
// ada isinya sebelum nulis. Jalanin dari root project: `node scripts/seed-firestore.mjs`
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      let v = l.slice(idx + 1).trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      return [l.slice(0, idx).trim(), v];
    })
);

const app = initializeApp({
  credential: cert({
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

async function seedRooms() {
  const names = ["Ruang 1", "Ruang 2", "Ruang 3", "Ruang 4"];
  const existing = await db.collection("rooms").get();
  if (!existing.empty) {
    console.log(`rooms: udah ada ${existing.size} dokumen, skip seed.`);
    return;
  }
  const batch = db.batch();
  for (const name of names) {
    const ref = db.collection("rooms").doc();
    batch.set(ref, { name, active: true, created_at: FieldValue.serverTimestamp() });
  }
  await batch.commit();
  console.log(`rooms: ${names.length} dokumen dibikin.`);
}

async function seedPhysiotherapists() {
  const names = ["Adit", "Erwin", "Maikel", "Fisioterapis 4"];
  const existing = await db.collection("physiotherapists").get();
  if (!existing.empty) {
    console.log(`physiotherapists: udah ada ${existing.size} dokumen, skip seed.`);
    return;
  }
  const batch = db.batch();
  for (const full_name of names) {
    const ref = db.collection("physiotherapists").doc();
    batch.set(ref, {
      profile_id: null,
      full_name,
      str_number: null,
      active: true,
      created_at: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
  console.log(`physiotherapists: ${names.length} dokumen dibikin.`);
}

async function seedSettings() {
  const settings = [
    ["tarif_default", "175000", "Tarif default per sesi (Rupiah)"],
    [
      "kapasitas_max_sesi_bulan",
      "874",
      "Kapasitas maksimum sesi per bulan (4 fisio x 4 ruang x sesi efektif)",
    ],
    ["target_bep_sesi_bulan", "290", "Target BEP (break-even point) sesi per bulan"],
    [
      "bulan_mulai_operasional",
      "2026-08-01",
      "Bulan ke-1 untuk proyeksi ramp-up utilisasi (format YYYY-MM-01) — placeholder, edit setelah tanggal pasti ditentukan",
    ],
  ];
  const batch = db.batch();
  let skipped = 0;
  for (const [key, value, description] of settings) {
    const ref = db.collection("settings").doc(key);
    const snap = await ref.get();
    if (snap.exists) {
      skipped++;
      continue;
    }
    batch.set(ref, {
      value,
      description,
      updated_by: null,
      updated_at: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
  console.log(`settings: ${settings.length - skipped} dokumen dibikin, ${skipped} udah ada (skip).`);
}

async function seedPatientCounter() {
  const ref = db.collection("counters").doc("patients");
  const snap = await ref.get();
  if (snap.exists) {
    console.log("counters/patients: udah ada, skip seed.");
    return;
  }
  await ref.set({ next: 1 });
  console.log("counters/patients: dibikin dengan next=1.");
}

await seedRooms();
await seedPhysiotherapists();
await seedSettings();
await seedPatientCounter();
console.log("Seed selesai.");
