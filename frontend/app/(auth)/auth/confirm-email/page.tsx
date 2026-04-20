import { ConfirmEmailChangeHandler } from "@/components/features/users/ConfirmEmailChangeHandler";
import { Suspense } from "react";
import { IoReloadOutline } from "react-icons/io5";

export const metadata = {
  title: "Confirmar Cambio de Correo | Guestly",
  description: "Validando tu nueva dirección de correo electrónico.",
};

/**
 * @description Página de aterrizaje para procesar el cambio de email.
 * Envuelve el handler en Suspense porque utiliza useSearchParams.
 */
export default function ConfirmEmailChangePage() {
  return (
    <main className="container mx-auto min-h-[80vh] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <IoReloadOutline
              size={40}
              className="text-primary-600 animate-spin"
            />
            <p className="text-slate-500 font-medium">
              Cargando verificador...
            </p>
          </div>
        }
      >
        <ConfirmEmailChangeHandler />
      </Suspense>
    </main>
  );
}
