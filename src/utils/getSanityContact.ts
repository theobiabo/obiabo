import {sanity} from './sanityClient'

export type SanityContactLink = {
  title: string
  headerTitle?: string
  url: string
  description?: string
  showInHeader?: boolean
}

export type SanityContact = {
  _id: string
  title?: string
  introMarkdown?: string
  links?: SanityContactLink[]
}

export async function getSanityContact(): Promise<SanityContact | null> {
  const query = `*[_type == "contact"][0]{
    _id,
    title,
    introMarkdown,
    links[]{
      title,
      headerTitle,
      url,
      description,
      showInHeader
    }
  }`

  return await sanity.fetch(query)
}
