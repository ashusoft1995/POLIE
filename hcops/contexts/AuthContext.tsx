"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { mockUsers, roleRedirectMap } from "@/lib/mock-data/auth";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  badge: string;
  rank: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session on mount — check both sessionStorage (login page) and localStorage
  useEffect(() => {
    // Prefer sessionStorage set by the login page
    const ssUser  = sessionStorage.getItem("hcops_user");
    const ssToken = sessionStorage.getItem("hcops_token");
    if (ssToken && ssUser) {
      try {
        const parsed = JSON.parse(ssUser);
        // Normalise mock user shape to User shape
        setToken(ssToken);
        setUser({
          id:       parsed.id       ?? parsed.id,
          username: parsed.username ?? parsed.email ?? parsed.name ?? "",
          email:    parsed.email    ?? "",
          fullName: parsed.fullName ?? parsed.name ?? "",
          role:     parsed.role     ?? "",
          badge:    parsed.badge    ?? "",
          rank:     parsed.rank     ?? "",
        });
        setIsLoading(false);
        return;
      } catch { /* fall through */ }
    }

    // Fallback: legacy localStorage
    const storedToken = localStorage.getItem("auth_token");
    const storedUser  = localStorage.getItem("auth_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // 1. Try real backend
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        signal: AbortSignal.timeout(4000),
      });
      const result = await response.json();
      if (result.success && result.data) {
        const { token: authToken, user: userData } = result.data;
        setToken(authToken);
        setUser(userData);
        sessionStorage.setItem("hcops_token", authToken);
        sessionStorage.setItem("hcops_user",  JSON.stringify(userData));
        redirectToDashboard(userData.role);
        return { success: true };
      }
      return { success: false, message: result.message || "Invalid credentials." };
    } catch { /* backend down — use mock */ }

    // 2. Mock fallback
    const id = username.trim().toLowerCase();
    const mockUser = mockUsers.find(
      u => (u.email.toLowerCase() === id || u.name.toLowerCase() === id) && u.password === password
    );
    if (mockUser) {
      const authUser: User = {
        id:       mockUser.id,
        username: mockUser.email,
        email:    mockUser.email,
        fullName: mockUser.name,
        role:     mockUser.role,
        badge:    mockUser.badge,
        rank:     mockUser.rank,
      };
      setToken("demo-token");
      setUser(authUser);
      sessionStorage.setItem("hcops_token", "demo-token");
      sessionStorage.setItem("hcops_user",  JSON.stringify(authUser));
      redirectToDashboard(mockUser.role);
      return { success: true };
    }

    return { success: false, message: "Invalid username or password." };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("hcops_token");
    sessionStorage.removeItem("hcops_user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/login");
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      sessionStorage.setItem("hcops_user", JSON.stringify(updatedUser));
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
  };

  const redirectToDashboard = (role: string) => {
    const map: Record<string, string> = {
      // Backend roles (uppercase)
      POLICE_HEAD:  "/police-head",
      DETECTIVE:    "/detective",
      TRAFFIC:      "/traffic",
      HR:           "/hr",
      SYSTEM_ADMIN: "/system-admin",
      PREVENTIVE:   "/preventive",
      // Mock roles (lowercase with dash)
      "police-head":  "/police-head",
      "detective":    "/detective",
      "traffic":      "/traffic",
      "hr":           "/hr",
      "system-admin": "/system-admin",
      "preventive":   "/preventive",
      "citizen":      "/citizen",
    };
    router.push(map[role] ?? "/citizen");
  };

  return (
    <AuthContext.Provider value={{
      user, token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login, logout, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
