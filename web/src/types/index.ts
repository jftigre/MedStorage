export interface Lote { id: string; medicamento_id: string; validade: string; quantidade: number; preco_pago: number; local_compra: string; em_promocao: boolean; criado_em?: string; }
export interface Medicamento { id: string; usuario_id: string; nome: string; dosagem: string; forma: string; finalidade?: string; comprimidos_por_dose: number; doses_por_dia: number; estoque_minimo_dias: number; criado_em: string; }
export interface MedicamentoComMetricas extends Medicamento { consumoDiario: number; estoqueTotal: number; diasRestantes: number; dataTermino: string; }
export interface Perfil { id: string; nome: string; cpf?: string; email: string; telefone?: string; telefoneCuidador?: string; fotoBase64?: string; }
