import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",       // wichtig für Vercel
  distDir: ".next",
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "https://cqcxctcjfdugyojqpbjq.supabase.co", // z.B. xyz.supabase.co
        port: "", // optional, leer lassen
        pathname: "/**", // erlaubt alle Pfade
      },
    ],
  },
};

export default nextConfig;
