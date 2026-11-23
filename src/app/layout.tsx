import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
export const metadata: Metadata = { title: "MedStorage", description: "Controle pessoal de estoque de medicamentos" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body className="bg-mist text-ink antialiased"><Providers>{children}</Providers></body></html>; }
