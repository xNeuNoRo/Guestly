import { UserRole } from "@/schemas/auth.schemas";

export interface GuardConfig {
  allowedRoles?: UserRole[];
  requireEmailConfirmed?: boolean;
  publicOnly?: boolean;
}