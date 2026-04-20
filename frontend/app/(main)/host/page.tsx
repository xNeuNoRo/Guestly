import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/shared/Button";
import { HostStatsDashboard } from "@/components/features/users/HostStatsDashboard";
import { IoAddOutline, IoChevronForwardOutline } from "react-icons/io5";

export const metadata = {
  title: "Panel de Anfitrión | Guestly",
  description:
    "Administra tus propiedades, ingresos y reservas en un solo lugar.",
};

export default function HostPage() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-10">
      {/* Header de Bienvenida con Acción Rápida */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Panel de Anfitrión
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Gestiona tu negocio y revisa el rendimiento de tus propiedades.
          </p>
        </div>

        <Link href={ROUTES.HOST.PROPERTIES + "/create"}>
          <Button
            leftIcon={<IoAddOutline size={20} />}
            className="rounded-2xl shadow-sm shadow-primary-200"
          >
            Publicar propiedad
          </Button>
        </Link>
      </header>

      {/* Sección de Métricas (Tu componente Smart) */}
      <section>
        <HostStatsDashboard />
      </section>

      {/* Secciones Secundarias (Activity & Properties) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Placeholder para Reservas Próximas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Reservas Recientes
            </h2>
            <Link
              href={ROUTES.HOST.RESERVATIONS}
              className="text-sm font-bold text-primary-600 hover:underline flex items-center gap-1"
            >
              Ver todas <IoChevronForwardOutline />
            </Link>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 border-dashed p-12 text-center">
            <p className="text-slate-400 font-medium">
              Aquí aparecerán tus próximas reservas confirmadas.
            </p>
          </div>
        </div>

        {/* Atajos Rápidos / Tips */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Atajos</h2>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6">
            <div>
              <p className="text-primary-400 text-xs font-black uppercase tracking-widest mb-2">
                Consejo Pro
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Mantener tus calendarios actualizados aumenta un 20% la
                probabilidad de recibir reservas.
              </p>
            </div>

            <Link
              href={ROUTES.HOST.PROPERTIES}
              className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors group"
            >
              <span className="text-sm font-bold">Mis Propiedades</span>
              <IoChevronForwardOutline className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
