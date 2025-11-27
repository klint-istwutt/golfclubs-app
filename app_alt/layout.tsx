// app/layout.tsx
import "./globals.css";
//import AppShell from "./components/AppShell";

export const metadata = {
  title: "Golfclubs App",
  description: "Modern Golf App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>

          {children}

      </body>
    </html>
  );
}
