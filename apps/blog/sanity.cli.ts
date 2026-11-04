import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const appId = process.env.SANITY_STUDIO_APP_ID

if (!projectId) {
  throw new Error('SANITY_STUDIO_PROJECT_ID is required. Run pnpm setup from the repository root.')
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    autoUpdates: true,
    ...(appId ? {appId} : {}),
  },
})
