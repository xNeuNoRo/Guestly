import { AUTH_TOKEN_KEY } from "@/constants";
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
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

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
      if (globalThis.window !== undefined) {
        // Limpiamos el token muerto
        localStorage.removeItem(AUTH_TOKEN_KEY);

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
