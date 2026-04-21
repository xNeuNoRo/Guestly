import { useAppStore } from "@/stores/useAppStore";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  proxy: false,
});

// Interceptor para inyectar el JWT en cada petición
api.interceptors.request.use(
  (config) => {
    if (globalThis.window !== undefined) {
      // Ya se que es inseguro guardar el token en el localStorage, pero lo considero una demo xd
      // En un proyecto real, se debería usar HttpOnly cookies para almacenar el token de forma segura y evitar vulnerabilidades XSS.
      const token = useAppStore.getState().token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para manejar respuestas de error de la API,
// especialmente para detectar tokens expirados o inválidos y redirigir al usuario al login
api.interceptors.response.use(
  (response) => response, // Si es exitosa (2xx), la dejamos pasar transparente
  (error) => {
    // Si la API rechaza el token (expirado o inválido)
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      // Nos aseguramos de comprobar que no sea una ruta del backend donde arrojara 401
      // por razones válidas (ej. cambio de contraseña o email)
      const isPasswordVerification =
        url.includes("/users/me/email") || url.includes("/users/me/password");

      if (!isPasswordVerification && globalThis.window !== undefined) {
        // Limpiamos el token muerto
        useAppStore.getState().logout();

        // Redirigimos al usuario al login forzosamente (evitando bucles de redirección)
        // Todavia pendiente esta logica hasta que decida su ruta
        // if (!window.location.pathname.includes("/login")) {
        //   window.location.href = "/login";
        // }
      }
    }

    return Promise.reject(error);
  },
);
