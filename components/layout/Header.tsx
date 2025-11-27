

"use client";
import TopBar from "./TopBar";
import MainNavigation from "./MainNavigation";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full shadow-md sticky top-0 z-50 bg-white">
      <TopBar />
      <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
        {/* Logo */}
<Link href="/">
  <Image
    src="https://res.cloudinary.com/dxacbdem3/image/upload/v1763994792/GreenLogAppLogo_r7cqlg.png"
    alt="Logo"
    width={150}   // feste Breite
    height={50}   // Höhe passend zur Breite
    className="object-contain"
    priority
  />
</Link>

        {/* Menü */}
        <MainNavigation />
      </div>
    </header>
  );
}
