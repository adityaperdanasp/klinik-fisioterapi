import { Plus_Jakarta_Sans } from "next/font/google";
import { Logo } from "./components/Logo";

const WHATSAPP_NUMBER = "6281322043022";
const CLINIC_ADDRESS =
  "Ruko Concordia & Trafalgar Blok SE1 No. 29, Ciangsana, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16968";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});

const STEPS = [
  {
    number: "01",
    title: "Konsultasi Awal",
    description:
      "Ceritakan keluhan Anda ke fisioterapis kami. Kami periksa langsung untuk menemukan akar masalah cedera otot Anda.",
  },
  {
    number: "02",
    title: "Rencana Terapi",
    description:
      "Program pemulihan disusun sesuai kondisi dan target Anda — bukan pendekatan yang sama untuk semua orang.",
  },
  {
    number: "03",
    title: "Sesi Terapi",
    description:
      "Penanganan langsung oleh fisioterapis: manajemen nyeri, mobilisasi otot, sampai latihan penguatan bertahap.",
  },
  {
    number: "04",
    title: "Pantau Progres",
    description:
      "Perkembangan dicek tiap sesi, supaya pemulihan tetap terarah dan hasilnya bertahan lama.",
  },
];

const SERVICES = [
  {
    title: "Terapi Cedera Otot",
    description:
      "Penanganan cedera otot akut maupun kronis dengan pendekatan berbasis evaluasi fisioterapis.",
    image: "photo-1540205895360-4ad4cffb3aa8",
  },
  {
    title: "Rehabilitasi Pasca Cedera Olahraga",
    description: "Program pemulihan bertahap untuk kembali beraktivitas dan berolahraga dengan aman.",
    image: "photo-1522898467493-49726bf28798",
  },
  {
    title: "Terapi Nyeri Otot & Sendi",
    description: "Penanganan nyeri punggung, bahu, lutut, dan sendi lain akibat aktivitas atau postur.",
    image: "photo-1706353399656-210cca727a33",
  },
  {
    title: "Konsultasi & Evaluasi Awal",
    description: "Pemeriksaan awal untuk menentukan diagnosa dan rencana terapi yang tepat.",
    image: "photo-1519823551278-64ac92734fb1",
  },
];

const HERO_IMAGE = "photo-1649751361457-01d3a696c7e6";

function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/${id}?w=${width}&q=80&auto=format&fit=crop`;
}

export default function LandingPage() {
  return (
    <div className={`${jakartaSans.variable} min-h-screen bg-white text-[#0F172A]`}>
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 sm:flex">
            <a href="#layanan" className="hover:text-[#0E4A6B]">
              Layanan
            </a>
            <a href="#alur" className="hover:text-[#0E4A6B]">
              Alur Pelayanan
            </a>
            <a href="#lokasi" className="hover:text-[#0E4A6B]">
              Lokasi
            </a>
          </nav>
          <a
            href={whatsappLink("Halo, saya ingin booking sesi fisioterapi.")}
            className="rounded-full bg-[#0E9F6E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0C8A5F]"
          >
            Booking via WhatsApp
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#E6F6EE] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0C8A5F]">
              Spesialis Cedera Otot · Bekasi
            </p>
            <h1
              className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pulih dari Cedera Otot,{" "}
              <span className="text-[#0E4A6B]">Ditangani Profesional</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-slate-600 sm:text-lg">
              Ditangani langsung oleh fisioterapis berpengalaman dan berlisensi (STR). Kami
              membantu Anda pulih dari cedera otot, nyeri sendi, dan rehabilitasi pasca cedera
              olahraga.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink("Halo, saya ingin booking sesi fisioterapi.")}
                className="rounded-full bg-[#0E9F6E] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#0C8A5F]"
              >
                Booking Sekarang
              </a>
              <a
                href="#layanan"
                className="rounded-full border-2 border-slate-200 px-7 py-3.5 text-sm font-bold text-slate-700 hover:border-slate-300"
              >
                Lihat Layanan
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-[#0E9F6E]/15 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-[#0E4A6B]/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={unsplash(HERO_IMAGE, 800)}
                alt="Fisioterapis menangani pasien"
                className="h-[420px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="alur" className="bg-[#F7FAFC] py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[#0C8A5F]">
            Alur Pelayanan
          </p>
          <h2
            className="mt-2 text-center text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Empat Langkah Menuju Pulih
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.number}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100"
              >
                <span
                  className="text-3xl font-extrabold text-[#0E9F6E]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.number}
                </span>
                <h3
                  className="mt-3 text-lg font-bold text-[#0F172A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="layanan" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Layanan Kami
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={unsplash(s.image, 640)}
                  alt={s.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <h3
                    className="text-lg font-bold text-[#0F172A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">{s.description}</p>
                  <a
                    href={whatsappLink(`Halo, saya ingin konsultasi soal ${s.title.toLowerCase()}.`)}
                    className="mt-4 inline-block rounded-full border-2 border-[#0E9F6E] px-5 py-2 text-xs font-bold uppercase tracking-wide text-[#0C8A5F] hover:bg-[#0E9F6E] hover:text-white"
                  >
                    Konsultasi Sekarang
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lokasi" className="bg-[#0E4A6B] py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Lokasi
          </h2>
          <p className="mt-3 text-slate-200">{CLINIC_ADDRESS}</p>
          <div className="mt-8">
            <a
              href={whatsappLink("Halo, saya ingin tanya-tanya soal fisioterapi.")}
              className="inline-block rounded-full bg-[#0E9F6E] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#0C8A5F]"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Pulih Fisioterapi ·{" "}
        <a href="/login" className="hover:text-slate-600">
          Login Staff
        </a>
      </footer>
    </div>
  );
}
