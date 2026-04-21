"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useState, type ReactNode } from "react";

// Opciones por defecto para evitar peticiones redundantes al backend
const STALE_TIME = 1000 * 60 * 5; // 5 minutos

interface ProvidersProps {
  children: ReactNode;
}

/**
 * @description Contenedor de Providers globales de la aplicación.
 * Instancia el QueryClient de forma segura para SSR en Next.js (App Router).
 */
export function Providers({ children }: Readonly<ProvidersProps>) {
  // Instanciamos el QueryClient dentro de un useState para garantizar 
  // que cada solicitud SSR obtenga una instancia única y aislada.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Evita que React Query haga refetch inmediatamente si los datos no han cambiado
            staleTime: STALE_TIME,
            // Evita refetching compulsivo al cambiar de pestañas si no es estrictamente necesario
            refetchOnWindowFocus: false, 
            // Solo reintenta 1 vez si la red falla (el por defecto es 3, lo cual satura si el backend está caído)
            retry: 1, 
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Toaster 
        richColors 
        position="top-right" 
        closeButton
        duration={4000}
      />

      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}