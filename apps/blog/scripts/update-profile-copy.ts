import {readFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'
import {workWithMeIntro} from './profile-copy'

const __dirname = dirname(fileURLToPath(import.meta.url))
const introPath = join(__dirname, '../../../src/data/intro.md')

async function main() {
  const client = getCliClient({apiVersion: '2023-10-01'})
  const introMarkdown = (await readFile(introPath, 'utf8')).trim()

  await client.patch('about').set({introMarkdown}).commit()
  await client.patch('workWithMePage').set({intro: workWithMeIntro}).commit()

  console.log('Profile introductions updated in Sanity.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
