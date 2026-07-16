import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const DEFAULT_PAGES_BASE = '/FuerLuca/';

const normalizeBasePath = (path: string) => {
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

const base = normalizeBasePath(
  process.env.VITE_BASE_PATH ??
    (process.env.GITHUB_ACTIONS ? DEFAULT_PAGES_BASE : '/'),
);

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
