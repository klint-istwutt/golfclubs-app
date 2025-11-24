// app/layout.tsx
import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "Golfclubs",
  description: "Übersicht aller Golfclubs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="relative">
        <Header />
        {/* padding-top, damit Inhalt nicht unter Header verschwindet */}
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
