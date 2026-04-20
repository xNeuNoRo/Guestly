import Link from "next/link";
import { IoHome, IoLogoInstagram, IoLogoGithub } from "react-icons/io5";
import { ROUTES } from "@/constants/routes";

/**
 * @description Pie de página estático de la aplicación.
 * Contiene enlaces legales, de soporte y navegación secundaria.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Columna 1: Marca y descripción */}
          <div className="md:col-span-1 space-y-4">
            <Link
              href={ROUTES.PUBLIC.HOME}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors w-fit"
            >
              <div className="p-2 bg-primary-50 rounded-xl">
                <IoHome size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter">
                GUESTLY
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed pr-4">
              La plataforma definitiva para gestionar tus propiedades y
              descubrir alojamientos inolvidables en todo el mundo.
            </p>
          </div>

          {/* Columna 2: Anfitriones */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Anfitriones</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href={ROUTES.HOST.PROPERTIES}
                  className="hover:text-primary-600 transition-colors"
                >
                  Publicar mi espacio
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-600 transition-colors"
                >
                  Recursos para anfitriones
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-600 transition-colors"
                >
                  Foro de la comunidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Asistencia</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-600 transition-colors"
                >
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-600 transition-colors"
                >
                  Opciones de cancelación
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-600 transition-colors"
                >
                  Reportar un problema
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-600 transition-colors"
                >
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-600 transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-600 transition-colors"
                >
                  Mapa del sitio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador */}
        <hr className="my-8 border-slate-100" />

        {/* Copyright y Redes */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} Guestly, Inc. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://www.instagram.com/neunoro/"
              className="hover:text-primary-600 transition-colors"
              aria-label="Instagram"
            >
              <IoLogoInstagram size={20} />
            </a>
            <a
              href="https://github.com/xNeuNoRo"
              className="hover:text-primary-600 transition-colors"
              aria-label="GitHub"
            >
              <IoLogoGithub size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
