// src/components/layout/AppShell.tsx
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { SimpleHeader } from "@/components/layout/SimpleHeader";
import { ROUTES } from "@/constants/routes";

export function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // Definimos qué rutas son "de identidad"
  const isAuthRoute =
    pathname.startsWith("/auth") ||
    pathname === ROUTES.USER.VERIFY_EMAIL ||
    pathname === "/confirm-email";

  if (isAuthRoute) {
    return (
      <>
        <SimpleHeader />
        {/* En auth no hay pt-24 porque el SimpleHeader suele ser más delgado */}
        <main className="flex-1 flex items-center justify-center py-12">
          {children}
        </main>
        {/* Sin Footer en Auth para mantener el foco */}
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-12">{children}</main>
      <Footer />
    </>
  );
}
