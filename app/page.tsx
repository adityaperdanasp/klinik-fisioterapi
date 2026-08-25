// Konten di bawah ini masih placeholder (alamat, nomor WA, jam operasional) —
// ganti dengan data asli klinik sebelum go-live publik.
const WHATSAPP_NUMBER = "6281234567890"; // TODO: ganti nomor WA asli klinik
const CLINIC_ADDRESS = "Jl. Contoh Raya No. 123, Bekasi"; // TODO: ganti alamat asli

const SERVICES = [
  {
    title: "Terapi Cedera Otot",
    description: "Penanganan cedera otot akut maupun kronis dengan pendekatan berbasis evaluasi fisioterapis.",
  },
  {
    title: "Rehabilitasi Pasca Cedera Olahraga",
    description: "Program pemulihan bertahap untuk kembali beraktivitas dan berolahraga dengan aman.",
  },
  {
    title: "Terapi Nyeri Otot & Sendi",
    description: "Penanganan nyeri punggung, bahu, lutut, dan sendi lain akibat aktivitas atau postur.",
  },
  {
    title: "Konsultasi & Evaluasi Awal",
    description: "Pemeriksaan awal untuk menentukan diagnosa dan rencana terapi yang tepat.",
  },
];

function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <span className="text-base font-semibold text-slate-900">Pulih Fisioterapi</span>
          <a
            href={whatsappLink("Halo, saya ingin booking sesi fisioterapi.")}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Booking via WhatsApp
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Klinik Fisioterapi Spesialis Cedera Otot di Bekasi
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Ditangani langsung oleh fisioterapis berpengalaman dan berlisensi (STR). Kami membantu
          Anda pulih dari cedera otot, nyeri sendi, dan rehabilitasi pasca cedera olahraga.
        </p>
        <a
          href={whatsappLink("Halo, saya ingin booking sesi fisioterapi.")}
          className="mt-8 inline-block rounded-md bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Booking Sekarang via WhatsApp
        </a>
      </section>

      <section className="border-t border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-xl font-semibold text-slate-900">Layanan Kami</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="font-medium text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-center text-xl font-semibold text-slate-900">Lokasi</h2>
        <p className="mt-3 text-center text-slate-600">{CLINIC_ADDRESS}</p>
        <div className="mt-8 text-center">
          <a
            href={whatsappLink("Halo, saya ingin tanya-tanya soal fisioterapi.")}
            className="inline-block rounded-md border border-emerald-600 px-6 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Chat WhatsApp
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Pulih Fisioterapi ·{" "}
        <a href="/login" className="hover:text-slate-600">
          Login Staff
        </a>
      </footer>
    </div>
  );
}
