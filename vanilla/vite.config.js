import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        medicamentoForm: resolve(import.meta.dirname, 'medicamento-form.html'),
        medicamentos: resolve(import.meta.dirname, 'medicamentos.html')
      }
    }
  }
});
