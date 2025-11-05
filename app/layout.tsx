import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
