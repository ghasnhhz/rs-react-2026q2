/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CACHE_TTL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
