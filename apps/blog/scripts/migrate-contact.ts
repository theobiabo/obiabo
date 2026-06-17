import {readFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const __dirname = dirname(fileURLToPath(import.meta.url))
const contactPath = join(__dirname, '../../../src/data/contact.md')

async function main() {
  const introMarkdown = await readFile(contactPath, 'utf8')
  const client = getCliClient({apiVersion: '2023-10-01'})

  const result = await client.createOrReplace({
    _id: 'contact',
    _type: 'contact',
    title: 'Contact',
    introMarkdown: introMarkdown.trim(),
    links: [
      {
        _key: 'github',
        title: 'Github',
        url: 'https://github.com/theobiabo',
        description: 'Selected code, open-source work, and technical experiments.',
        showInHeader: true,
      },
      {
        _key: 'linkedin',
        title: 'LinkedIn',
        url: 'https://www.linkedin.com/in/emmanuel-obiabo-5a66371aa/',
        description: 'Professional background, experience, and work updates.',
        showInHeader: true,
      },
      {
        _key: 'twitter',
        title: 'Twitter',
        headerTitle: 'X (Formerly Twitter)',
        url: 'https://x.com/obiabo_immanuel',
        description: 'Short notes, technical links, and occasional updates.',
        showInHeader: true,
      },
      {
        _key: 'email',
        title: 'Email',
        url: 'mailto:theobiabo@gmail.com',
        description: 'The best option for work, collaboration, and direct messages.',
        showInHeader: false,
      },
      {
        _key: 'nostr',
        title: 'Nostr',
        url: 'https://snort.social/nprofile1qqs2c3g85ck4qwpakm9nxzlhfved8yykqylcwdu34ge8whkcxeqx4dqka3xww',
        description: 'Decentralized social notes and experiments.',
        showInHeader: false,
      },
      {
        _key: 'farcaster',
        title: 'Farcaster',
        url: 'https://warpcast.com/obiabo',
        description: 'Social updates and conversations around technology and internet culture.',
        showInHeader: false,
      },
    ],
  })

  console.log(`Migrated contact content to Sanity document: ${result._id}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
