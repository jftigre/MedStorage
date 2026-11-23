import type { Lote, Medicamento } from "@/types";
const date = (days: number) => { const value = new Date(); value.setDate(value.getDate() + days); return value.toISOString().slice(0, 10); };
export const seedMedicamentos: Medicamento[] = [
  { id: "seed-paracetamol", usuario_id: "user-01", nome: "Paracetamol", dosagem: "500 mg", forma: "comprimido", finalidade: "Alívio de dores e febre", comprimidos_por_dose: 1, doses_por_dia: 2, estoque_minimo_dias: 15, criado_em: new Date().toISOString() },
  { id: "seed-losartana", usuario_id: "user-01", nome: "Losartana", dosagem: "50 mg", forma: "comprimido", finalidade: "Controle da pressão arterial", comprimidos_por_dose: 1, doses_por_dia: 1, estoque_minimo_dias: 15, criado_em: new Date().toISOString() },
];
export const seedLotes: Lote[] = [
  { id: "seed-lote-paracetamol", medicamento_id: "seed-paracetamol", validade: date(180), quantidade: 60, preco_pago: 0, local_compra: "Farmácia", em_promocao: false },
  { id: "seed-lote-losartana", medicamento_id: "seed-losartana", validade: date(30), quantidade: 5, preco_pago: 0, local_compra: "Farmácia", em_promocao: false },
];
