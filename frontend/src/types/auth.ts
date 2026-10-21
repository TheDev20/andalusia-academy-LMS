export type AppRole = "Learner" | "Instructor" | "Admin" | "ContentManager";

/** Signed-in user as kept by AuthContext. */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[];
  permissions: string[];
}

/** POST /api/auth/login | /register response. */
export interface AuthResponseDto {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
  };
}

export interface ProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  countryCode: string;
  preferredLanguage: string;
  createdAt: string;
  roles: string[];
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  countryCode: string;
  preferredLanguage: string;
}

export interface ForgotPasswordResponse {
  message: string;
  developmentResetToken?: string | null;
}
