"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { localStorageAdapter, normalizeLegacyData } from "@/services/persistence/local-storage";
import type { Perfil } from "@/types";
import { seedLotes, seedMedicamentos } from "@/services/persistence/seed";
interface AuthContextValue { user: Perfil | null; hydrated: boolean; login: (email: string, senha: string) => boolean; register: (data: Perfil & { senha: string }) => void; logout: () => void; }
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Perfil | null>(null); const [hydrated, setHydrated] = useState(false);
  useEffect(() => { normalizeLegacyData(); if (localStorageAdapter.getMedicamentos().length === 0) { localStorageAdapter.saveMedicamentos(seedMedicamentos); localStorageAdapter.saveLotes(seedLotes); } setUser(localStorageAdapter.getSession()); setHydrated(true); }, []);
  const value = useMemo<AuthContextValue>(() => ({
    user, hydrated,
    login: (email, senha) => { const found = localStorageAdapter.getUsers().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.senha === senha); if (!found) return false; const { senha: _senha, ...profile } = found; localStorageAdapter.saveSession(profile); setUser(profile); return true; },
    register: (data) => { const users = localStorageAdapter.getUsers(); if (users.some((item) => item.email.toLowerCase() === data.email.toLowerCase())) throw new Error("E-mail já registrado."); localStorageAdapter.saveUsers([...users, data]); const { senha: _senha, ...profile } = data; localStorageAdapter.saveSession(profile); setUser(profile); },
    logout: () => { localStorageAdapter.clearSession(); setUser(null); },
  }), [hydrated, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider"); return context; }
