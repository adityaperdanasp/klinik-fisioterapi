import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Konvensi Next.js — file ini otomatis jadi og:image (dan twitter:image,
// kalau nggak ada app/twitter-image.tsx terpisah) buat route "/". Ganti dari
// foto hero mentah (nggak ada teks/brand) ke gambar yang didesain sendiri —
// preview link di WA/socmed jadi lebih jelas ini apa/siapa, bukan cuma foto polos.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#FAF5EE",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "420px",
            height: "630px",
            backgroundColor: "#F1E6D6",
          }}
        />
        <div
          style={{
            display: "flex",
            width: "72px",
            height: "72px",
            borderRadius: "9999px",
            backgroundColor: "#7A5D39",
            marginBottom: "36px",
          }}
        />
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: "#96754A",
            letterSpacing: 4,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Spesialis Cedera Otot · Bekasi
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 600,
            color: "#231F1A",
            marginTop: 20,
            display: "flex",
          }}
        >
          Pulih Fisioterapi
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#57503F",
            marginTop: 24,
            maxWidth: 680,
            display: "flex",
          }}
        >
          Ditangani langsung fisioterapis berlisensi (STR)
        </div>
      </div>
    ),
    { ...size }
  );
}
