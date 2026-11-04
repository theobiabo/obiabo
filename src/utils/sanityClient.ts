import {createClient} from '@sanity/client'

const projectId = import.meta.env.SANITY_PROJECT_ID
const dataset = import.meta.env.SANITY_DATASET || 'production'
const apiVersion = import.meta.env.SANITY_API_VERSION || '2025-02-19'
const token = import.meta.env.SANITY_API_TOKEN

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID is required. Run pnpm setup to configure the application.')
}

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: import.meta.env.PROD,
})

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})
