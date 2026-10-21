import { AuthResponse, User } from "../../types/auth";

const API_BASE = "/api/v1/auth";

export const authApi = {
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Registration failed");
    }
    return res.json();
  },

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Invalid email or password");
    }
    return res.json();
  },

  async getMe(token: string): Promise<User> {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Session expired");
    const data = await res.json();
    return {
      id: data.id,
      email: data.email,
      fullName: `${data.firstName} ${data.lastName}`,
      roles: data.roles,
    };
  },
};
