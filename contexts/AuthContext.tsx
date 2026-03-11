"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, companyApi, UserDto, CompanyDto } from "@/lib/api";

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: UserDto | null;
  company: CompanyDto | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void | Promise<void>;
  refreshUser: () => Promise<void>;
  refreshCompany: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserDto | null>(null);
  const [company, setCompany] = useState<CompanyDto | null>(null);

  // Sayfa yüklendiğinde oturum kontrolü (HttpOnly cookie ile; JS token'a erişemez)
  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshUser();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const response = await authApi.getProfile();
      if (response.success && response.user) {
        setUser(response.user);
        await refreshCompany();
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Kullanıcı bilgisi alınamadı:", error);
      }
      throw error;
    }
  };

  const refreshCompany = async () => {
    try {
      const response = await companyApi.getMyCompany();
      if (response.success && response.company) {
        setCompany(response.company);
      } else {
        setCompany(null);
      }
    } catch {
      setCompany(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      if (response.success) {
        // Backend Set-Cookie (HttpOnly) döndü; sonraki isteklerde cookie gider
        setUser(response.user || null);
        setIsLoggedIn(true);
        await refreshCompany();
        return { success: true, message: "Giriş başarılı" };
      }

      return { success: false, message: response.message || "Giriş başarısız" };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Giriş başarısız";
      return { success: false, message };
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
  }) => {
    try {
      const response = await authApi.register(data);

      if (response.success) {
        if (response.token) {
          setUser(response.user || null);
          setIsLoggedIn(true);
        }
        return { success: true, message: "Kayıt başarılı" };
      }

      return { success: false, message: response.message || "Kayıt başarısız" };
    } catch (error: unknown) {
      if (process.env.NODE_ENV === "development") {
        console.error("AuthContext register error:", error);
      }
      const message = error instanceof Error ? error.message : "Kayıt başarısız";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Backend logout yoksa veya hata olsa da client state temizlenir
    } finally {
      setUser(null);
      setCompany(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        company,
        login,
        register,
        logout,
        refreshUser,
        refreshCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
