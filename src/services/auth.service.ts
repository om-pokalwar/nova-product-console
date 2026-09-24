import apiClient from "@/lib/axios";
import { LoginCredentials, User } from "@/types/auth";
import { supabase } from "@/lib/supabase";

const TOKEN_KEY = "nova_auth_token";
const USER_KEY = "nova_user";

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const username = credentials.username.trim();
    const password = credentials.password;

    // 1. If Supabase is configured and username looks like an email, try Supabase login first
    if (supabase && username.includes("@")) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password,
        });

        if (!error && data.user && data.session) {
          const supabaseUser: User = {
            id: data.user.id,
            username: data.user.email?.split("@")[0] || "user",
            email: data.user.email || username,
            token: data.session.access_token,
            accessToken: data.session.access_token,
            image: "https://dummyjson.com/icon/emilys/128",
          };

          if (typeof window !== "undefined") {
            localStorage.setItem(TOKEN_KEY, supabaseUser.token);
            localStorage.setItem(USER_KEY, JSON.stringify(supabaseUser));
          }
          return supabaseUser;
        }
      } catch {
        // Fallback to DummyJSON
      }
    }

    // 2. DummyJSON Login (default assignment API)
    const response = await apiClient.post<any>("/auth/login", {
      username: username,
      password: password,
      expiresInMins: credentials.expiresInMins || 60,
    });

    const data = response.data;
    const token = data.accessToken || data.token || "mock-token";

    const user: User = {
      id: data.id || 1,
      username: data.username || username,
      email: data.email || `${username}@example.com`,
      firstName: data.firstName || "Admin",
      lastName: data.lastName || "User",
      gender: data.gender || "unspecified",
      image: data.image || "https://dummyjson.com/icon/emilys/128",
      token: token,
      accessToken: token,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return user;
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  },

  getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  getStoredUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },
};
