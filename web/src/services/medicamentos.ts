import { localStorageAdapter } from "@/services/persistence/local-storage";
import type { Lote, Medicamento } from "@/types";
const id = () => typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
export const medicamentoService = {
  listar: () => localStorageAdapter.getMedicamentos(),
  lotes: () => localStorageAdapter.getLotes(),
  criar: (data: Omit<Medicamento, "id" | "usuario_id" | "criado_em">) => { const item = { ...data, id: id(), usuario_id: localStorageAdapter.getSession()?.id ?? "user-local", criado_em: new Date().toISOString() }; localStorageAdapter.saveMedicamentos([...localStorageAdapter.getMedicamentos(), item]); return item; },
  atualizar: (medicineId: string, data: Partial<Medicamento>) => { const items = localStorageAdapter.getMedicamentos(); const found = items.find((item) => item.id === medicineId); if (!found) throw new Error("Medicamento não encontrado."); const updated = { ...found, ...data, id: medicineId }; localStorageAdapter.saveMedicamentos(items.map((item) => item.id === medicineId ? updated : item)); return updated; },
  excluir: (medicineId: string) => { localStorageAdapter.saveMedicamentos(localStorageAdapter.getMedicamentos().filter((item) => item.id !== medicineId)); localStorageAdapter.saveLotes(localStorageAdapter.getLotes().filter((item) => item.medicamento_id !== medicineId)); },
  adicionarLote: (data: Omit<Lote, "id" | "criado_em">) => { const item = { ...data, id: id(), criado_em: new Date().toISOString() }; localStorageAdapter.saveLotes([...localStorageAdapter.getLotes(), item]); return item; },
  removerLote: (loteId: string) => localStorageAdapter.saveLotes(localStorageAdapter.getLotes().filter((item) => item.id !== loteId)),
};
