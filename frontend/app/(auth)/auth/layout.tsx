import { SimpleHeader } from "@/components/layout/SimpleHeader";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SimpleHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        {children}
      </main>
    </>
  );
}
