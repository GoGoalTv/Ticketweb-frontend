"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      console.log("token");
      if (token) {
        try {
          const response = await api.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }else{
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to fetch user after login", error);
      // Optional: handle error, maybe logout
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };


  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
