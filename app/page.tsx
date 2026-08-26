import { Fraunces, Inter } from "next/font/google";
import { Logo } from "./components/Logo";

const WHATSAPP_NUMBER = "6281322043022";
const CLINIC_ADDRESS =
  "Ruko Concordia & Trafalgar Blok SE1 No. 29, Ciangsana, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16968";

// Design system: hex values + font families from user reference (facts, not copyrightable) —
// layout, copy, and photos below are original.
const COLOR = {
  primary: "#2F723D",
  secondary: "#7CEA99",
  tertiary: "#729AA8",
  natural: "#1C2D2D",
  naturalBlack: "#0C1313",
};

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
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

const RIBBON_TAGS = ["Cedera Otot", "Rehabilitasi Olahraga", "Nyeri Sendi", "Evaluasi Awal"];

const FEATURES = [
  {
    title: "Sesi 1-on-1",
    description: "Setiap sesi ditangani langsung oleh satu fisioterapis, fokus penuh ke kondisi Anda.",
  },
  {
    title: "Program Personal",
    description: "Rencana terapi disusun sesuai kondisi dan target pemulihan — bukan program generik.",
  },
  {
    title: "Fisioterapis Berlisensi",
    description: "Ditangani oleh fisioterapis dengan STR (Surat Tanda Registrasi) resmi.",
  },
];

const TEAM = [
  { name: "Adit", initials: "AD" },
  { name: "Erwin", initials: "ER" },
  { name: "Maikel", initials: "MK" },
];

function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/${id}?w=${width}&q=80&auto=format&fit=crop`;
}

function ServiceRibbon() {
  const repeated = Array(3).fill(RIBBON_TAGS.join("   •   ")).join("   •   ");
  return (
    <svg viewBox="0 0 1200 130" className="w-full" aria-hidden="true">
      <path
        id="wavePath"
        d="M-50,65 C100,20 200,110 350,65 C500,20 600,110 750,65 C900,20 1000,110 1150,65 C1250,40 1250,40 1250,40"
        fill="none"
        stroke={COLOR.secondary}
        strokeWidth={92}
        strokeLinecap="round"
      />
      <text
        fill={COLOR.natural}
        fontSize="22"
        fontWeight={700}
        letterSpacing="0.5"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <textPath href="#wavePath" startOffset="2%">
          {repeated}
        </textPath>
      </text>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className={`${fraunces.variable} ${inter.variable} min-h-screen bg-white`} style={{ fontFamily: "var(--font-body)" }}>
      <div style={{ backgroundColor: COLOR.natural }}>
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 sm:flex">
            <a href="#layanan" className="hover:text-white">
              Layanan
            </a>
            <a href="#alur" className="hover:text-white">
              Alur Pelayanan
            </a>
            <a href="#tim" className="hover:text-white">
              Tim
            </a>
            <a href="#lokasi" className="hover:text-white">
              Lokasi
            </a>
          </nav>
          <a
            href={whatsappLink("Halo, saya ingin booking sesi fisioterapi.")}
            className="rounded-full px-5 py-2.5 text-sm font-bold"
            style={{ backgroundColor: COLOR.secondary, color: COLOR.naturalBlack }}
          >
            Booking via WhatsApp
          </a>
        </header>

        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <h1
              className="text-5xl font-semibold leading-[1.05] text-white sm:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pulih.
              <span style={{ color: COLOR.secondary }}>●</span>
              <br />
              Bergerak.
              <span style={{ color: COLOR.secondary }}>●</span>
              <br />
              <span className="italic">Kembali Aktif.</span>
              <span style={{ color: COLOR.secondary }}>●</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-white/70">
              Fisioterapi spesialis cedera otot untuk memulihkan mobilitas dan kualitas hidup
              Anda, ditangani langsung oleh fisioterapis berlisensi (STR).
            </p>
            <a
              href={whatsappLink("Halo, saya ingin booking sesi fisioterapi.")}
              className="mt-8 inline-block rounded-md px-7 py-3.5 text-sm font-bold"
              style={{ backgroundColor: COLOR.secondary, color: COLOR.naturalBlack }}
            >
              Jadwalkan Konsultasi
            </a>
          </div>

          <div className="rounded-3xl bg-white/5 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={unsplash(HERO_IMAGE, 800)}
              alt="Fisioterapis menangani pasien"
              className="h-[420px] w-full rounded-2xl object-cover"
            />
          </div>
        </section>
      </div>

      <section className="py-16" style={{ backgroundColor: "#F5F7F5" }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-display)", color: COLOR.naturalBlack }}
              >
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <span
            className="text-8xl font-semibold sm:text-9xl"
            style={{ fontFamily: "var(--font-display)", color: COLOR.primary }}
          >
            STR
          </span>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Fisioterapis Bersertifikat &amp; Berlisensi Resmi
          </p>
        </div>
        <div>
          <h2
            className="text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: COLOR.naturalBlack }}
          >
            Fisioterapi yang Disesuaikan untuk Anda
          </h2>
          <p className="mt-4 text-slate-600">
            Setiap pasien punya riwayat dan kondisi yang berbeda. Kami menyusun evaluasi dan
            rencana terapi secara personal — bukan satu program untuk semua orang — supaya
            pemulihan Anda lebih tepat sasaran.
          </p>
          <a
            href="#layanan"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold"
            style={{ color: COLOR.primary }}
          >
            Lihat layanan kami →
          </a>
        </div>
      </section>

      <div className="py-6">
        <ServiceRibbon />
      </div>

      <section id="alur" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className="text-center text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: COLOR.naturalBlack }}
          >
            Empat Langkah Menuju Pulih
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.number} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <span
                  className="text-3xl font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: COLOR.primary }}
                >
                  {s.number}
                </span>
                <h3 className="mt-3 text-lg font-bold" style={{ color: COLOR.naturalBlack }}>
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="layanan" className="py-16" style={{ backgroundColor: "#F5F7F5" }}>
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className="text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: COLOR.naturalBlack }}
          >
            Layanan Kami
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <div key={s.title} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={unsplash(s.image, 640)}
                  alt={s.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold" style={{ color: COLOR.naturalBlack }}>
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">{s.description}</p>
                  <a
                    href={whatsappLink(`Halo, saya ingin konsultasi soal ${s.title.toLowerCase()}.`)}
                    className="mt-4 inline-block rounded-full border-2 px-5 py-2 text-xs font-bold uppercase tracking-wide hover:bg-[#2F723D] hover:text-white"
                    style={{ borderColor: COLOR.primary, color: COLOR.primary }}
                  >
                    Konsultasi Sekarang
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2
            className="text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: COLOR.naturalBlack }}
          >
            Tentang Pulih Fisioterapi
          </h2>
          <p className="mt-4 text-slate-600">
            Kami klinik fisioterapi yang fokus menangani cedera otot — dari cedera olahraga
            sampai nyeri akibat aktivitas harian. Pendekatan kami mengutamakan evaluasi
            menyeluruh dan gerak aktif sebagai bagian dari proses pemulihan, bukan sekadar
            modalitas pasif.
          </p>
        </div>
      </section>

      <section id="tim" className="py-16" style={{ backgroundColor: "#F5F7F5" }}>
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className="text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: COLOR.naturalBlack }}
          >
            Tim Fisioterapis Kami
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TEAM.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold"
                  style={{ backgroundColor: COLOR.secondary, color: COLOR.naturalBlack }}
                >
                  {t.initials}
                </div>
                <h3 className="mt-3 text-base font-bold" style={{ color: COLOR.naturalBlack }}>
                  {t.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">Fisioterapis</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lokasi" className="py-20 text-center text-white" style={{ backgroundColor: COLOR.natural }}>
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-semibold sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            Lokasi
          </h2>
          <p className="mt-3 text-white/70">{CLINIC_ADDRESS}</p>
          <div className="mt-8">
            <a
              href={whatsappLink("Halo, saya ingin tanya-tanya soal fisioterapi.")}
              className="inline-block rounded-md px-8 py-3.5 text-sm font-bold"
              style={{ backgroundColor: COLOR.secondary, color: COLOR.naturalBlack }}
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="py-16 text-white" style={{ backgroundColor: COLOR.naturalBlack }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-white/50">
              Klinik fisioterapi spesialis cedera otot, ditangani fisioterapis berlisensi (STR).
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white/70">Navigasi</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/50">
              <li>
                <a href="#layanan" className="hover:text-white">
                  Layanan
                </a>
              </li>
              <li>
                <a href="#alur" className="hover:text-white">
                  Alur Pelayanan
                </a>
              </li>
              <li>
                <a href="#tim" className="hover:text-white">
                  Tim
                </a>
              </li>
              <li>
                <a href="#lokasi" className="hover:text-white">
                  Lokasi
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white/70">Kontak</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/50">
              <li>
                <a href={whatsappLink("Halo, saya ingin tanya-tanya soal fisioterapi.")} className="hover:text-white">
                  WhatsApp: {WHATSAPP_NUMBER}
                </a>
              </li>
              <li>{CLINIC_ADDRESS}</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-4 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Pulih Fisioterapi ·{" "}
          <a href="/login" className="hover:text-white">
            Login Staff
          </a>
        </div>
      </footer>
    </div>
  );
}
