import {getCliClient} from 'sanity/cli'

async function main() {
  const client = getCliClient({apiVersion: '2023-10-01'})
  const selectedWork = [
    {
      _key: 'spendin',
      organization: 'Spendin',
      summary: 'Built guest eSIM checkout, payment recovery, and provider circuit breakers so purchases can complete through failures.',
    },
    {
      _key: 'blue-orchid',
      organization: 'Blue Orchid',
      summary: 'Strengthened OAuth, MCP, and credential flows for an AI work platform, with careful handling of untrusted input and approvals.',
    },
    {
      _key: 'kppay',
      organization: 'KPPAY',
      summary: 'Built merchant gateway flows for API keys, payment integration, and developer documentation.',
    },
  ]

  await client.patch('workWithMePage').set({selectedWorkHeading: 'Selected work', selectedWork}).commit()
  console.log('Selected work updated in Sanity.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
