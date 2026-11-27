import { Header } from "@/components/layout/header";
import { LoginForm } from "@/components/auth/auth-form";
export default function LoginPage() { return <><Header /><main className="mx-auto max-w-md px-4 py-12"><div className="rounded-lg bg-white p-6 shadow-sm"><h1 className="mb-6 text-3xl font-bold">Entrar</h1><LoginForm /></div></main></>; }
