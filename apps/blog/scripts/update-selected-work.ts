import {getCliClient} from 'sanity/cli'
import {selectedWork} from './selected-work'

async function main() {
  const client = getCliClient({apiVersion: '2023-10-01'})
  const document = await client.getDocument<{
    selectedWorkHeading?: string
    selectedWork?: typeof selectedWork
  }>('workWithMePage')
  const current = document?.selectedWork ?? []
  const enriched = selectedWork.map((entry) => {
    const existing = current.find((item) => item._key === entry._key)
    return {
      ...entry,
      ...existing,
      _type: 'workEntry',
      slug: existing?.slug?.current ? existing.slug : entry.slug,
      summary: entry.summary,
      sections: entry.sections,
    }
  })
  const extra = current.filter((item) => !selectedWork.some((entry) => entry._key === item._key))

  await client.patch('workWithMePage').set({
    selectedWorkHeading: document?.selectedWorkHeading ?? 'Selected work',
    selectedWork: [...enriched, ...extra],
  }).commit()
  console.log('Selected work updated in Sanity.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
