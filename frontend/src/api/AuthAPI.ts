import { handleApiError } from "@/helpers/handleApiError";
import { validateApiRes } from "@/helpers/validateApiRes";
import { api } from "@/lib/axios";
import {
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
  type ResendConfirmationEmailRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
  authResponseSchema,
} from "@/schemas/auth.schemas";

export const register = async (
  request: RegisterRequest,
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post("/auth/register", request);
    return validateApiRes(data, authResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  try {
    const { data } = await api.post("/auth/login", request);
    return validateApiRes(data, authResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

export const confirmEmail = async (
  email: string,
  token: string,
): Promise<void> => {
  try {
    const params = new URLSearchParams({ email, token });
    await api.post(`/auth/confirm-email?${params.toString()}`);
  } catch (error) {
    handleApiError(error);
  }
};

export const resendConfirmation = async (
  request: ResendConfirmationEmailRequest,
): Promise<void> => {
  try {
    await api.post("/auth/resend-confirmation", request);
  } catch (error) {
    handleApiError(error);
  }
};

export const forgotPassword = async (
  request: ForgotPasswordRequest,
): Promise<void> => {
  try {
    await api.post("/auth/forgot-password", request);
  } catch (error) {
    handleApiError(error);
  }
};

export const resetPassword = async (
  request: ResetPasswordRequest,
): Promise<void> => {
  try {
    await api.post("/auth/reset-password", request);
  } catch (error) {
    handleApiError(error);
  }
};
