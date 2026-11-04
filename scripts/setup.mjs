import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {spawnSync} from 'node:child_process'
import {createInterface} from 'node:readline/promises'
import {stdin, stdout} from 'node:process'

const rootEnvPath = new URL('../.env', import.meta.url)
const studioEnvPath = new URL('../apps/blog/.env', import.meta.url)

const parseEnv = (path) => {
  if (!existsSync(path)) return {}

  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separator = line.indexOf('=')
        const key = line.slice(0, separator)
        const rawValue = line.slice(separator + 1).trim()
        const value = rawValue.startsWith('"') && rawValue.endsWith('"')
          ? JSON.parse(rawValue)
          : rawValue
        return [key, value]
      }),
  )
}

const formatEnv = (values) => Object.entries(values)
  .filter(([, value]) => value !== undefined && value !== '')
  .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
  .join('\n') + '\n'

const existingRoot = parseEnv(rootEnvPath)
const existingStudio = parseEnv(studioEnvPath)
const terminal = createInterface({input: stdin, output: stdout})

const ask = async (label, fallback = '') => {
  const suffix = fallback ? ` (${fallback})` : ''
  const value = (await terminal.question(`${label}${suffix}: `)).trim()
  return value || fallback
}

const askSecret = async (label, existing = '') => {
  if (existing) {
    const keep = (await ask(`${label} is already configured. Keep it`, 'yes')).toLowerCase()
    if (keep === 'yes' || keep === 'y') return existing
  }
  return ask(label)
}

stdout.write('\nPortfolio setup\n\n')

const projectId = await ask('Sanity project ID', existingRoot.SANITY_PROJECT_ID || existingStudio.SANITY_STUDIO_PROJECT_ID || '')
if (!projectId) {
  terminal.close()
  throw new Error('Sanity project ID is required')
}

const dataset = await ask('Sanity dataset', existingRoot.SANITY_DATASET || existingStudio.SANITY_STUDIO_DATASET || 'production')
const apiVersion = await ask('Sanity API version', existingRoot.SANITY_API_VERSION || '2025-02-19')
const apiToken = await askSecret('Sanity API token for server mutations, optional', existingRoot.SANITY_API_TOKEN || '')
const studioAppId = await ask('Sanity Studio app ID, optional', existingStudio.SANITY_STUDIO_APP_ID || '')
const siteUrl = await ask('Production site URL', existingRoot.SITE_URL || 'https://obiabo.com')
const adminSecret = existingRoot.ADMIN_SECRET
  ? await askSecret('Admin secret', existingRoot.ADMIN_SECRET)
  : randomBytes(32).toString('hex')
const telegramToken = await askSecret('Telegram bot token, optional', existingRoot.TELEGRAM_BOT_TOKEN || '')
const telegramChatId = await ask('Telegram chat ID, optional', existingRoot.TELEGRAM_CHAT_ID || '')

const rootValues = {
  SANITY_PROJECT_ID: projectId,
  SANITY_DATASET: dataset,
  SANITY_API_VERSION: apiVersion,
  SANITY_API_TOKEN: apiToken,
  SITE_URL: siteUrl,
  ADMIN_SECRET: adminSecret,
  TELEGRAM_BOT_TOKEN: telegramToken,
  TELEGRAM_CHAT_ID: telegramChatId,
}

const studioValues = {
  SANITY_STUDIO_PROJECT_ID: projectId,
  SANITY_STUDIO_DATASET: dataset,
  SANITY_STUDIO_APP_ID: studioAppId,
}

writeFileSync(rootEnvPath, formatEnv(rootValues), {mode: 0o600})
writeFileSync(studioEnvPath, formatEnv(studioValues), {mode: 0o600})

const install = (await ask('Install dependencies', 'yes')).toLowerCase()
terminal.close()

if (install === 'yes' || install === 'y') {
  const result = spawnSync('pnpm', ['install'], {cwd: new URL('..', import.meta.url), stdio: 'inherit', shell: process.platform === 'win32'})
  if (result.status !== 0) throw new Error('Dependency installation failed. Install pnpm and run pnpm install')
}

stdout.write('\nSetup complete\nRun pnpm dev for the portfolio\nRun pnpm blog:dev for Sanity Studio\n')
