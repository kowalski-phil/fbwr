import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Feuerwache BWR",
  description: "Lern-App für BWR — Kapitalanlage meistern mit Feuerwehr-Power!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B2A4A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full">
      <body className="h-full flex flex-col bg-bg-light">
        {children}
      </body>
    </html>
  );
}
