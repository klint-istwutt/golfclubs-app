// app/components/Header.tsx
"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full bg-white shadow z-50 flex items-center justify-center transition-all duration-300 p-2">
      <img
        src="https://res.cloudinary.com/dxacbdem3/image/upload/v1763994792/GreenLogAppLogo_r7cqlg.png"
        alt="GreenLog Logo"
        className={`transition-all duration-300 ${scrolled ? "h-12" : "h-16"}`}
        style={{ maxWidth: "100px", width: "auto" }} // verhindert, dass das Logo zu breit wird
      />
    </header>
  );
}
