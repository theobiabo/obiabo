import {sanity} from './sanityClient'

export type SanityGalleryItem = {
  _id: string
  title: string
  alt: string
  note?: string
  category: 'personal' | 'coffee' | 'other'
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
    category,
    order,
    "imageUrl": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }`

  const items = await sanity.fetch<Array<Omit<SanityGalleryItem, 'category'> & {category?: string}>>(query)
  return items.map((item) => ({
    ...item,
    category: item.category === 'personal' || item.category === 'coffee' ? item.category : 'other',
  }))
}
