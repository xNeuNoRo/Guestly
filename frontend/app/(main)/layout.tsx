import { Navbar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-12">{children}</main>
      <Footer />
    </>
  );
}
