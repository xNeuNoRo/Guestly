import Link from "next/link";
// import { PropertySearchForm } from "@/components/features/search/PropertySearchForm";
// import { FeaturedProperties } from "@/components/features/properties/FeaturedProperties";

// TODO: Refactorizar esto cuando este el resto de componentes de la app

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[80vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Imagen de fondo (placeholder por ahora) */}
        <div className="absolute inset-0 opacity-40 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
            Encuentra tu próximo{" "}
            <span className="text-primary-400">descanso.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl">
            Descubre alojamientos únicos gestionados por anfitriones de primer
            nivel. Reservas rápidas, seguras y sin complicaciones.
          </p>

          {/* Aquí irá el componente interactivo de búsqueda de fechas y lugares */}
          {/* <PropertySearchForm /> */}
          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 animate-pulse h-20 flex items-center justify-center">
            <span className="text-white/70 text-sm font-medium">
              [Barra de Búsqueda de Propiedades]
            </span>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE DESTACADOS */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Alojamientos Destacados
            </h2>
            <p className="text-slate-500 mt-2">
              Los lugares mejor valorados por nuestros huéspedes.
            </p>
          </div>
          <Link
            href="/explorar"
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Ver todos &rarr;
          </Link>
        </div>

        {/* Aquí renderizaremos las tarjetas de propiedades reales desde el backend */}
        {/* <FeaturedProperties /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-4/5 bg-slate-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>

      {/* 3. CALL TO ACTION PARA ANFITRIONES */}
      <section className="bg-primary-50 py-20 px-4 md:px-8 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            ¿Tienes una propiedad?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Únete a Guestly como anfitrión y empieza a generar ingresos hoy
            mismo con nuestras herramientas de gestión avanzadas.
          </p>
          <Link
            href="/register?role=HOST"
            className="inline-block bg-primary-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-primary-700 transition-transform hover:scale-105"
          >
            Convertirme en Anfitrión
          </Link>
        </div>
      </section>
    </main>
  );
}
