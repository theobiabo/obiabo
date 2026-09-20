import {sanity} from './sanityClient'

export type SanityGalleryItem = {
  _id: string
  title: string
  alt: string
  note?: string
  imageUrl: string
  width?: number
  height?: number
  order?: number
}

export async function getSanityGallery(): Promise<SanityGalleryItem[]> {
  const query = `*[_type == "galleryItem" && defined(image.asset)]|order(coalesce(order, 0) asc, _createdAt desc){
    _id,
    title,
    alt,
    note,
    order,
    "imageUrl": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }`

  return await sanity.fetch(query)
}
