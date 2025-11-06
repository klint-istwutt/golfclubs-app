import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // wichtig für Vercel
  distDir: ".next",     // Standard-Build-Verzeichnis
  reactStrictMode: true,
};

export default nextConfig;
