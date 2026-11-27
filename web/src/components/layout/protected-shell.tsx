"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/contexts/auth-context";
export function ProtectedShell({ children }: { children: React.ReactNode }) { const { user, hydrated } = useAuth(); const router = useRouter(); useEffect(() => { if (hydrated && !user) router.replace("/login"); }, [hydrated, user, router]); if (!hydrated || !user) return <main className="p-12 text-center">Carregando...</main>; return <><Header /><main className="mx-auto max-w-7xl px-4 py-10">{children}</main></>; }
