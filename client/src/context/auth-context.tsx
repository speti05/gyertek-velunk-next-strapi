"use client";

import { createContext, useContext } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false });

export function AuthProvider({
  isLoggedIn,
  children,
}: {
  isLoggedIn: boolean;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
