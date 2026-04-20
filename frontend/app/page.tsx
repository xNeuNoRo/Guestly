import Image from "next/image";
import { PropertySearchBar } from "@/components/features/properties/PropertySearchBar";
// IMPORTANTE: Aquí importaríamos un listado de propiedades destacadas si tienes el componente
// import { FeaturedProperties } from "@/components/features/properties/FeaturedProperties";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION
        Un encabezado inmersivo con la barra de búsqueda centrada.
      */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 flex items-center justify-center min-h-[600px] overflow-hidden">
        {/* Fondo decorativo (Puedes reemplazar el bg-slate-900 con una imagen real optimizada) */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <Image
            src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop"
            alt="Casa de playa espectacular"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-lg">
            Encuentra tu próximo <br className="hidden md:block" />
            <span className="text-primary-400">destino inolvidable</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto drop-shadow-md font-medium">
            Descubre casas, cabañas y apartamentos únicos administrados por
            anfitriones excepcionales en todo el mundo.
          </p>

          {/* ARSENAL: Inyectamos el motor de búsqueda en el corazón de la página */}
          <div className="mt-12 max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-2 md:p-3 rounded-[2rem] shadow-2xl border border-white/20">
            <PropertySearchBar />
          </div>
        </div>
      </section>

      {/* SECCIÓN DE EXPLORACIÓN
        Aquí irían las propiedades destacadas.
      */}
      <section className="py-20 px-4 md:px-6 container mx-auto flex-1">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Propiedades Destacadas
            </h2>
            <p className="text-slate-500 mt-2">
              Alojamientos altamente calificados por la comunidad de Guestly.
            </p>
          </div>
        </div>

        {/* Si ya construimos un listado de propiedades para el Home, se colocaría aquí.
          Por ahora, dejamos el espacio estructural listo.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-72 bg-slate-100 rounded-3xl animate-pulse border border-slate-200"></div>
          <div className="h-72 bg-slate-100 rounded-3xl animate-pulse border border-slate-200"></div>
          <div className="h-72 bg-slate-100 rounded-3xl animate-pulse border border-slate-200"></div>
          <div className="h-72 bg-slate-100 rounded-3xl animate-pulse border border-slate-200"></div>
        </div>
      </section>
    </div>
  );
}
