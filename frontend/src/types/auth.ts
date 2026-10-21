export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
}
