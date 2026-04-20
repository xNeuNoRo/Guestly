/**
 * @description Mapa de rutas refinado basado en los controladores actuales del backend.
 * Se eliminan rutas redundantes para centrarse en la lógica de Propiedades, Reservas y Perfil.
 * ESTO PUEDE CAMBIAR A MEDIDA QUE REFINE EL FRONTEND
 */
export const ROUTES = {
  // Acceso libre (PUBLIC) - No requiere autenticación, pero puede tener rutas dinámicas para detalles
  PUBLIC: {
    HOME: "/",
    PROPERTY_DETAIL: (id: string) => `/properties/${id}`,
    USER_PROFILE: (id: string) => `/profile/${id}`,
  },

  // Flujo de acceso (publicOnly: true)
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Usuario común (GUEST / General)
  USER: {
    SETTINGS: "/settings", // Engloba UpdateProfile, ChangePassword, ChangeEmail
    RESERVATIONS: "/reservations", // Tus propias reservas
    NOTIFICATIONS: "/notifications",
    VERIFY_EMAIL: "/verify-email",
  },

  // Lógica de Anfitrión (HOST)
  HOST: {
    DASHBOARD: "/host",
    PROPERTIES: "/host/properties",
    NEW_PROPERTY: "/host/properties/new",
    RESERVATIONS: "/host/reservations", // Reservas de las propiedades del host
  },

  // Error/Seguridad
  UNAUTHORIZED: "/unauthorized",
} as const;
