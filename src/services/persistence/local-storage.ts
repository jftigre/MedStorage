import type { Lote, Medicamento, Perfil } from "@/types";
export const STORAGE_KEYS = { medicamentos: "medstorage_medicamentos", lotes: "medstorage_lotes", users: "medstorage_usersDB", session: "medstorage_usuario" } as const;
const read = <T>(key: string, fallback: T): T => { if (typeof window === "undefined") return fallback; try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch (error) { console.error(`[local-storage] Falha ao ler ${key}`, error); return fallback; } };
const write = (key: string, value: unknown): void => { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.error(`[local-storage] Falha ao salvar ${key}`, error); throw new Error("Não foi possível salvar os dados no navegador."); } };
export const localStorageAdapter = {
  getMedicamentos: (): Medicamento[] => read(STORAGE_KEYS.medicamentos, []),
  getLotes: (): Lote[] => read(STORAGE_KEYS.lotes, []),
  saveMedicamentos: (items: Medicamento[]) => write(STORAGE_KEYS.medicamentos, items),
  saveLotes: (items: Lote[]) => write(STORAGE_KEYS.lotes, items),
  getSession: (): Perfil | null => read(STORAGE_KEYS.session, null),
  saveSession: (profile: Perfil) => write(STORAGE_KEYS.session, profile),
  clearSession: () => { if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEYS.session); },
  getUsers: (): Array<Perfil & { senha: string }> => read(STORAGE_KEYS.users, []),
  saveUsers: (users: Array<Perfil & { senha: string }>) => write(STORAGE_KEYS.users, users),
};
export function normalizeLegacyData(): void {
  if (typeof window === "undefined") return;
  const medicines = localStorageAdapter.getMedicamentos();
  const independent = localStorageAdapter.getLotes();
  const nested = medicines.flatMap((item) => ((item as Medicamento & { lotes?: Array<Partial<Lote>> }).lotes ?? []).map((lote) => ({ id: lote.id ?? `${item.id}-${lote.validade ?? "lote"}`, medicamento_id: item.id, validade: lote.validade ?? "", quantidade: Number(lote.quantidade ?? 0), preco_pago: Number(lote.preco_pago ?? 0), local_compra: lote.local_compra ?? "Farmácia", em_promocao: Boolean(lote.em_promocao) })));
  const unique = Array.from(new Map([...independent, ...nested].filter((item) => item.id).map((item) => [item.id, item])).values());
  if (unique.length) localStorageAdapter.saveLotes(unique);
}
