"use client";

import { use } from "react";
import { PublicProfileCard } from "@/components/features/users/PublicProfileCard";
import { UserReviewsSection } from "@/components/features/reviews/UserReviewsSection";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

/**
 * @description Página de perfil público del usuario.
 * Simplemente orquesta los componentes inteligentes que cargan su propia data.
 */
export default function PublicProfilePage({
  params,
}: Readonly<ProfilePageProps>) {
  // En Next.js 15, los params se consumen de forma asíncrona
  const { id } = use(params);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-12">
      {/* SECCIÓN 1: Identidad del Usuario */}
      {/* El componente maneja sus propios Skeletons e isError internamente */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PublicProfileCard userId={id} />
      </section>

      <hr className="border-slate-100" />

      {/* SECCIÓN 2: Reputación y Reseñas */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Reputación en Guestly
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Lo que otros miembros de la comunidad opinan.
          </p>
        </div>

        <UserReviewsSection userId={id} />
      </section>
    </main>
  );
}
