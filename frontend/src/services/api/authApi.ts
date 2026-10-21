import { apiRequest } from "./httpClient";
import type {
  AuthResponseDto,
  ForgotPasswordResponse,
  ProfileDto,
  UpdateProfileRequest,
  User,
} from "../../types/auth";

export interface Session {
  token: string;
  user: User;
}

export function toSession(response: AuthResponseDto): Session {
  const u = response.user;
  return {
    token: response.accessToken,
    user: {
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      fullName: `${u.firstName} ${u.lastName}`.trim(),
      roles: u.roles,
      permissions: u.permissions,
    },
  };
}

export const authApi = {
  async register(data: { firstName: string; lastName: string; email: string; password: string }): Promise<Session> {
    return toSession(await apiRequest<AuthResponseDto>("/api/auth/register", { method: "POST", body: data, auth: false }));
  },

  async login(credentials: { email: string; password: string }): Promise<Session> {
    return toSession(await apiRequest<AuthResponseDto>("/api/auth/login", { method: "POST", body: credentials, auth: false }));
  },

  logout(): Promise<void> {
    return apiRequest<void>("/api/auth/logout", { method: "POST" });
  },

  forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiRequest<ForgotPasswordResponse>("/api/auth/forgot-password", { method: "POST", body: { email }, auth: false });
  },

  resetPassword(data: { email: string; token: string; newPassword: string }): Promise<void> {
    return apiRequest<void>("/api/auth/reset-password", { method: "POST", body: data, auth: false });
  },

  getProfile(signal?: AbortSignal): Promise<ProfileDto> {
    return apiRequest<ProfileDto>("/api/me/profile", { signal });
  },

  updateProfile(data: UpdateProfileRequest): Promise<ProfileDto> {
    return apiRequest<ProfileDto>("/api/me/profile", { method: "PUT", body: data });
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<Session> {
    return toSession(await apiRequest<AuthResponseDto>("/api/me/change-password", { method: "POST", body: data }));
  },
};
