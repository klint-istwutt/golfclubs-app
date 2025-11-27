import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Clubs Directory",
  description: "Find and rate clubs worldwide",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header style={{ padding: "1rem 2rem", borderBottom: "1px solid #ddd" }}>
          <h1>Clubs Directory</h1>
          <nav style={{ marginTop: "0.5rem" }}>
            <a href="/impressum" style={{ marginRight: 16 }}>Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
          </nav>
        </header>
        <main style={{ padding: "2rem" }}>{children}</main>
      </body>
    </html>
  );
}
