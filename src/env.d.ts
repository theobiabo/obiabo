/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID: string
  readonly SANITY_DATASET?: string
  readonly SANITY_API_VERSION?: string
  readonly SANITY_API_TOKEN?: string
  readonly SITE_URL?: string
  readonly TELEGRAM_BOT_TOKEN?: string
  readonly TELEGRAM_CHAT_ID?: string
  readonly ADMIN_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    SANITY_PROJECT_ID?: string
    SANITY_DATASET?: string
    SANITY_API_VERSION?: string
    SANITY_API_TOKEN?: string
    SITE_URL?: string
    SANITY_STUDIO_PROJECT_ID?: string
    SANITY_STUDIO_DATASET?: string
    SANITY_STUDIO_APP_ID?: string
    TELEGRAM_BOT_TOKEN?: string
    TELEGRAM_CHAT_ID?: string
    ADMIN_SECRET?: string
  }
}
