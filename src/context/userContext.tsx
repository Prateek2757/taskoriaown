"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string | null;
  role?: string; // "customer" | "provider"
  isVerified?: boolean;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  provider_verified?: boolean;
  is_onboarded?: boolean;
  serviceCategory?: string | null;
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  switchRole: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("user_data");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const switchRole = () => {
    if (!user) return;
    const newRole = user.role === "provider" ? "customer" : "provider";
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    sessionStorage.setItem("user_data", JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{ user, setUser, switchRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
