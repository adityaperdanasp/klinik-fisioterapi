"use client";

import { useEffect, useState } from "react";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { Logo } from "./components/Logo";

const WHATSAPP_NUMBER = "6281322043022";
const CONTACT_EMAIL = "cs@pulihfisioterapi.id";
const CLINIC_ADDRESS =
  "Ruko Concordia & Trafalgar Blok SE1 No. 29, Ciangsana, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16968";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC_ADDRESS)}`;

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

type Lang = "id" | "en";

// Aset (foto/video) nggak beda antar bahasa — cuma teksnya yang beda. Data
// ini dipisah dari CONTENT (dictionary teks di bawah) terus digabung lagi
// pas render lewat index array yang sama.
const SERVICE_ASSETS = [
  { image: "/photos/service-cedera-otot.jpg" },
  { image: "/photos/service-rehab-olahraga.jpg", imagePosition: "center 85%" },
  { image: "/photos/service-nyeri-sendi.jpg" },
  { image: "/photos/service-konsultasi.jpg" },
];

const HERO_IMAGE = "/photos/hero-athlete-knee.jpg";

const GALLERY: { type: "image" | "video"; src: string }[] = [
  { type: "video", src: "/videos/hands-therapy.mp4" },
  { type: "image", src: "/photos/gallery-elderly-home.jpg" },
  { type: "image", src: "/photos/gallery-consultation.jpg" },
  { type: "video", src: "/videos/foot-therapy.mp4" },
];

// Foto placeholder (stok) sampai ada foto staff asli — lihat catatan di CLAUDE.md.
// Nama orang nggak diterjemahin, sama di kedua bahasa.
const TEAM = [
  { name: "Erwin", photo: "/team/erwin.jpg" },
  { name: "Mia", photo: "/team/mia.jpg" },
  { name: "Fitria", photo: "/team/fitria.jpg" },
  { name: "Dhea", photo: "/team/dhea.jpg" },
];

const CONTENT: Record<
  Lang,
  {
    nav: { layanan: string; alur: string; tim: string; faq: string; lokasi: string };
    bookBtn: string;
    banner: { text: string; link: string };
    hero: { badge: string; titleLine1: string; titleItalic: string; desc: string; cta: string; heroAlt: string };
    features: { title: string; description: string }[];
    trust: { label: string; heading: string; desc: string; link: string };
    steps: { heading: string; items: { number: string; title: string; description: string }[] };
    services: { heading: string; ctaLabel: string; items: { title: string; description: string }[] };
    about: { heading: string; desc: string };
    team: { heading: string; role: string };
    gallery: { heading: string; videoAlt: string };
    faq: { heading: string; items: { q: string; a: string }[] };
    location: { heading: string; mapLink: string; chatBtn: string };
    footer: { desc: string; navHeading: string; contactHeading: string; loginStaff: string };
    whatsapp: { book: string; ask: string; consultPrefix: (title: string) => string };
  }
> = {
  id: {
    nav: { layanan: "Layanan", alur: "Alur Pelayanan", tim: "Tim", faq: "FAQ", lokasi: "Lokasi" },
    bookBtn: "Book Appointment",
    banner: { text: "Kini hadir di Ciangsana, Gunung Putri —", link: "lihat lokasi" },
    hero: {
      badge: "Spesialis Cedera Otot · Bekasi",
      titleLine1: "Pulih, bergerak,",
      titleItalic: "kembali utuh.",
      desc: "Fisioterapi spesialis cedera otot, ditangani langsung oleh fisioterapis berpengalaman dan berlisensi (STR) — untuk memulihkan mobilitas dan kualitas hidup Anda.",
      cta: "Jadwalkan Konsultasi",
      heroAlt: "Fisioterapis menangani pasien",
    },
    features: [
      { title: "Sesi 1-on-1", description: "Setiap sesi ditangani langsung oleh satu fisioterapis, fokus penuh ke kondisi Anda." },
      { title: "Program Personal", description: "Rencana terapi disusun sesuai kondisi dan target pemulihan — bukan program generik." },
      { title: "Fisioterapis Berlisensi", description: "Ditangani oleh fisioterapis dengan STR (Surat Tanda Registrasi) resmi." },
    ],
    trust: {
      label: "Fisioterapis Bersertifikat & Berlisensi Resmi",
      heading: "Fisioterapi yang disesuaikan untuk Anda",
      desc: "Setiap pasien punya riwayat dan kondisi yang berbeda. Kami menyusun evaluasi dan rencana terapi secara personal — bukan satu program untuk semua orang — supaya pemulihan Anda lebih tepat sasaran.",
      link: "Lihat layanan kami →",
    },
    steps: {
      heading: "Empat langkah menuju pulih",
      items: [
        { number: "01", title: "Konsultasi Awal", description: "Ceritakan keluhan Anda ke fisioterapis kami. Kami periksa langsung untuk menemukan akar masalah cedera otot Anda." },
        { number: "02", title: "Rencana Terapi", description: "Program pemulihan disusun sesuai kondisi dan target Anda — bukan pendekatan yang sama untuk semua orang." },
        { number: "03", title: "Sesi Terapi", description: "Penanganan langsung oleh fisioterapis: manajemen nyeri, mobilisasi otot, sampai latihan penguatan bertahap." },
        { number: "04", title: "Pantau Progres", description: "Perkembangan dicek tiap sesi, supaya pemulihan tetap terarah dan hasilnya bertahan lama." },
      ],
    },
    services: {
      heading: "Layanan kami",
      ctaLabel: "Konsultasi sekarang →",
      items: [
        { title: "Terapi Cedera Otot", description: "Penanganan cedera otot akut maupun kronis dengan pendekatan berbasis evaluasi fisioterapis." },
        { title: "Rehabilitasi Pasca Cedera Olahraga", description: "Program pemulihan bertahap untuk kembali beraktivitas dan berolahraga dengan aman." },
        { title: "Terapi Nyeri Otot & Sendi", description: "Penanganan nyeri punggung, bahu, lutut, dan sendi lain akibat aktivitas atau postur." },
        { title: "Konsultasi & Evaluasi Awal", description: "Pemeriksaan awal untuk menentukan diagnosa dan rencana terapi yang tepat." },
      ],
    },
    about: {
      heading: "Tentang Pulih Fisioterapi",
      desc: "Kami klinik fisioterapi yang fokus menangani cedera otot — dari cedera olahraga sampai nyeri akibat aktivitas harian. Pendekatan kami mengutamakan evaluasi menyeluruh dan gerak aktif sebagai bagian dari proses pemulihan, bukan sekadar modalitas pasif.",
    },
    team: { heading: "Tim fisioterapis kami", role: "Fisioterapis" },
    gallery: { heading: "Galeri", videoAlt: "Suasana sesi fisioterapi" },
    faq: {
      heading: "Pertanyaan umum",
      items: [
        { q: "Apakah saya perlu rujukan dokter untuk booking sesi fisioterapi?", a: "Tidak wajib. Anda bisa langsung booking konsultasi awal, fisioterapis kami akan melakukan evaluasi untuk menentukan rencana terapi yang tepat." },
        { q: "Berapa lama satu sesi terapi berlangsung?", a: "Setiap sesi berlangsung sekitar 50 menit, mencakup evaluasi kondisi terkini dan penanganan langsung oleh fisioterapis." },
        { q: "Bagaimana cara reschedule atau membatalkan jadwal?", a: "Hubungi kami via WhatsApp sesegera mungkin sebelum jadwal Anda, kami akan bantu atur ulang sesuai ketersediaan ruang dan fisioterapis." },
        { q: "Apakah fisioterapis di sini berlisensi resmi?", a: "Ya, seluruh fisioterapis kami memiliki STR (Surat Tanda Registrasi) yang aktif." },
        { q: "Apa yang harus saya bawa atau kenakan saat sesi pertama?", a: "Kenakan pakaian yang nyaman dan memungkinkan pergerakan bebas pada area yang akan ditangani. Bawa hasil pemeriksaan medis sebelumnya jika ada." },
      ],
    },
    location: { heading: "Lokasi", mapLink: "Buka di Google Maps", chatBtn: "Chat WhatsApp" },
    footer: {
      desc: "Klinik fisioterapi spesialis cedera otot, ditangani fisioterapis berlisensi (STR).",
      navHeading: "Navigasi",
      contactHeading: "Kontak",
      loginStaff: "Login Staff",
    },
    whatsapp: {
      book: "Halo, saya ingin booking sesi fisioterapi.",
      ask: "Halo, saya ingin tanya-tanya soal fisioterapi.",
      consultPrefix: (title) => `Halo, saya ingin konsultasi soal ${title.toLowerCase()}.`,
    },
  },
  en: {
    nav: { layanan: "Services", alur: "Our Process", tim: "Team", faq: "FAQ", lokasi: "Location" },
    bookBtn: "Book Appointment",
    banner: { text: "Now open in Ciangsana, Gunung Putri —", link: "view location" },
    hero: {
      badge: "Muscle Injury Specialist · Bekasi",
      titleLine1: "Heal, move,",
      titleItalic: "feel whole again.",
      desc: "Specialized muscle injury physiotherapy, treated directly by experienced, licensed physiotherapists (STR) — to restore your mobility and quality of life.",
      cta: "Schedule a Consultation",
      heroAlt: "Physiotherapist treating a patient",
    },
    features: [
      { title: "1-on-1 Sessions", description: "Every session is handled by one dedicated physiotherapist, fully focused on your condition." },
      { title: "Personalized Program", description: "Treatment plans built around your condition and recovery goals — never a one-size-fits-all program." },
      { title: "Licensed Physiotherapists", description: "Treated by physiotherapists holding an official STR registration license." },
    ],
    trust: {
      label: "Certified & Officially Licensed Physiotherapists",
      heading: "Physiotherapy tailored to you",
      desc: "Every patient has a different history and condition. We build each evaluation and treatment plan individually — never one program for everyone — so your recovery stays on target.",
      link: "See our services →",
    },
    steps: {
      heading: "Four steps to recovery",
      items: [
        { number: "01", title: "Initial Consultation", description: "Tell our physiotherapist about your complaint. We examine you directly to find the root cause of your muscle injury." },
        { number: "02", title: "Treatment Plan", description: "A recovery program built around your condition and goals — not a one-size-fits-all approach." },
        { number: "03", title: "Therapy Session", description: "Hands-on treatment from your physiotherapist: pain management, muscle mobilization, and progressive strengthening exercises." },
        { number: "04", title: "Progress Monitoring", description: "Your progress is checked every session, keeping recovery on track for lasting results." },
      ],
    },
    services: {
      heading: "Our Services",
      ctaLabel: "Consult now →",
      items: [
        { title: "Muscle Injury Therapy", description: "Treatment for both acute and chronic muscle injuries, based on thorough physiotherapist evaluation." },
        { title: "Post-Sports Injury Rehabilitation", description: "A gradual recovery program to safely return to activity and sport." },
        { title: "Muscle & Joint Pain Therapy", description: "Treatment for back, shoulder, knee, and other joint pain caused by activity or posture." },
        { title: "Consultation & Initial Evaluation", description: "An initial exam to determine the right diagnosis and treatment plan." },
      ],
    },
    about: {
      heading: "About Pulih Fisioterapi",
      desc: "We're a physiotherapy clinic focused on muscle injuries — from sports injuries to pain from everyday activity. Our approach prioritizes thorough evaluation and active movement as part of recovery, not just passive treatment.",
    },
    team: { heading: "Our Physiotherapy Team", role: "Physiotherapist" },
    gallery: { heading: "Gallery", videoAlt: "Physiotherapy session in progress" },
    faq: {
      heading: "Frequently Asked Questions",
      items: [
        { q: "Do I need a doctor's referral to book a physiotherapy session?", a: "Not required. You can book an initial consultation directly — our physiotherapist will evaluate you to determine the right treatment plan." },
        { q: "How long does one therapy session last?", a: "Each session lasts about 50 minutes, including a check on your current condition and hands-on treatment from your physiotherapist." },
        { q: "How do I reschedule or cancel my appointment?", a: "Message us on WhatsApp as early as possible before your appointment, and we'll help reschedule based on room and physiotherapist availability." },
        { q: "Are the physiotherapists here officially licensed?", a: "Yes, all our physiotherapists hold an active STR (official registration license)." },
        { q: "What should I bring or wear for my first session?", a: "Wear comfortable clothing that allows free movement in the area being treated. Bring any previous medical exam results, if you have them." },
      ],
    },
    location: { heading: "Location", mapLink: "Open in Google Maps", chatBtn: "Chat on WhatsApp" },
    footer: {
      desc: "A muscle injury specialist physiotherapy clinic, treated by licensed (STR) physiotherapists.",
      navHeading: "Navigation",
      contactHeading: "Contact",
      loginStaff: "Staff Login",
    },
    whatsapp: {
      book: "Hi, I'd like to book a physiotherapy session.",
      ask: "Hi, I have some questions about physiotherapy.",
      consultPrefix: (title) => `Hi, I'd like to consult about ${title.toLowerCase()}.`,
    },
  },
};

function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("id");

  // Toggle bahasa client-side — SSR/first paint selalu Indonesia (default),
  // baru dikoreksi ke pilihan tersimpan (kalau ada) setelah hydrate. Ini
  // trade-off yang disadari: versi Inggris nggak ke-index Google (beda dari
  // pendekatan /en URL terpisah), tapi jauh lebih simpel buat sekarang.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pulih_lang");
      if (saved === "en" || saved === "id") setLang(saved);
    } catch {
      // localStorage bisa nggak ke-akses (private mode dll) — abaikan, tetap default id.
    }
  }, []);

  function toggleLang() {
    const next: Lang = lang === "id" ? "en" : "id";
    setLang(next);
    try {
      localStorage.setItem("pulih_lang", next);
    } catch {
      // nggak masalah kalau gagal disimpan, cuma nggak keinget pas kunjungan berikutnya.
    }
  }

  const t = CONTENT[lang];

  const LangToggle = (
    <button
      type="button"
      onClick={toggleLang}
      className="rounded-full border px-3 py-1.5 text-xs font-semibold"
      style={{ borderColor: COLOR.earth, color: COLOR.earth }}
      aria-label={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      {lang === "id" ? "EN" : "ID"}
    </button>
  );

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
              {t.nav.layanan}
            </a>
            <a href="#alur" style={{ color: "inherit" }}>
              {t.nav.alur}
            </a>
            <a href="#tim" style={{ color: "inherit" }}>
              {t.nav.tim}
            </a>
            <a href="#faq" style={{ color: "inherit" }}>
              {t.nav.faq}
            </a>
            <a href="#lokasi" style={{ color: "inherit" }}>
              {t.nav.lokasi}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {LangToggle}
            <a
              href={whatsappLink(t.whatsapp.book)}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: COLOR.earth }}
            >
              {t.bookBtn}
            </a>
          </div>
        </div>
      </header>

      <div className="border-b py-3 text-center text-sm" style={{ borderColor: "rgba(46,40,34,0.08)", backgroundColor: COLOR.creamAlt, color: COLOR.muted }}>
        {t.banner.text}{" "}
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
          style={{ color: COLOR.earth }}
        >
          {t.banner.link}
        </a>
      </div>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 py-20 sm:py-28 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: COLOR.earth }}>
            {t.hero.badge}
          </p>
          <h1
            className="mt-5 text-4xl leading-[1.15] sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {t.hero.titleLine1}
            <br />
            <span className="italic" style={{ fontWeight: 400 }}>
              {t.hero.titleItalic}
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: COLOR.muted }}>
            {t.hero.desc}
          </p>
          <a
            href={whatsappLink(t.whatsapp.book)}
            className="mt-9 inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-white"
            style={{ backgroundColor: COLOR.earth }}
          >
            {t.hero.cta}
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt={t.hero.heroAlt}
            className="h-[420px] w-full object-cover"
          />
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: COLOR.creamAlt }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:grid-cols-3">
          {t.features.map((f) => (
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
            {t.trust.label}
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {t.trust.heading}
          </h2>
          <p className="mt-4 leading-relaxed" style={{ color: COLOR.muted }}>
            {t.trust.desc}
          </p>
          <a
            href="#layanan"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: COLOR.earth }}
          >
            {t.trust.link}
          </a>
        </div>
      </section>

      <section id="alur" className="py-24" style={{ backgroundColor: COLOR.creamAlt }}>
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className="text-center text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {t.steps.heading}
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.items.map((s) => (
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
            {t.services.heading}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {t.services.items.map((s, i) => {
              const asset = SERVICE_ASSETS[i];
              return (
                <div key={s.title} className="overflow-hidden rounded-2xl" style={{ backgroundColor: COLOR.creamAlt }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.image}
                    alt={s.title}
                    className="h-48 w-full object-cover"
                    style={{ objectPosition: asset.imagePosition ?? "center" }}
                  />
                  <div className="p-7">
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                      {s.description}
                    </p>
                    <a
                      href={whatsappLink(t.whatsapp.consultPrefix(s.title))}
                      className="mt-4 inline-block text-sm font-semibold"
                      style={{ color: COLOR.earth }}
                    >
                      {t.services.ctaLabel}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: COLOR.creamAlt }}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {t.about.heading}
          </h2>
          <p className="mt-4 leading-relaxed" style={{ color: COLOR.muted }}>
            {t.about.desc}
          </p>
        </div>
      </section>

      <section id="tim" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {t.team.heading}
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TEAM.map((m) => (
              <div key={m.name} className="overflow-hidden rounded-2xl text-center" style={{ backgroundColor: COLOR.creamAlt }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.photo}
                  alt={m.name}
                  className="h-56 w-full object-cover"
                  style={{ objectPosition: "50% 15%" }}
                />
                <div className="p-4">
                  <h3 className="text-base font-semibold">{m.name}</h3>
                  <p className="mt-1 text-sm" style={{ color: COLOR.muted }}>
                    {t.team.role}
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
            {t.gallery.heading}
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GALLERY.map((item) =>
              item.type === "video" ? (
                <video
                  key={item.src}
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-40 w-full rounded-xl object-cover sm:h-52"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.src}
                  src={item.src}
                  alt={t.gallery.videoAlt}
                  className="h-40 w-full rounded-xl object-cover sm:h-52"
                />
              )
            )}
          </div>
        </div>
      </section>

      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2
            className="text-center text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {t.faq.heading}
          </h2>
          <div className="mt-12 divide-y" style={{ borderColor: "rgba(46,40,34,0.1)" }}>
            {t.faq.items.map((f) => (
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
            {t.location.heading}
          </h2>
          <p className="mt-3" style={{ color: COLOR.muted }}>
            {CLINIC_ADDRESS}
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-semibold underline"
            style={{ color: COLOR.earth }}
          >
            {t.location.mapLink}
          </a>
          <div className="mt-8">
            <a
              href={whatsappLink(t.whatsapp.ask)}
              className="inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-white"
              style={{ backgroundColor: COLOR.earth }}
            >
              {t.location.chatBtn}
            </a>
          </div>
        </div>
      </section>

      <footer className="py-16" style={{ backgroundColor: COLOR.ink, color: "rgba(255,255,255,0.6)" }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
          <div>
            <Logo variant="light" />
            <p className="mt-3 max-w-xs text-sm">{t.footer.desc}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">{t.footer.navHeading}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#layanan" className="hover:text-white">
                  {t.nav.layanan}
                </a>
              </li>
              <li>
                <a href="#alur" className="hover:text-white">
                  {t.nav.alur}
                </a>
              </li>
              <li>
                <a href="#tim" className="hover:text-white">
                  {t.nav.tim}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white">
                  {t.nav.faq}
                </a>
              </li>
              <li>
                <a href="#lokasi" className="hover:text-white">
                  {t.nav.lokasi}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">{t.footer.contactHeading}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>{CLINIC_ADDRESS}</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t px-4 pt-6 text-center text-xs" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          © {new Date().getFullYear()} Pulih Fisioterapi ·{" "}
          <a href="/login" className="hover:text-white">
            {t.footer.loginStaff}
          </a>
        </div>
      </footer>
    </div>
  );
}
