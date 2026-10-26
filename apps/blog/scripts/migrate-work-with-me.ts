import {getCliClient} from 'sanity/cli'

async function main() {
  const client = getCliClient({apiVersion: '2023-10-01'})
  const document = {
    _id: 'workWithMePage',
    _type: 'workWithMePage',
    heading: 'Bring me the tricky parts.',
    seoDescription: 'Build web and mobile apps, APIs, developer tools, and distributed systems with Emmanuel Obiabo.',
    intro:
      "I design and build web and mobile products, APIs, and SDKs with TypeScript and Rust, and I pick up new technologies when the work calls for them. I have experience in fintech, blockchain, developer tools, and AI. I'm open to roles in any field.",
    topicsHeading: 'Things I like untangling',
    topics: [
      'Features where the interface, API, and background worker need to agree.',
      'Payment SDKs with encrypted requests, typed errors, and clear retry signals.',
      'Distributed systems with queues, idempotency keys, and partial failures.',
    ],
    contactPrompt: 'Have a problem worth digging into?',
    contactLinkLabel: "Let's talk",
    contactPath: '/reach',
  }

  await client.createIfNotExists(document)
  console.log('Work with me content is available in Sanity.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
