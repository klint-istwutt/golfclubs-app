"use client";

import React from "react";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
