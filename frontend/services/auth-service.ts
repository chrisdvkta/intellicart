import { API_BASE_URL } from "@/lib/config";

type LoginResult = {
  token: string;
};

export class AuthService {
  async register(input: {
    email: string;
    password: string;
    name: string;
    role: "ADMIN" | "USER";
  }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || body.detail || "Unable to register");
    }
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Invalid credentials");
    }

    const rawCookie = res.headers.get("set-cookie");
    const token = this.extractCookie(rawCookie, "access_token");

    if (!token) {
      throw new Error("Token missing from login response");
    }

    return { token };
  }

  private extractCookie(headerValue: string | null, key: string) {
    if (!headerValue) return null;
    const cookies = headerValue.split(",");
    for (const cookie of cookies) {
      const parts = cookie.trim().split(";");
      const [name, value] = parts[0].split("=");
      if (name === key) {
        return value;
      }
    }
    return null;
  }
}

export const authService = new AuthService();
