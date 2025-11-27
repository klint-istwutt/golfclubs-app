"use client";

import Link from "next/link";
import { useState } from "react";

export default function MainNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      {/* Mobile toggle */}
      <button
        className="lg:hidden p-2 border rounded-md"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Desktop Menu */}
      <ul
        className={`${
          open ? "block" : "hidden"
        } lg:flex gap-6 text-lg font-medium`}
      >
        <li>
          <Link href="/clubs" className="hover:text-green-600">
            Clubs
          </Link>
        </li>
        <li>
          <Link href="/karte" className="hover:text-green-600">
            Karte
          </Link>
        </li>
        <li>
          <Link href="/statistik" className="hover:text-green-600">
            Statistik
          </Link>
        </li>
        {/* Weitere Menüpunkte hier ergänzen */}
      </ul>
    </nav>
  );
}
