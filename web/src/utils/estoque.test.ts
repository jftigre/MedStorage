import { describe, expect, it } from "vitest";
import { calcularConsumoDiario, calcularEstoqueTotal, diasAte, riscoDesperdicio } from "./estoque";
describe("regras de estoque", () => {
  it("calcula consumo e estoque", () => { expect(calcularConsumoDiario({ comprimidos_por_dose: 2, doses_por_dia: 3 })).toBe(6); expect(calcularEstoqueTotal([{ id: "1", medicamento_id: "m", validade: "2030-01-01", quantidade: 4, preco_pago: 0, local_compra: "", em_promocao: false }, { id: "2", medicamento_id: "m", validade: "2030-01-01", quantidade: 5, preco_pago: 0, local_compra: "", em_promocao: false }])).toBe(9); });
  it("calcula dias e desperdício sem resultado negativo", () => { const hoje = new Date("2026-01-01T12:00:00"); expect(diasAte("2026-01-11", hoje)).toBe(10); expect(riscoDesperdicio({ id: "1", medicamento_id: "m", validade: "2026-01-11", quantidade: 20, preco_pago: 0, local_compra: "", em_promocao: false }, 1, hoje)).toBe(10); expect(riscoDesperdicio({ id: "1", medicamento_id: "m", validade: "2025-01-01", quantidade: 20, preco_pago: 0, local_compra: "", em_promocao: false }, 1, hoje)).toBe(20); });
});
