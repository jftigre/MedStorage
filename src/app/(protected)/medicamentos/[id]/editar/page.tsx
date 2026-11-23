"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MedicamentoForm } from "@/components/medicamentos/medicamento-form";
import { medicamentoService } from "@/services/medicamentos";
import type { Medicamento } from "@/types";
export default function Page() { const params = useParams<{ id: string }>(); const [item, setItem] = useState<Medicamento | undefined>(); useEffect(() => setItem(medicamentoService.listar().find((medicine) => medicine.id === params.id)), [params.id]); return item ? <MedicamentoForm existing={item} /> : <p>Medicamento não encontrado.</p>; }
