import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/NavBar";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { AuthLoader } from "@/components/auth/AuthLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guestly | Gestión de Reservas y Propiedades",
  description: "La plataforma definitiva para anfitriones y huéspedes.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col`}
      >
        <Providers>
          <AuthLoader />
          <Navbar />
          <main className="flex-1 pt-24 pb-12">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
