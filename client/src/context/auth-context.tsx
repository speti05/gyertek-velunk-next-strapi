"use client";

import { createContext, useContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail?: string;
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false });

export function AuthProvider({
  isLoggedIn,
  userEmail,
  children,
}: {
  isLoggedIn: boolean;
  userEmail?: string;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={{ isLoggedIn, userEmail }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
