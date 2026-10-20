const dataComDeslocamento = (dias) => {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toISOString().slice(0, 10);
};

export const seedData = [
  {
    id: 'seed-paracetamol',
    usuario_id: 'user-01',
    nome: 'Paracetamol',
    dosagem: '500 mg',
    forma: 'comprimido',
    finalidade: 'Alívio de dores e febre',
    comprimidos_por_dose: 1,
    doses_por_dia: 2,
    estoque_minimo_dias: 15,
    lotes: [
      {
        id: 'lote-paracetamol-01',
        quantidade: 60,
        validade: dataComDeslocamento(180)
      }
    ]
  },
  {
    id: 'seed-losartana',
    usuario_id: 'user-01',
    nome: 'Losartana',
    dosagem: '50 mg',
    forma: 'comprimido',
    finalidade: 'Controle da pressão arterial',
    comprimidos_por_dose: 1,
    doses_por_dia: 1,
    estoque_minimo_dias: 15,
    lotes: [
      {
        id: 'lote-losartana-01',
        quantidade: 5,
        validade: dataComDeslocamento(150)
      }
    ]
  },
  {
    id: 'seed-omeprazol',
    usuario_id: 'user-01',
    nome: 'Omeprazol',
    dosagem: '20 mg',
    forma: 'cápsula',
    finalidade: 'Proteção gástrica',
    comprimidos_por_dose: 1,
    doses_por_dia: 1,
    estoque_minimo_dias: 15,
    lotes: [
      {
        id: 'lote-omeprazol-01',
        quantidade: 45,
        validade: dataComDeslocamento(30)
      }
    ]
  },
  {
    id: 'seed-amoxicilina',
    usuario_id: 'user-01',
    nome: 'Amoxicilina',
    dosagem: '500 mg',
    forma: 'cápsula',
    finalidade: 'Antibiótico',
    comprimidos_por_dose: 1,
    doses_por_dia: 3,
    estoque_minimo_dias: 5,
    lotes: [
      {
        id: 'lote-amoxicilina-01',
        quantidade: 12,
        validade: dataComDeslocamento(-10)
      }
    ]
  }
];
