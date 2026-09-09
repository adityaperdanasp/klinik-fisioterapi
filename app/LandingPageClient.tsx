"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { Logo } from "./components/Logo";

const WHATSAPP_NUMBER = "6281322043022";
const CONTACT_EMAIL = "cs@pulihfisioterapi.id";
const CLINIC_ADDRESS =
  "Ruko Concordia & Trafalgar Blok SE1 No. 29, Ciangsana, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16968";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC_ADDRESS)}`;
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(CLINIC_ADDRESS)}&output=embed`;

// Design system: warm cream / earth-tone palette (light) + versi gelapnya
// (dark), inspired by the calm luxury-wellness reference the user shared —
// colors and layout genre are ours to reuse, copy/photos are original.
//
// Kontras warna (WCAG) di-audit pakai perhitungan luminance manual buat
// dua-duanya. Light: `earth` (#96754A) di atas cream cuma ~3.4-3.9:1, GAGAL
// AA teks normal — dipakai `earthDark` (#7A5D39, 4.9-6.1:1) buat semua teks/
// tombol kecil, `earth` yang lebih terang cuma buat dekorasi besar (large
// text WCAG, ambang 3:1). Dark: semua pasangan di bawah lolos AA (7-14.5:1).
// `accent2` = warna komplemen (deep sage) buat variasi/penekanan kecil —
// icon badge, garis penyambung section, quote mark testimoni — biar nggak
// "coklat semua" tapi tetap satu keluarga earth-tone. Sama kayak accent,
// diambil di lightness yang mirip biar kontras AA-nya konsisten (light:
// dark buat teks/bg-kecil, dark: terang buat kontras di background gelap).
const LIGHT_COLOR = {
  bg: "#FAF5EE",
  bgAlt: "#F1E6D6",
  accentBright: "#96754A",
  accent: "#7A5D39",
  accent2: "#3F5C4E",
  ink: "#231F1A",
  muted: "#57503F",
};

const DARK_COLOR = {
  bg: "#1D1A16",
  bgAlt: "#26221D",
  accentBright: "#C79A6A",
  accent: "#D3A972",
  accent2: "#8FBBA6",
  ink: "#F2EAE0",
  muted: "#B9AC9A",
};

// Warna bintang rating testimoni — sengaja gold universal (bukan earth-tone
// kita), sama kayak alasan warna hijau WhatsApp dipertahankan: orang udah
// asosiasikan warna ini sama "rating", ganti ke accent bakal bikin nggak
// kebaca sebagai bintang.
const STAR_COLOR = "#D6A94A";

// Foto stok yang dikurasi dari berbagai sumber punya white-balance beda-beda
// (sebagian warm, sebagian studio abu-abu/dingin) — filter tipis ini
// nyeragamin ke arah warm yang sama kayak video hero, tanpa perlu edit ulang
// tiap file foto. Dipakai di semua foto stok (layanan, tim, galeri), BUKAN
// di logo atau ikon.
const PHOTO_FILTER = "saturate(1.08) contrast(1.03) sepia(0.08)";

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
type Theme = "light" | "dark";

// Aset (foto/video) nggak beda antar bahasa — cuma teksnya yang beda. Data
// ini dipisah dari CONTENT (dictionary teks di bawah) terus digabung lagi
// pas render lewat index array yang sama.
const SERVICE_ASSETS = [
  { image: "/photos/service-cedera-otot.jpg" },
  { image: "/photos/service-rehab-olahraga.jpg", imagePosition: "center 20%" },
  { image: "/photos/service-nyeri-sendi.jpg" },
  { image: "/photos/service-konsultasi.jpg" },
];

// Icon per item, urutan sama kayak array teksnya (CONTENT.*.features /
// steps.items) — dipisah dari teks karena ikon nggak beda antar bahasa.
// Function component di sini di-hoist duluan sama JS, jadi aman dirujuk
// walau definisinya (UserIcon dkk) ada di bawah.
const FEATURE_ICONS = [UserIcon, TargetIcon, ShieldCheckIcon];
const STEP_ICONS = [ChatIcon, ClipboardIcon, ActivityIcon, TrendingUpIcon];

const HERO_VIDEO = "/videos/hero-physio-treatment.mp4";
const HERO_POSTER = "/photos/hero-physio-poster.jpg";

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

// Angka FAKTUAL buat stat band — bisa diverifikasi dari data yang udah ada
// di halaman ini juga (jumlah TEAM, durasi sesi di FAQ, jam operasional di
// section Lokasi). "4" dihitung dari TEAM.length biar otomatis ke-update
// kalau roster berubah, bukan angka lepas yang bisa basi.
const STATS_VALUES = [String(TEAM.length), "60", "7"];

// Angka PLACEHOLDER — user eksplisit minta ditambah "jumlah klien" & "rating
// kepuasan" (kayak referensi web bisnis lain), tapi klinik ini nyata & masih
// early-stage, BELUM ada data pasien/review asli buat angka ini (beda kasus
// sama STATS_VALUES di atas yang semuanya bisa diverifikasi dari halaman
// sendiri). User udah dikasih tau & pilih eksplisit "placeholder dulu" —
// WAJIB diganti angka asli (atau section-nya disesuaikan) sebelum go-live
// publik, dicatat juga di TODO CLAUDE.md.
const PLACEHOLDER_STATS_VALUES = ["150+", "95%"];

// Urutan gabungan harus PERSIS sama kayak urutan `stats.items` di CONTENT.*
// (placeholder duluan, baru yang faktual) — dipisah dari deklarasi array-nya
// sendiri biar nggak ke-alokasi ulang tiap render (list-nya statis).
const ALL_STATS_VALUES = [...PLACEHOLDER_STATS_VALUES, ...STATS_VALUES];

// Testimoni PLACEHOLDER — nama & kutipan REKAAN, belum ada testimoni pasien
// asli. Sama kayak foto tim, ini WAJIB diganti sebelum go-live publik (lihat
// TODO di CLAUDE.md). Sengaja nggak dibikin mirip widget review platform
// tertentu (nggak ada bintang/logo Google dsb) — biar jelas ini kutipan di
// halaman sendiri, bukan klaim "review terverifikasi" dari pihak ketiga.
const TESTIMONIAL_ASSETS = [{ initials: "BS" }, { initials: "RW" }, { initials: "AF" }];

const SECTION_IDS = ["layanan", "alur", "tim", "faq", "lokasi"] as const;

const CONTENT: Record<
  Lang,
  {
    nav: { layanan: string; alur: string; tim: string; faq: string; lokasi: string };
    bookBtn: string;
    banner: { text: string; link: string; hoursPrefix: string };
    hero: { badge: string; titleLine1: string; titleItalic: string; desc: string; cta: string; trustChips: string[] };
    stats: { items: { label: string }[] };
    features: { title: string; description: string }[];
    trust: { eyebrow: string; label: string; heading: string; desc: string; link: string };
    steps: { eyebrow: string; heading: string; items: { number: string; title: string; description: string }[] };
    services: { eyebrow: string; heading: string; ctaLabel: string; items: { title: string; description: string }[] };
    about: { eyebrow: string; heading: string; desc: string };
    team: { eyebrow: string; heading: string; role: string; bios: string[] };
    testimonials: { eyebrow: string; heading: string; disclaimer: string; items: { name: string; note: string; quote: string }[] };
    gallery: { eyebrow: string; heading: string; alt: string[] };
    faq: { eyebrow: string; heading: string; items: { q: string; a: string }[] };
    location: { eyebrow: string; heading: string; mapLink: string; chatBtn: string; hoursHeading: string; hoursSchedule: string };
    footer: { desc: string; navHeading: string; contactHeading: string; loginStaff: string };
    whatsapp: { book: string; ask: string; visit: string; consultPrefix: (title: string) => string };
    backToTop: string;
    waFloatLabel: string;
    themeToggle: string;
    close: string;
  }
> = {
  id: {
    nav: { layanan: "Layanan", alur: "Alur Pelayanan", tim: "Tim", faq: "FAQ", lokasi: "Lokasi" },
    bookBtn: "Booking Sekarang",
    banner: { text: "Kini hadir di Ciangsana, Gunung Putri —", link: "lihat lokasi", hoursPrefix: "Buka" },
    hero: {
      badge: "Spesialis Cedera Otot · Bekasi",
      titleLine1: "Pulih, bergerak,",
      titleItalic: "kembali utuh.",
      desc: "Fisioterapi spesialis cedera otot, ditangani langsung oleh fisioterapis berpengalaman dan berlisensi (STR) — untuk memulihkan mobilitas dan kualitas hidup Anda.",
      cta: "Jadwalkan Konsultasi",
      trustChips: ["Tanpa rujukan dokter", "Respon cepat via WA", "Fisioterapis berlisensi (STR)"],
    },
    stats: {
      items: [
        { label: "Pasien Ditangani" },
        { label: "Kepuasan Pasien" },
        { label: "Fisioterapis Berlisensi (STR)" },
        { label: "Menit per Sesi" },
        { label: "Buka Setiap Hari" },
      ],
    },
    features: [
      { title: "Sesi 1-on-1", description: "Setiap sesi ditangani langsung oleh satu fisioterapis, fokus penuh ke kondisi Anda." },
      { title: "Program Personal", description: "Rencana terapi disusun sesuai kondisi dan target pemulihan — bukan program generik." },
      { title: "Fisioterapis Berlisensi", description: "Ditangani oleh fisioterapis dengan STR (Surat Tanda Registrasi) resmi." },
    ],
    trust: {
      eyebrow: "Kenapa Pulih Fisioterapi",
      label: "Fisioterapis Bersertifikat & Berlisensi Resmi",
      heading: "Fisioterapi yang disesuaikan untuk Anda",
      desc: "Setiap pasien punya riwayat dan kondisi yang berbeda. Kami menyusun evaluasi dan rencana terapi secara personal — bukan satu program untuk semua orang — supaya pemulihan Anda lebih tepat sasaran.",
      link: "Lihat layanan kami →",
    },
    steps: {
      eyebrow: "Cara Kerja",
      heading: "Empat langkah menuju pulih",
      items: [
        { number: "01", title: "Konsultasi Awal", description: "Ceritakan keluhan Anda ke fisioterapis kami. Kami periksa langsung untuk menemukan akar masalah cedera otot Anda." },
        { number: "02", title: "Rencana Terapi", description: "Program pemulihan disusun sesuai kondisi dan target Anda — bukan pendekatan yang sama untuk semua orang." },
        { number: "03", title: "Sesi Terapi", description: "Penanganan langsung oleh fisioterapis: manajemen nyeri, mobilisasi otot, sampai latihan penguatan bertahap." },
        { number: "04", title: "Pantau Progres", description: "Perkembangan dicek tiap sesi, supaya pemulihan tetap terarah dan hasilnya bertahan lama." },
      ],
    },
    services: {
      eyebrow: "Apa yang Kami Tangani",
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
      eyebrow: "Profil Klinik",
      heading: "Tentang Pulih Fisioterapi",
      desc: "Kami klinik fisioterapi yang fokus menangani cedera otot — dari cedera olahraga sampai nyeri akibat aktivitas harian. Pendekatan kami mengutamakan evaluasi menyeluruh dan gerak aktif sebagai bagian dari proses pemulihan, bukan sekadar modalitas pasif.",
    },
    team: {
      eyebrow: "Kenalan dengan Tim",
      heading: "Tim fisioterapis kami",
      role: "Fisioterapis",
      // PLACEHOLDER — sama kayak foto & nama TEAM (belum staff asli, lihat
      // CLAUDE.md), teks spesialisasi & lama pengalaman di bawah ini karangan
      // sementara, WAJIB diganti data staff asli bareng foto sebelum go-live.
      bios: [
        "Spesialis cedera olahraga & rehabilitasi pasca operasi, 6+ tahun pengalaman.",
        "Spesialis nyeri punggung & postur kerja, 8+ tahun pengalaman.",
        "Spesialis terapi manual & mobilisasi sendi, 5+ tahun pengalaman.",
        "Spesialis rehabilitasi lansia & terapi di rumah, 4+ tahun pengalaman.",
      ],
    },
    testimonials: {
      eyebrow: "Cerita Pasien",
      heading: "Kata pasien kami",
      disclaimer: "*Testimoni pasien Pulih Fisioterapi. Hasil dapat berbeda tergantung kondisi masing-masing.",
      items: [
        { name: "Budi S.", note: "Pemulihan cedera lutut lari", quote: "Setelah beberapa sesi, lutut saya jauh lebih stabil buat lari lagi. Fisioterapisnya sabar jelasin tiap gerakan." },
        { name: "Rina W.", note: "Nyeri punggung kerja kantoran", quote: "Nyeri punggung yang udah bertahun-tahun akhirnya ketemu akar masalahnya. Programnya jelas, bukan cuma dipijat doang." },
        { name: "Ahmad F.", note: "Cedera bahu bulu tangkis", quote: "Bisa balik main bulu tangkis lagi tanpa nyeri. Progresnya kecek tiap sesi, jadi kerasa arahnya." },
      ],
    },
    gallery: {
      eyebrow: "Suasana di Klinik",
      heading: "Galeri",
      alt: [
        "Terapi manual pada tangan pasien",
        "Kunjungan terapi lansia di rumah",
        "Sesi konsultasi dengan fisioterapis",
        "Terapi manual pada kaki pasien",
      ],
    },
    faq: {
      eyebrow: "Bantuan",
      heading: "Pertanyaan umum",
      items: [
        { q: "Apakah saya perlu rujukan dokter untuk booking sesi fisioterapi?", a: "Tidak wajib. Anda bisa langsung booking konsultasi awal, fisioterapis kami akan melakukan evaluasi untuk menentukan rencana terapi yang tepat." },
        { q: "Berapa lama satu sesi terapi berlangsung?", a: "Setiap sesi berlangsung sekitar 60 menit, mencakup evaluasi kondisi terkini dan penanganan langsung oleh fisioterapis." },
        { q: "Bagaimana cara reschedule atau membatalkan jadwal?", a: "Hubungi kami via WhatsApp sesegera mungkin sebelum jadwal Anda, kami akan bantu atur ulang sesuai ketersediaan ruang dan fisioterapis." },
        { q: "Apakah fisioterapis di sini berlisensi resmi?", a: "Ya, seluruh fisioterapis kami memiliki STR (Surat Tanda Registrasi) yang aktif." },
        { q: "Apa yang harus saya bawa atau kenakan saat sesi pertama?", a: "Kenakan pakaian yang nyaman dan memungkinkan pergerakan bebas pada area yang akan ditangani. Bawa hasil pemeriksaan medis sebelumnya jika ada." },
      ],
    },
    location: {
      eyebrow: "Kunjungi Kami",
      heading: "Lokasi",
      mapLink: "Buka di Google Maps",
      chatBtn: "Chat WhatsApp",
      hoursHeading: "Jam Operasional",
      hoursSchedule: "Senin – Minggu, 08.30 – 21.00",
    },
    footer: {
      desc: "Klinik fisioterapi spesialis cedera otot, ditangani fisioterapis berlisensi (STR).",
      navHeading: "Navigasi",
      contactHeading: "Kontak",
      loginStaff: "Login Staff",
    },
    whatsapp: {
      book: "Halo, saya ingin booking sesi fisioterapi.",
      ask: "Halo, saya ingin tanya-tanya soal fisioterapi.",
      visit: "Halo, saya mau tanya soal jadwal kunjungan & lokasi klinik.",
      consultPrefix: (title) => `Halo, saya ingin konsultasi soal ${title.toLowerCase()}.`,
    },
    backToTop: "Kembali ke atas",
    waFloatLabel: "Chat WhatsApp",
    themeToggle: "Ganti tampilan gelap/terang",
    close: "Tutup",
  },
  en: {
    nav: { layanan: "Services", alur: "Our Process", tim: "Team", faq: "FAQ", lokasi: "Location" },
    bookBtn: "Book Appointment",
    banner: { text: "Now open in Ciangsana, Gunung Putri —", link: "view location", hoursPrefix: "Open" },
    hero: {
      badge: "Muscle Injury Specialist · Bekasi",
      titleLine1: "Heal, move,",
      titleItalic: "feel whole again.",
      desc: "Specialized muscle injury physiotherapy, treated directly by experienced, licensed physiotherapists (STR) — to restore your mobility and quality of life.",
      cta: "Schedule a Consultation",
      trustChips: ["No doctor referral needed", "Fast response via WhatsApp", "Licensed physiotherapists (STR)"],
    },
    stats: {
      items: [
        { label: "Patients Treated" },
        { label: "Patient Satisfaction" },
        { label: "Licensed Physiotherapists (STR)" },
        { label: "Minutes per Session" },
        { label: "Open Every Day" },
      ],
    },
    features: [
      { title: "1-on-1 Sessions", description: "Every session is handled by one dedicated physiotherapist, fully focused on your condition." },
      { title: "Personalized Program", description: "Treatment plans built around your condition and recovery goals — never a one-size-fits-all program." },
      { title: "Licensed Physiotherapists", description: "Treated by physiotherapists holding an official STR registration license." },
    ],
    trust: {
      eyebrow: "Why Pulih Fisioterapi",
      label: "Certified & Officially Licensed Physiotherapists",
      heading: "Physiotherapy tailored to you",
      desc: "Every patient has a different history and condition. We build each evaluation and treatment plan individually — never one program for everyone — so your recovery stays on target.",
      link: "See our services →",
    },
    steps: {
      eyebrow: "How It Works",
      heading: "Four steps to recovery",
      items: [
        { number: "01", title: "Initial Consultation", description: "Tell our physiotherapist about your complaint. We examine you directly to find the root cause of your muscle injury." },
        { number: "02", title: "Treatment Plan", description: "A recovery program built around your condition and goals — not a one-size-fits-all approach." },
        { number: "03", title: "Therapy Session", description: "Hands-on treatment from your physiotherapist: pain management, muscle mobilization, and progressive strengthening exercises." },
        { number: "04", title: "Progress Monitoring", description: "Your progress is checked every session, keeping recovery on track for lasting results." },
      ],
    },
    services: {
      eyebrow: "What We Treat",
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
      eyebrow: "Clinic Profile",
      heading: "About Pulih Fisioterapi",
      desc: "We're a physiotherapy clinic focused on muscle injuries — from sports injuries to pain from everyday activity. Our approach prioritizes thorough evaluation and active movement as part of recovery, not just passive treatment.",
    },
    team: {
      eyebrow: "Meet the Team",
      heading: "Our Physiotherapy Team",
      role: "Physiotherapist",
      bios: [
        "Sports injury & post-surgery rehab specialist, 6+ years of experience.",
        "Back pain & work posture specialist, 8+ years of experience.",
        "Manual therapy & joint mobilization specialist, 5+ years of experience.",
        "Elderly rehab & home therapy specialist, 4+ years of experience.",
      ],
    },
    testimonials: {
      eyebrow: "Patient Stories",
      heading: "What our patients say",
      disclaimer: "*Pulih Fisioterapi patient testimonial. Results may vary by individual condition.",
      items: [
        { name: "Budi S.", note: "Recovered from a running knee injury", quote: "After a few sessions my knee felt far more stable for running again. The physiotherapist patiently explained every movement." },
        { name: "Rina W.", note: "Office-work back pain", quote: "Years of back pain and we finally found the root cause. The program was structured, not just a massage." },
        { name: "Ahmad F.", note: "Badminton shoulder injury", quote: "I'm back playing badminton pain-free. Progress was checked every session, so I could feel it moving in the right direction." },
      ],
    },
    gallery: {
      eyebrow: "Inside the Clinic",
      heading: "Gallery",
      alt: [
        "Manual therapy on a patient's hand",
        "Home visit therapy for an elderly patient",
        "Consultation session with a physiotherapist",
        "Manual therapy on a patient's foot",
      ],
    },
    faq: {
      eyebrow: "Help",
      heading: "Frequently Asked Questions",
      items: [
        { q: "Do I need a doctor's referral to book a physiotherapy session?", a: "Not required. You can book an initial consultation directly — our physiotherapist will evaluate you to determine the right treatment plan." },
        { q: "How long does one therapy session last?", a: "Each session lasts about 60 minutes, including a check on your current condition and hands-on treatment from your physiotherapist." },
        { q: "How do I reschedule or cancel my appointment?", a: "Message us on WhatsApp as early as possible before your appointment, and we'll help reschedule based on room and physiotherapist availability." },
        { q: "Are the physiotherapists here officially licensed?", a: "Yes, all our physiotherapists hold an active STR (official registration license)." },
        { q: "What should I bring or wear for my first session?", a: "Wear comfortable clothing that allows free movement in the area being treated. Bring any previous medical exam results, if you have them." },
      ],
    },
    location: {
      eyebrow: "Visit Us",
      heading: "Location",
      mapLink: "Open in Google Maps",
      chatBtn: "Chat on WhatsApp",
      hoursHeading: "Opening Hours",
      hoursSchedule: "Mon – Sun, 8:30 AM – 9:00 PM",
    },
    footer: {
      desc: "A muscle injury specialist physiotherapy clinic, treated by licensed (STR) physiotherapists.",
      navHeading: "Navigation",
      contactHeading: "Contact",
      loginStaff: "Staff Login",
    },
    whatsapp: {
      book: "Hi, I'd like to book a physiotherapy session.",
      ask: "Hi, I have some questions about physiotherapy.",
      visit: "Hi, I'd like to ask about visiting hours & the clinic's location.",
      consultPrefix: (title) => `Hi, I'd like to consult about ${title.toLowerCase()}.`,
    },
    backToTop: "Back to top",
    waFloatLabel: "Chat on WhatsApp",
    themeToggle: "Toggle dark/light mode",
    close: "Close",
  },
};

function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Fade-in-on-scroll — dipakai bungkus konten tiap section biar halaman
// kerasa lebih hidup pas di-scroll, bukan statis muncul semua sekaligus.
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Hormatin "reduce motion" OS-nya user — jangan nunggu observer sama
    // sekali, langsung tampilin. CSS global (globals.css) juga udah matiin
    // transition-duration buat kasus ini, ini nambahin biar kontennya nggak
    // perlu "nunggu" scroll-in dulu (bukan cuma animasinya doang yang mati).
    if (typeof IntersectionObserver === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);

    // Fallback keamanan: animasi ini progressive enhancement doang, BUKAN
    // fitur yang boleh bikin konten permanen nggak keliatan. Kalau observer-nya
    // entah kenapa nggak pernah fire (tab background, browser/extension aneh,
    // dll), paksa muncul aja setelah 1.5 detik — daripada teks ilang selamanya.
    const fallback = setTimeout(() => setVisible(true), 1500);

    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {children}
    </div>
  );
}

// Foto/video galeri pakai shimmer abu-abu sampai asetnya beneran selesai
// dimuat — biar nggak blank kosong dulu baru nongol mendadak.
function ShimmerMedia({
  children,
  bgAlt,
  ready,
  className = "",
}: {
  children: React.ReactNode;
  bgAlt: string;
  ready: boolean;
  className?: string;
}) {
  // `ready` dikontrol dari luar (LandingPageClient) lewat onLoad/onLoadedData
  // di elemen media di dalam `children` — komponen ini murni presentational,
  // nggak perlu tau caranya, cuma nampilin shimmer sampai `ready` jadi true.
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`} style={{ backgroundColor: bgAlt }}>
      {!ready && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ background: `linear-gradient(90deg, ${bgAlt}, rgba(255,255,255,0.35), ${bgAlt})` }}
        />
      )}
      <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s ease" }}>{children}</div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" fill="#fff" aria-hidden="true">
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.673 4.523 1.837 6.37L4 29l7.82-1.805A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.99 16.98c-.29.82-1.44 1.51-2.36 1.7-.63.13-1.45.24-4.22-.9-3.54-1.47-5.82-5.06-6-5.3-.18-.24-1.43-1.9-1.43-3.63 0-1.72.9-2.57 1.22-2.92.29-.32.64-.4.86-.4.21 0 .43 0 .62.01.2.01.46-.08.72.55.29.7.98 2.42 1.06 2.6.08.18.13.39.03.62-.1.24-.15.39-.3.6-.15.2-.31.46-.44.62-.15.18-.3.38-.13.68.17.3.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.35 1.45.29.14.46.12.63-.08.17-.2.72-.84.91-1.13.19-.29.38-.24.63-.14.26.09 1.65.78 1.93.92.29.14.48.21.55.33.07.13.07.72-.22 1.44Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

// Kicker + garis aksen kecil (accent2) + heading — dipakai berulang di 9
// section, ditarik jadi 1 komponen biar treatment-nya konsisten di semua
// tempat (dulu di-copy manual per section, gampang ke-drift). Garis kecil
// di bawah eyebrow ini juga jadi motif visual yang "menyambung" tiap
// section — bukan cuma blok warna ketemu blok warna doang.
function SectionHeading({
  eyebrow,
  heading,
  align = "left",
  accentColor,
  accent2Color,
}: {
  eyebrow: string;
  heading: string;
  align?: "left" | "center";
  accentColor: string;
  accent2Color: string;
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "text-center" : ""}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accentColor }}>
        {eyebrow}
      </p>
      <span
        className={`mt-3 block h-[3px] w-10 rounded-full ${centered ? "mx-auto" : ""}`}
        style={{ backgroundColor: accent2Color }}
        aria-hidden="true"
      />
      <h2
        className="mt-4 text-4xl leading-tight tracking-tight sm:text-5xl"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        {heading}
      </h2>
    </div>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill={STAR_COLOR} aria-hidden="true">
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.77l-5.21 2.74 1-5.79-4.21-4.1 5.82-.85L10 1.5Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.31 3.13-6 7-6s7 2.69 7 6" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5h16v11H8l-4 4V5Z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="4" width="12" height="17" rx="1.5" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M9 11h6M9 15h6" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h4l2 7 4-14 2 7h6" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export function LandingPageClient() {
  const [lang, setLang] = useState<Lang>("id");
  const [theme, setTheme] = useState<Theme>("light");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mediaReady, setMediaReady] = useState<Record<number, boolean>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

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

  // Tema: default ikutin preferensi sistem (prefers-color-scheme), user bisa
  // override manual lewat tombol — pilihan manual itu yang disimpen & menang
  // di kunjungan berikutnya.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pulih_theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        return;
      }
    } catch {
      // lanjut ke system preference di bawah kalau localStorage nggak ke-akses.
    }
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // Hero video background: dihentikan (freeze di poster frame) buat visitor
  // yang set prefers-reduced-motion — video full-bleed autoplay itu jenis
  // motion yang paling ganggu buat kondisi vestibular, konsisten sama
  // penanganan reduced-motion lain di komponen ini (lihat Reveal di bawah).
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  // Scroll-spy: nav link section yang lagi keliatan di-bold otomatis.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // Tombol "kembali ke atas" cuma muncul setelah scroll lumayan jauh.
  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lightbox galeri: Escape nutup, panah kiri/kanan pindah item — cuma
  // aktif pas lightbox lagi kebuka (listener di-attach/dilepas per buka-tutup,
  // bukan nempel terus di seluruh halaman).
  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? i : Math.min(i + 1, GALLERY.length - 1)));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? i : Math.max(i - 1, 0)));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  function toggleLang() {
    const next: Lang = lang === "id" ? "en" : "id";
    setLang(next);
    try {
      localStorage.setItem("pulih_lang", next);
    } catch {
      // nggak masalah kalau gagal disimpan, cuma nggak keinget pas kunjungan berikutnya.
    }
  }

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("pulih_theme", next);
    } catch {
      // nggak masalah kalau gagal disimpan.
    }
  }

  const t = CONTENT[lang];
  const COLOR = theme === "dark" ? DARK_COLOR : LIGHT_COLOR;
  const hairline = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(46,40,34,0.08)";

  function navLinkStyle(id: string): React.CSSProperties {
    return {
      color: activeSection === id ? COLOR.accent : "inherit",
      fontWeight: activeSection === id ? 700 : undefined,
      transition: "color 0.2s ease",
    };
  }

  function markReady(i: number) {
    setMediaReady((prev) => (prev[i] ? prev : { ...prev, [i]: true }));
  }

  {/* Dulu 2 elemen terpisah (lingkaran tema + pil bahasa) mepet-mepetan,
      kerasa ramai di header mobile — sekarang digabung jadi 1 pil aja,
      dipisah garis tipis di tengah biar tetap kebaca 2 aksi berbeda. */}
  const ToolbarToggles = (
    <div
      className="flex items-center overflow-hidden rounded-full border"
      style={{ borderColor: COLOR.accent }}
    >
      <button
        type="button"
        onClick={toggleTheme}
        className="flex h-8 w-8 items-center justify-center"
        style={{ color: COLOR.accent }}
        aria-label={t.themeToggle}
      >
        {theme === "light" ? <MoonIcon /> : <SunIcon />}
      </button>
      <span aria-hidden="true" className="h-4 w-px" style={{ backgroundColor: COLOR.accent, opacity: 0.4 }} />
      <button
        type="button"
        onClick={toggleLang}
        className="flex h-8 items-center px-3 text-xs font-semibold"
        style={{ color: COLOR.accent }}
        aria-label={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      >
        {lang === "id" ? "EN" : "ID"}
      </button>
    </div>
  );

  return (
    <div
      className={`${fraunces.variable} ${plexSans.variable} min-h-screen pb-[76px] sm:pb-0`}
      style={{ backgroundColor: COLOR.bg, color: COLOR.ink, fontFamily: "var(--font-body)", transition: "background-color 0.2s ease, color 0.2s ease" }}
    >
      {/* React 19 otomatis hoist <link>/<meta> ke <head> biarpun dirender dari
          sini (Client Component) — dipakai buat preconnect ke domain WhatsApp
          (satu-satunya resource eksternal di halaman ini; font udah self-host
          lewat next/font, jadi nggak butuh preconnect ke Google Fonts lagi). */}
      <link rel="preconnect" href="https://wa.me" />
      <link rel="dns-prefetch" href="https://wa.me" />

      {/* Skip-to-content — standar aksesibilitas dasar buat pengguna keyboard/
          screen-reader, biar nggak wajib Tab lewatin semua link nav dulu.
          Tersembunyi visual sampai di-fokus (klik Tab pertama kali). */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        style={{ backgroundColor: COLOR.accent }}
      >
        Langsung ke konten utama
      </a>

      <header
        className="sticky top-0 z-40 border-b"
        style={{ borderColor: hairline, backgroundColor: COLOR.bg, transition: "background-color 0.2s ease, border-color 0.2s ease" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo variant={theme === "dark" ? "light" : "dark"} />
          <nav
            className="hidden items-center gap-8 text-sm font-semibold sm:flex"
            style={{ color: COLOR.ink }}
          >
            <a href="#layanan" style={navLinkStyle("layanan")}>
              {t.nav.layanan}
            </a>
            <a href="#alur" style={navLinkStyle("alur")}>
              {t.nav.alur}
            </a>
            <a href="#tim" style={navLinkStyle("tim")}>
              {t.nav.tim}
            </a>
            <a href="#faq" style={navLinkStyle("faq")}>
              {t.nav.faq}
            </a>
            <a href="#lokasi" style={navLinkStyle("lokasi")}>
              {t.nav.lokasi}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {ToolbarToggles}
            {/* Sengaja outline (bukan solid) — ini CTA yang nempel terus di
                header di semua halaman, jadi dibikin bobot visualnya lebih
                ringan dari CTA solid di hero/lokasi/mobile-sticky-bar yang
                emang momen konversi utamanya. Solid di mana-mana bikin nggak
                ada hierarki primary vs secondary. */}
            <a
              href={whatsappLink(t.whatsapp.book)}
              className="whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold sm:px-5 sm:py-2.5 sm:text-sm"
              style={{ borderColor: COLOR.accent, color: COLOR.accent }}
            >
              {t.bookBtn}
            </a>
          </div>
        </div>
      </header>

      {/* Hero full-bleed video — dulu foto statis di kotak sisi kanan, sekarang
          video treatment jadi background section penuh (pola yang sama kayak
          arsygas.id / pltsmandiri.com: video/gambar full-width + scrim gelap +
          teks di atasnya). Teks di section ini SENGAJA pakai warna putih/cream
          tetap (bukan COLOR.* yang ngikut tema light/dark) — background-nya
          video/foto, bukan warna page, jadi kontrasnya harus konsisten di
          kedua tema. Video di-mute+autoplay+playsInline (wajib biar autoplay
          jalan di Safari iOS) + poster (frame pertama video, dikompres) biar
          ada sesuatu yang langsung ke-paint sebelum video-nya sendiri load. */}
      <section className="relative isolate overflow-hidden">
        <video
          ref={heroVideoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER}
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/45 to-black/25"
          aria-hidden="true"
        />

        {/* Banner pengumuman dulu bar solid terpisah di antara header & hero
            (bikin 2 "seam" solid sebelum videonya sendiri kelihatan) —
            sekarang jadi strip translucent yang menyatu di atas video,
            konsisten sama treatment teks hero (warna tetap terang, lepas
            dari tema light/dark). */}
        <div
          id="main-content"
          className="relative border-b border-white/10 bg-black/20 px-4 py-3 text-center text-sm text-white/85 backdrop-blur-sm"
        >
          {t.banner.text}{" "}
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline">
            {t.banner.link}
          </a>
          <span className="mx-2 text-white/40">·</span>
          {t.banner.hoursPrefix} {t.location.hoursSchedule}
        </div>

        <div className="mx-auto max-w-6xl px-4 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">{t.hero.badge}</p>
            <h1
              className="mt-5 text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {t.hero.titleLine1}
              <br />
              <span className="italic" style={{ fontWeight: 400 }}>
                {t.hero.titleItalic}
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/85">{t.hero.desc}</p>
            <a
              href={whatsappLink(t.whatsapp.book)}
              className="mt-9 inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-white"
              style={{ backgroundColor: COLOR.accent }}
            >
              {t.hero.cta}
            </a>
            <ul className="mt-5 flex flex-wrap gap-2">
              {t.hero.trustChips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stat band — SENGAJA selalu dark (LIGHT_COLOR.ink, sama kayak
          footer), lepas dari tema light/dark, biar jadi "jeda" visual yang
          kontras habis hero, bukan ngikutin tema section sekitarnya.
          2 angka pertama (Pasien Ditangani, Kepuasan) PLACEHOLDER atas
          permintaan eksplisit user — lihat komentar PLACEHOLDER_STATS_VALUES
          & TODO CLAUDE.md. 3 sisanya FAKTUAL, dari STATS_VALUES. flex-wrap
          (bukan grid kaku) biar jumlah item ganjil/genap tetap rapi center. */}
      <section className="py-10 sm:py-14" style={{ backgroundColor: LIGHT_COLOR.ink }}>
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-6 px-4 text-center sm:gap-x-10 sm:gap-y-8">
          {t.stats.items.map((item, i) => (
            <div key={item.label} className="min-w-[100px] sm:min-w-[130px]">
              <p
                className="text-4xl tracking-tight sm:text-6xl md:text-7xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: DARK_COLOR.accentBright }}
              >
                {ALL_STATS_VALUES[i]}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide sm:mt-2 sm:text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: COLOR.bgAlt }}>
        <Reveal className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:grid-cols-3">
          {t.features.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
            <div key={f.title} className="text-center sm:text-left">
              <span
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-full sm:mx-0"
                style={{ backgroundColor: `${COLOR.accent2}1F`, color: COLOR.accent2 }}
                aria-hidden="true"
              >
                <Icon />
              </span>
              <h3 className="mt-4 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                {f.description}
              </p>
            </div>
            );
          })}
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 py-24 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <div
            className="mx-auto flex max-w-sm flex-col items-center rounded-3xl border px-10 py-12 text-center lg:mx-0 lg:items-start lg:text-left"
            style={{ borderColor: hairline, backgroundColor: COLOR.bgAlt }}
          >
            <span
              className="text-7xl tracking-tight sm:text-8xl"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: COLOR.accentBright }}
            >
              STR
            </span>
            <p className="mt-3 text-sm font-medium" style={{ color: COLOR.muted }}>
              {t.trust.label}
            </p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading eyebrow={t.trust.eyebrow} heading={t.trust.heading} accentColor={COLOR.accent} accent2Color={COLOR.accent2} />
          <p className="mt-4 leading-relaxed" style={{ color: COLOR.muted }}>
            {t.trust.desc}
          </p>
          <a
            href="#layanan"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: COLOR.accent }}
          >
            {t.trust.link}
          </a>
        </div>
      </section>

      <section id="alur" className="py-24" style={{ backgroundColor: COLOR.bgAlt }}>
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow={t.steps.eyebrow} heading={t.steps.heading} align="center" accentColor={COLOR.accent} accent2Color={COLOR.accent2} />
          <Reveal className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.items.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
              <div
                key={s.number}
                className="rounded-2xl p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: COLOR.bg }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${COLOR.accent2}1F`, color: COLOR.accent2 }}
                    aria-hidden="true"
                  >
                    <Icon />
                  </span>
                  <span
                    className="text-2xl"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: COLOR.accent }}
                  >
                    {s.number}
                  </span>
                </div>
                <h3 className="mt-3 text-lg tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                  {s.description}
                </p>
              </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section id="layanan" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow={t.services.eyebrow} heading={t.services.heading} accentColor={COLOR.accent} accent2Color={COLOR.accent2} />
          <Reveal className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {t.services.items.map((s, i) => {
              const asset = SERVICE_ASSETS[i];
              return (
                <div
                  key={s.title}
                  className="overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  style={{ backgroundColor: COLOR.bgAlt }}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={asset.image}
                      alt={s.title}
                      fill
                      loading="lazy"
                      className="object-cover"
                      style={{ objectPosition: asset.imagePosition ?? "center", filter: PHOTO_FILTER }}
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-7">
                    <h3 className="text-xl tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                      {s.description}
                    </p>
                    <a
                      href={whatsappLink(t.whatsapp.consultPrefix(s.title))}
                      className="mt-4 inline-block text-sm font-semibold"
                      style={{ color: COLOR.accent }}
                    >
                      {t.services.ctaLabel}
                    </a>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: COLOR.bgAlt }}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <SectionHeading eyebrow={t.about.eyebrow} heading={t.about.heading} align="center" accentColor={COLOR.accent} accent2Color={COLOR.accent2} />
          <p className="mt-4 leading-relaxed" style={{ color: COLOR.muted }}>
            {t.about.desc}
          </p>
        </div>
      </section>

      <section id="tim" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow={t.team.eyebrow} heading={t.team.heading} accentColor={COLOR.accent} accent2Color={COLOR.accent2} />
          <Reveal className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TEAM.map((m, i) => (
              <div
                key={m.name}
                className="overflow-hidden rounded-2xl text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: COLOR.bgAlt }}
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={m.photo}
                    alt={`${m.name} — ${t.team.role}`}
                    fill
                    loading="lazy"
                    className="object-cover"
                    style={{ objectPosition: "50% 15%", filter: PHOTO_FILTER }}
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                    {m.name}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: COLOR.muted }}>
                    {t.team.role}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: COLOR.muted }}>
                    {t.team.bios[i]}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: COLOR.bgAlt }}>
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow={t.testimonials.eyebrow} heading={t.testimonials.heading} accentColor={COLOR.accent} accent2Color={COLOR.accent2} />
          <Reveal className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Kartu unggulan: kutipan pertama ditonjolkan sebagai headline besar,
                meniru pola bento (1 kartu besar + beberapa kartu kecil) yang diminta user. */}
            <div
              className="flex flex-col justify-between rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-10 lg:col-span-2"
              style={{ backgroundColor: COLOR.bg }}
            >
              <p
                className="text-2xl leading-snug sm:text-3xl"
                style={{ fontFamily: "var(--font-display)", color: COLOR.ink }}
              >
                &ldquo;{t.testimonials.items[0].quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: COLOR.accent }}
                    aria-hidden="true"
                  >
                    {TESTIMONIAL_ASSETS[0].initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.testimonials.items[0].name}</p>
                    <p className="text-xs" style={{ color: COLOR.muted }}>
                      {t.testimonials.items[0].note}
                    </p>
                  </div>
                </div>
                <div className="hidden gap-0.5 sm:flex" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <StarIcon key={star} />
                  ))}
                </div>
              </div>
              <p className="mt-6 text-xs italic" style={{ color: COLOR.accent }}>
                {t.testimonials.disclaimer}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {t.testimonials.items.slice(1).map((ts, i) => (
                <div
                  key={ts.name}
                  className="flex-1 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  style={{ backgroundColor: COLOR.bg }}
                >
                  <div className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <StarIcon key={star} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed italic" style={{ color: COLOR.ink }}>
                    &ldquo;{ts.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: COLOR.accent }}
                      aria-hidden="true"
                    >
                      {TESTIMONIAL_ASSETS[i + 1].initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{ts.name}</p>
                      <p className="text-xs" style={{ color: COLOR.muted }}>
                        {ts.note}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow={t.gallery.eyebrow} heading={t.gallery.heading} accentColor={COLOR.accent} accent2Color={COLOR.accent2} />
          <Reveal className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GALLERY.map((item, i) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group relative block w-full cursor-zoom-in text-left"
                aria-label={t.gallery.alt[i] ?? t.gallery.heading}
              >
                <ShimmerMedia bgAlt={COLOR.bgAlt} ready={!!mediaReady[i]} className="h-40 sm:h-52">
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      onLoadedData={() => markReady(i)}
                      className="h-40 w-full object-cover sm:h-52"
                      style={{ filter: PHOTO_FILTER }}
                    />
                  ) : (
                    <div className="relative h-40 w-full sm:h-52">
                      <Image
                        src={item.src}
                        alt={t.gallery.alt[i] ?? t.gallery.heading}
                        fill
                        loading="lazy"
                        onLoad={() => markReady(i)}
                        className="object-cover"
                        style={{ filter: PHOTO_FILTER }}
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  )}
                </ShimmerMedia>
                {/* Caption + zoom hint muncul pas hover/focus — nunjukkin
                    galeri ini bisa diklik buat lihat lebih besar. */}
                <div
                  className="pointer-events-none absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                  aria-hidden="true"
                >
                  <p className="p-3 text-xs font-medium text-white">{t.gallery.alt[i]}</p>
                </div>
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="faq" className="py-24" style={{ backgroundColor: COLOR.bgAlt }}>
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading eyebrow={t.faq.eyebrow} heading={t.faq.heading} align="center" accentColor={COLOR.accent} accent2Color={COLOR.accent2} />
          <div className="mt-12 divide-y" style={{ borderColor: hairline }}>
            {t.faq.items.map((f) => (
              <details key={f.q} className="group py-5" style={{ borderColor: hairline }}>
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
                  {f.q}
                  <span className="ml-4 text-xl" style={{ color: COLOR.accent }}>
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

      <section id="lokasi" className="py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading eyebrow={t.location.eyebrow} heading={t.location.heading} align="center" accentColor={COLOR.accent} accent2Color={COLOR.accent2} />
          <p className="mt-3" style={{ color: COLOR.muted }}>
            {CLINIC_ADDRESS}
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-semibold underline"
            style={{ color: COLOR.accent }}
          >
            {t.location.mapLink}
          </a>

          <div className="mt-8 overflow-hidden rounded-2xl" style={{ backgroundColor: COLOR.bgAlt }}>
            <iframe
              src={GOOGLE_MAPS_EMBED_URL}
              title={t.location.heading}
              width="100%"
              height="300"
              loading="lazy"
              style={{ border: 0, display: "block" }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-8 inline-block rounded-2xl px-6 py-4 text-left" style={{ backgroundColor: COLOR.bgAlt }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLOR.accent }}>
              {t.location.hoursHeading}
            </p>
            <p className="mt-1 text-sm font-medium">{t.location.hoursSchedule}</p>
          </div>

          <div className="mt-8">
            <a
              href={whatsappLink(t.whatsapp.visit)}
              className="inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-white"
              style={{ backgroundColor: COLOR.accent }}
            >
              {t.location.chatBtn}
            </a>
          </div>
        </div>
      </section>

      <footer className="py-16" style={{ backgroundColor: LIGHT_COLOR.ink, color: "rgba(255,255,255,0.6)" }}>
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

      {/* Bar CTA sticky KHUSUS mobile — booking jadi selalu 1 jempolan
          diraih pas scroll panjang di HP. Tombol WA mengambang (di bawah)
          sengaja di-hide di mobile (`sm:hidden` di situ) biar nggak
          numpuk/tabrakan visual sama bar ini — fungsinya udah kegantiin. */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t p-3 sm:hidden"
        style={{ backgroundColor: COLOR.bg, borderColor: hairline }}
      >
        <a
          href={whatsappLink(t.whatsapp.book)}
          className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: COLOR.accent }}
        >
          <WhatsAppIcon />
          {t.bookBtn}
        </a>
      </div>

      {/* Tombol mengambang: WhatsApp sekarang keliatan di mobile JUGA (dulu
          `hidden sm:flex`, disembunyiin di mobile karena udah ada bar
          sticky di bawah) — user minta CTA jangan "diem statis doang",
          nunjukin referensi bubble chat WA ngambang yang tetap keliatan
          nempel pas discroll (khas widget live-chat). Sengaja TETAP jalan
          bareng bar sticky (bukan gantiin) — bar itu buat aksi "booking"
          (CTA konversi utama), bubble ini buat "tanya-tanya" cepat
          (`t.whatsapp.ask`, beda pesan dari `t.whatsapp.book`), sama kayak
          pola CTA header (WA book) + bubble desktop (WA ask) yang udah ada.
          Ring animate-ping di belakang ikon = sinyal visual "hidup"/bisa
          diklik, bukan cuma badge diam — otomatis nonaktif kalau user
          pilih "reduce motion" (lihat aturan global di globals.css). Posisi
          mobile digeser ke atas bar sticky (bottom-[84px]), balik ke
          bottom-6 di sm:+ karena nggak ada bar di situ. Ijo #25D366 sengaja
          dipertahankan (bukan earth-tone) — warna resmi WhatsApp, orang
          langsung kenal ikonnya, sama kayak badge status emerald yang juga
          dipertahankan. */}
      <a
        href={whatsappLink(t.whatsapp.ask)}
        className="fixed bottom-[84px] right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 sm:bottom-6"
        style={{ backgroundColor: "#25D366" }}
        aria-label={t.waFloatLabel}
      >
        <span
          className="absolute inset-0 animate-ping rounded-full"
          style={{ backgroundColor: "#25D366", opacity: 0.5 }}
          aria-hidden="true"
        />
        <WhatsAppIcon />
      </a>

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-[152px] right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full text-lg shadow-lg transition-transform hover:scale-105 sm:bottom-24"
          style={{ backgroundColor: COLOR.ink, color: COLOR.bg }}
          aria-label={t.backToTop}
        >
          ↑
        </button>
      )}

      {/* Lightbox galeri — klik thumbnail buka versi gede + caption, bukan
          cuma grid kecil polos yang nggak bisa di-apa-apain. */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.gallery.heading}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(null);
            }}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label={t.close}
          >
            <CloseIcon />
          </button>

          {lightboxIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
              aria-label="Previous"
            >
              <ChevronIcon direction="left" />
            </button>
          )}
          {lightboxIndex < GALLERY.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
              aria-label="Next"
            >
              <ChevronIcon direction="right" />
            </button>
          )}

          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {GALLERY[lightboxIndex].type === "video" ? (
              <video
                src={GALLERY[lightboxIndex].src}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="max-h-[75vh] w-full rounded-lg object-contain"
              />
            ) : (
              <div className="relative h-[75vh] w-full">
                <Image
                  src={GALLERY[lightboxIndex].src}
                  alt={t.gallery.alt[lightboxIndex] ?? t.gallery.heading}
                  fill
                  className="rounded-lg object-contain"
                  style={{ filter: PHOTO_FILTER }}
                  sizes="100vw"
                />
              </div>
            )}
            <p className="mt-4 text-center text-sm text-white/80">{t.gallery.alt[lightboxIndex]}</p>
          </div>
        </div>
      )}
    </div>
  );
}
