import {sanity} from './sanityClient'

export type SanityAbout = {
  _id: string
  title?: string
  introMarkdown?: string
  fullMarkdown?: string
}

export async function getSanityAbout(): Promise<SanityAbout | null> {
  const query = `*[_type == "about" && _id == "about"][0]{
    _id,
    title,
    introMarkdown,
    fullMarkdown
  }`

  return await sanity.withConfig({useCdn: false}).fetch(query)
}
