import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), 'index.html'),
        login: resolve(process.cwd(), 'login.html'),
        dashboard: resolve(process.cwd(), 'dashboard.html'),
        medicamentos: resolve(process.cwd(), 'medicamentos.html'),
        medicamentoForm: resolve(process.cwd(), 'medicamento-form.html'),
        simulador: resolve(process.cwd(), 'simulador.html'),
        alertas: resolve(process.cwd(), 'alertas.html'),
      },
    },
  },
});
