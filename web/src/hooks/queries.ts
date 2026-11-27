"use client";
import { useQuery } from "@tanstack/react-query";
import { medicamentoService } from "@/services/medicamentos";
export const queryKeys = { medicamentos: ["medicamentos"] as const, lotes: ["lotes"] as const };
export function useMedicamentosQuery() { return useQuery({ queryKey: queryKeys.medicamentos, queryFn: medicamentoService.listar }); }
