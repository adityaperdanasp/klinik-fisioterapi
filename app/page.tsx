import { Space_Grotesk } from "next/font/google";

// Konten di bawah ini masih placeholder (alamat, nomor WA, jam operasional) —
// ganti dengan data asli klinik sebelum go-live publik.
const WHATSAPP_NUMBER = "6281234567890"; // TODO: ganti nomor WA asli klinik
const CLINIC_ADDRESS = "Jl. Contoh Raya No. 123, Bekasi"; // TODO: ganti alamat asli

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

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
    <div className={`${spaceGrotesk.variable} min-h-screen bg-[#FBF2EC] text-[#141110]`}>
      <header className="border-b-2 border-[#141110]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pulih Fisioterapi
          </span>
          <a
            href={whatsappLink("Halo, saya ingin booking sesi fisioterapi.")}
            className="rounded-full bg-[#1F7A6C] px-5 py-2 text-sm font-bold text-white hover:bg-[#18665A]"
          >
            Booking via WhatsApp
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-20 text-center">
        <p className="mx-auto mb-4 inline-block rounded-full border-2 border-[#141110] px-4 py-1 text-xs font-bold uppercase tracking-widest">
          Spesialis Cedera Otot · Bekasi
        </p>
        <h1
          className="mx-auto max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Pulih dari
          <br />
          <span className="text-[#1F7A6C]">Cedera Otot</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-[#4A4340] sm:text-lg">
          Ditangani langsung oleh fisioterapis berpengalaman dan berlisensi (STR). Kami membantu
          Anda pulih dari cedera otot, nyeri sendi, dan rehabilitasi pasca cedera olahraga.
        </p>
        <a
          href={whatsappLink("Halo, saya ingin booking sesi fisioterapi.")}
          className="mt-10 inline-block rounded-full bg-[#E8543A] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#D3492F]"
        >
          Booking Sekarang via WhatsApp
        </a>
      </section>

      <div className="h-1 w-full bg-[#141110]" />

      <section className="bg-[#F4DED2] py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Layanan Kami
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border-2 border-[#141110] bg-[#FBF2EC] p-6"
              >
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-[#4A4340]">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Lokasi
        </h2>
        <p className="mt-3 text-[#4A4340]">{CLINIC_ADDRESS}</p>
        <div className="mt-8">
          <a
            href={whatsappLink("Halo, saya ingin tanya-tanya soal fisioterapi.")}
            className="inline-block rounded-full border-2 border-[#1F7A6C] px-8 py-3 text-sm font-bold uppercase tracking-wide text-[#1F7A6C] hover:bg-[#1F7A6C] hover:text-white"
          >
            Chat WhatsApp
          </a>
        </div>
      </section>

      <footer className="border-t-2 border-[#141110] py-6 text-center text-xs text-[#4A4340]">
        © {new Date().getFullYear()} Pulih Fisioterapi ·{" "}
        <a href="/login" className="hover:text-[#141110]">
          Login Staff
        </a>
      </footer>
    </div>
  );
}
