"use client";

import { IoPersonOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import clsx from "clsx";
import { useRouter } from "next/navigation";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ProfileSettingsForm } from "@/components/features/users/ProfileSettingsForm";
import { ChangePasswordForm } from "@/components/features/users/ChangePasswordForm";
import { ChangeEmailWizard } from "@/components/features/users/ChangeEmailWizard";
import { UnlockRoleBanner } from "@/components/features/users/UnlockRoleBanner";
import { useAuth } from "@/hooks/stores/useAuth";
import { useQueryString } from "@/hooks/shared/useQueryString";

type TabType = "profile" | "security";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // ARSENAL: Traemos nuestro hook para dominar la URL
  const { searchParams, createUrl } = useQueryString();

  // Obtenemos el tab actual de la URL, por defecto "profile"
  const activeTabParam = searchParams.get("tab");
  const activeTab: TabType =
    activeTabParam === "security" ? "security" : "profile";

  const isGuestOnly =
    user?.role?.includes("Guest") && !user?.role?.includes("Host");
  const isHostOnly =
    user?.role?.includes("Host") && !user?.role?.includes("Guest");

  // Función para cambiar de pestaña actualizando la URL
  const handleTabChange = (tab: TabType) => {
    // Si vamos al perfil (default), limpiamos el parámetro. Si no, lo establecemos.
    const newUrl = createUrl({ tab: tab === "profile" ? null : tab });
    router.push(newUrl, { scroll: false }); // scroll: false evita saltos bruscos
  };

  return (
    <AuthGuard requireEmailConfirmed>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Configuración de Cuenta
          </h1>
          <p className="text-slate-500 mt-2">
            Gestiona tu información personal, seguridad y preferencias de tu
            cuenta.
          </p>
        </header>

        {/* --- NAVEGACIÓN DE TABS (Controlada por URL) --- */}
        <div className="flex border-b border-slate-200 mb-8 gap-8">
          <button
            onClick={() => handleTabChange("profile")}
            className={clsx(
              "flex items-center gap-2 pb-4 text-sm font-bold transition-all border-b-2 hover:cursor-pointer",
              activeTab === "profile"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-slate-500 hover:text-slate-700",
            )}
          >
            <IoPersonOutline size={20} />
            Perfil Personal
          </button>
          <button
            onClick={() => handleTabChange("security")}
            className={clsx(
              "flex items-center gap-2 pb-4 text-sm font-bold transition-all border-b-2 hover:cursor-pointer",
              activeTab === "security"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-slate-500 hover:text-slate-700",
            )}
          >
            <IoShieldCheckmarkOutline size={20} />
            Seguridad y Acceso
          </button>
        </div>

        {/* --- CONTENIDO DE LOS TABS --- */}
        <div className="min-h-125">
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto">
              <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Información Básica
                </h2>
                <ProfileSettingsForm />
              </section>

              {/* Corregida la precedencia de los operadores lógicos para evitar bugs visuales */}
              {(isGuestOnly || isHostOnly) && <UnlockRoleBanner />}
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Sección Email */}
                <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-fit">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900">
                      Correo Electrónico
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Tu correo actual es{" "}
                      <span className="font-medium text-slate-900">
                        {user?.email}
                      </span>
                    </p>
                  </div>
                  <div className="mt-auto">
                    <ChangeEmailWizard />
                  </div>
                </section>

                {/* Sección Password */}
                <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-fit">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900">
                      Contraseña
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Recomendamos cambiar tu contraseña periódicamente para
                      mantener tu cuenta segura.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <ChangePasswordForm />
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
