import {getCliClient} from 'sanity/cli'

async function main() {
  const client = getCliClient({apiVersion: '2023-10-01'})

  const result = await client.createOrReplace({
    _id: 'theme',
    _type: 'theme',
    title: 'Site theme',
    fontStylesheetUrl:
      'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Geist+Mono:wght@100..900&family=IBM+Plex+Mono:ital,wght@0,100..700;1,100..700&family=Instrument+Serif:ital@0;1&family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400..700&family=Merriweather:wght@300;400;700;900&family=Newsreader:opsz,wght@6..72,200..800&family=Source+Code+Pro:wght@200..900&family=Space+Mono:wght@400;700&display=swap',
    monoFontFamily: '"IBM Plex Mono", monospace',
    serifFontFamily: '"Instrument Serif", serif',
    primaryBackgroundColor: '#141414',
    secondaryBackgroundColor: '#1a1a1a',
    primaryTextColor: '#c8ccda',
    mutedTextColor: '#999999',
    borderColor: '#333333',
    accentColor: '#e53636',
  })

  console.log(`Migrated theme content to Sanity document: ${result._id}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
