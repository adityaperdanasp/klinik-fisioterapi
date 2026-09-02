import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin (lewat jwks-rsa) require() paket `jose` versi ESM-only —
  // kalau di-bundle Next.js malah pecah (ERR_REQUIRE_ESM) di serverless
  // function. Biarin Node native require yang nanganin, jangan di-bundle.
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
