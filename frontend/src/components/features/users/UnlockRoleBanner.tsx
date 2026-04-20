"use client";

import {
  IoHomeOutline,
  IoPersonOutline,
  IoSparklesOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Button } from "@/components/shared/Button";
import { useAddRole } from "@/hooks/users/useMutation";
import { useAuth } from "@/hooks/stores/useAuth";

/**
 * @description Banner dinámico para la expansión de capacidades de cuenta.
 * Detecta el rol faltante en el arreglo de roles (Host o Guest) y ofrece la activación.
 */
export function UnlockRoleBanner() {
  const { setAuth, user } = useAuth();
  const { mutate: addRole, isPending } = useAddRole();

  if (!user) return null;

  const roles = user.role || [];
  const hasHostRole = roles.includes("Host");
  const hasGuestRole = roles.includes("Guest");

  if (hasHostRole && hasGuestRole) return null;

  const roleToUnlock = hasHostRole ? "Guest" : "Host";

  const config = {
    Host: {
      title: "Gana dinero con tu espacio",
      description:
        "Convierte tu habitación o propiedad en ingresos extra. Únete a nuestra comunidad de anfitriones.",
      buttonText: "Empezar a hospedar",
      icon: <IoHomeOutline size={32} className="text-primary-400" />,
      tag: "Oportunidad de Anfitrión",
    },
    Guest: {
      title: "Explora nuevos horizontes",
      description:
        "¿Solo eres anfitrión? Activa tu rol de viajero para reservar estancias increíbles en todo el mundo.",
      buttonText: "Activar modo viajero",
      icon: <IoPersonOutline size={32} className="text-primary-400" />,
      tag: "Perfil de Viajero",
    },
  }[roleToUnlock];

  const handleUnlock = () => {
    addRole(
      { roleToAdd: roleToUnlock },
      {
        onSuccess: (authResponse) => {
          const { token, ...userProfile } = authResponse;
          setAuth(token, userProfile);

          toast.success(
            `¡Rol de ${roleToUnlock === "Host" ? "Anfitrión" : "Huésped"} activado!`,
            {
              description:
                "Tu cuenta ha sido actualizada con éxito. Disfruta de tus nuevas facultades.",
            },
          );
        },
        onError: (error) => {
          // Delegamos completamente el mensaje al error arrojado por handleApiError
          toast.error("Error al agregar rol", { description: error.message });
        },
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 text-white shadow-2xl border border-white/5"
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl opacity-70" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
            {config.icon}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              <IoSparklesOutline className="animate-pulse" />
              {config.tag}
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              {config.title}
            </h3>
            <p className="text-slate-400 max-w-md text-sm leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>

        <Button
          onClick={handleUnlock}
          isLoading={isPending}
          size="lg"
          className="bg-primary-600 text-white hover:bg-primary-700 px-8 py-6 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 border-none"
          rightIcon={<IoArrowForwardOutline size={20} />}
        >
          {config.buttonText}
        </Button>
      </div>
    </motion.div>
  );
}
