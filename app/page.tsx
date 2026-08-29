import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { Logo } from "./components/Logo";

const WHATSAPP_NUMBER = "6281322043022";
const CLINIC_ADDRESS =
  "Ruko Concordia & Trafalgar Blok SE1 No. 29, Ciangsana, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16968";

// Design system: warm cream / earth-tone palette, inspired by the calm luxury-wellness
// reference the user shared — colors and layout genre are ours to reuse, copy/photos are original.
const COLOR = {
  cream: "#FAF5EE",
  creamAlt: "#F1E6D6",
  earth: "#96754A",
  earthDark: "#7A5D39",
  ink: "#231F1A",
  muted: "#57503F",
};

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    image: "https://images.pexels.com/photos/20860592/pexels-photo-20860592.jpeg?auto=compress&cs=tinysrgb&w=640",
  },
  {
    title: "Rehabilitasi Pasca Cedera Olahraga",
    description: "Program pemulihan bertahap untuk kembali beraktivitas dan berolahraga dengan aman.",
    image: "https://images.pexels.com/photos/20860619/pexels-photo-20860619.jpeg?auto=compress&cs=tinysrgb&w=640",
  },
  {
    title: "Terapi Nyeri Otot & Sendi",
    description: "Penanganan nyeri punggung, bahu, lutut, dan sendi lain akibat aktivitas atau postur.",
    image: "https://images.pexels.com/photos/20860606/pexels-photo-20860606.jpeg?auto=compress&cs=tinysrgb&w=640",
  },
  {
    title: "Konsultasi & Evaluasi Awal",
    description: "Pemeriksaan awal untuk menentukan diagnosa dan rencana terapi yang tepat.",
    image: "https://images.pexels.com/photos/4506075/pexels-photo-4506075.jpeg?auto=compress&cs=tinysrgb&w=640",
  },
];

const HERO_IMAGE =
  "https://images.pexels.com/photos/20860609/pexels-photo-20860609.jpeg?auto=compress&cs=tinysrgb&w=800";

const GALLERY = [
  "https://images.pexels.com/photos/20860597/pexels-photo-20860597.jpeg?auto=compress&cs=tinysrgb&w=500",
  "https://images.pexels.com/photos/20860603/pexels-photo-20860603.jpeg?auto=compress&cs=tinysrgb&w=500",
  "https://images.pexels.com/photos/20860577/pexels-photo-20860577.jpeg?auto=compress&cs=tinysrgb&w=500",
  "https://images.pexels.com/photos/20860599/pexels-photo-20860599.jpeg?auto=compress&cs=tinysrgb&w=500",
];

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

// Foto placeholder (stok) sampai ada foto staff asli — lihat catatan di CLAUDE.md.
const TEAM = [
  { name: "Erwin", photo: "/team/erwin.jpg" },
  { name: "Mia", photo: "/team/mia.jpg" },
  { name: "Fitria", photo: "/team/fitria.jpg" },
  { name: "Dhea", photo: "/team/dhea.jpg" },
];

const FAQ = [
  {
    q: "Apakah saya perlu rujukan dokter untuk booking sesi fisioterapi?",
    a: "Tidak wajib. Anda bisa langsung booking konsultasi awal, fisioterapis kami akan melakukan evaluasi untuk menentukan rencana terapi yang tepat.",
  },
  {
    q: "Berapa lama satu sesi terapi berlangsung?",
    a: "Setiap sesi berlangsung sekitar 50 menit, mencakup evaluasi kondisi terkini dan penanganan langsung oleh fisioterapis.",
  },
  {
    q: "Bagaimana cara reschedule atau membatalkan jadwal?",
    a: "Hubungi kami via WhatsApp sesegera mungkin sebelum jadwal Anda, kami akan bantu atur ulang sesuai ketersediaan ruang dan fisioterapis.",
  },
  {
    q: "Apakah fisioterapis di sini berlisensi resmi?",
    a: "Ya, seluruh fisioterapis kami memiliki STR (Surat Tanda Registrasi) yang aktif.",
  },
  {
    q: "Apa yang harus saya bawa atau kenakan saat sesi pertama?",
    a: "Kenakan pakaian yang nyaman dan memungkinkan pergerakan bebas pada area yang akan ditangani. Bawa hasil pemeriksaan medis sebelumnya jika ada.",
  },
];

function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function LandingPage() {
  return (
    <div
      className={`${fraunces.variable} ${plexSans.variable} min-h-screen`}
      style={{ backgroundColor: COLOR.cream, color: COLOR.ink, fontFamily: "var(--font-body)" }}
    >
      <header className="border-b" style={{ borderColor: "rgba(46,40,34,0.08)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo />
          <nav
            className="hidden items-center gap-8 text-sm font-semibold sm:flex"
            style={{ color: COLOR.ink }}
          >
            <a href="#layanan" style={{ color: "inherit" }}>
              Layanan
            </a>
            <a href="#alur" style={{ color: "inherit" }}>
              Alur Pelayanan
            </a>
            <a href="#tim" style={{ color: "inherit" }}>
              Tim
            </a>
            <a href="#faq" style={{ color: "inherit" }}>
              FAQ
            </a>
            <a href="#lokasi" style={{ color: "inherit" }}>
              Lokasi
            </a>
          </nav>
          <a
            href={whatsappLink("Halo, saya ingin booking sesi fisioterapi.")}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: COLOR.earth }}
          >
            Book Appointment
          </a>
        </div>
      </header>

      <div className="border-b py-3 text-center text-sm" style={{ borderColor: "rgba(46,40,34,0.08)", backgroundColor: COLOR.creamAlt, color: COLOR.muted }}>
        Kini hadir di Ciangsana, Gunung Putri —{" "}
        <a href="#lokasi" className="font-semibold underline" style={{ color: COLOR.earth }}>
          lihat lokasi
        </a>
      </div>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 py-20 sm:py-28 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: COLOR.earth }}>
            Spesialis Cedera Otot · Bekasi
          </p>
          <h1
            className="mt-5 text-4xl leading-[1.15] sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Pulih, bergerak,
            <br />
            <span className="italic" style={{ fontWeight: 400 }}>
              kembali utuh.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: COLOR.muted }}>
            Fisioterapi spesialis cedera otot, ditangani langsung oleh fisioterapis
            berpengalaman dan berlisensi (STR) — untuk memulihkan mobilitas dan kualitas hidup
            Anda.
          </p>
          <a
            href={whatsappLink("Halo, saya ingin booking sesi fisioterapi.")}
            className="mt-9 inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-white"
            style={{ backgroundColor: COLOR.earth }}
          >
            Jadwalkan Konsultasi
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt="Fisioterapis menangani pasien"
            className="h-[420px] w-full object-cover"
          />
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: COLOR.creamAlt }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center sm:text-left">
              <h3 className="text-lg" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 py-24 lg:grid-cols-2">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <span
            className="text-7xl sm:text-8xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: COLOR.earth }}
          >
            STR
          </span>
          <p className="mt-2 text-sm" style={{ color: COLOR.muted }}>
            Fisioterapis Bersertifikat &amp; Berlisensi Resmi
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Fisioterapi yang disesuaikan untuk Anda
          </h2>
          <p className="mt-4 leading-relaxed" style={{ color: COLOR.muted }}>
            Setiap pasien punya riwayat dan kondisi yang berbeda. Kami menyusun evaluasi dan
            rencana terapi secara personal — bukan satu program untuk semua orang — supaya
            pemulihan Anda lebih tepat sasaran.
          </p>
          <a
            href="#layanan"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: COLOR.earth }}
          >
            Lihat layanan kami →
          </a>
        </div>
      </section>

      <section id="alur" className="py-24" style={{ backgroundColor: COLOR.creamAlt }}>
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className="text-center text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Empat langkah menuju pulih
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.number} className="rounded-2xl bg-white p-7">
                <span
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: COLOR.earth }}
                >
                  {s.number}
                </span>
                <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="layanan" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Layanan kami
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <div key={s.title} className="overflow-hidden rounded-2xl" style={{ backgroundColor: COLOR.creamAlt }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title} className="h-48 w-full object-cover" />
                <div className="p-7">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                    {s.description}
                  </p>
                  <a
                    href={whatsappLink(`Halo, saya ingin konsultasi soal ${s.title.toLowerCase()}.`)}
                    className="mt-4 inline-block text-sm font-semibold"
                    style={{ color: COLOR.earth }}
                  >
                    Konsultasi sekarang →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: COLOR.creamAlt }}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Tentang Pulih Fisioterapi
          </h2>
          <p className="mt-4 leading-relaxed" style={{ color: COLOR.muted }}>
            Kami klinik fisioterapi yang fokus menangani cedera otot — dari cedera olahraga
            sampai nyeri akibat aktivitas harian. Pendekatan kami mengutamakan evaluasi
            menyeluruh dan gerak aktif sebagai bagian dari proses pemulihan, bukan sekadar
            modalitas pasif.
          </p>
        </div>
      </section>

      <section id="tim" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Tim fisioterapis kami
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TEAM.map((t) => (
              <div key={t.name} className="overflow-hidden rounded-2xl text-center" style={{ backgroundColor: COLOR.creamAlt }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.photo}
                  alt={t.name}
                  className="h-56 w-full object-cover"
                  style={{ objectPosition: "50% 15%" }}
                />
                <div className="p-4">
                  <h3 className="text-base font-semibold">{t.name}</h3>
                  <p className="mt-1 text-sm" style={{ color: COLOR.muted }}>
                    Fisioterapis
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: COLOR.creamAlt }}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Galeri
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GALLERY.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt="Suasana sesi fisioterapi"
                className="h-40 w-full rounded-xl object-cover sm:h-52"
              />
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2
            className="text-center text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Pertanyaan umum
          </h2>
          <div className="mt-12 divide-y" style={{ borderColor: "rgba(46,40,34,0.1)" }}>
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5" style={{ borderColor: "rgba(46,40,34,0.1)" }}>
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
                  {f.q}
                  <span className="ml-4 text-xl" style={{ color: COLOR.earth }}>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="lokasi" className="py-24 text-center" style={{ backgroundColor: COLOR.creamAlt }}>
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            Lokasi
          </h2>
          <p className="mt-3" style={{ color: COLOR.muted }}>
            {CLINIC_ADDRESS}
          </p>
          <div className="mt-8">
            <a
              href={whatsappLink("Halo, saya ingin tanya-tanya soal fisioterapi.")}
              className="inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-white"
              style={{ backgroundColor: COLOR.earth }}
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="py-16" style={{ backgroundColor: COLOR.ink, color: "rgba(255,255,255,0.6)" }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
          <div>
            <Logo variant="light" />
            <p className="mt-3 max-w-xs text-sm">
              Klinik fisioterapi spesialis cedera otot, ditangani fisioterapis berlisensi (STR).
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Navigasi</h4>
            <ul className="mt-3 space-y-2 text-sm">
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
                <a href="#faq" className="hover:text-white">
                  FAQ
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
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Kontak</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={whatsappLink("Halo, saya ingin tanya-tanya soal fisioterapi.")} className="hover:text-white">
                  WhatsApp: {WHATSAPP_NUMBER}
                </a>
              </li>
              <li>{CLINIC_ADDRESS}</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t px-4 pt-6 text-center text-xs" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          © {new Date().getFullYear()} Pulih Fisioterapi ·{" "}
          <a href="/login" className="hover:text-white">
            Login Staff
          </a>
        </div>
      </footer>
    </div>
  );
}
