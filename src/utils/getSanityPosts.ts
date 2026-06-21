import { sanity } from "./sanityClient";

export async function getSanityPosts() {
  const query = `*[_type == "post"]|order(coalesce(firstPublishedAt, publishedAt, _createdAt) desc){
    _id,
    _createdAt,
    title,
    description,
    firstPublishedAt,
    publishedAt,
    slug,
    tags,
    body
  }`;
  return await sanity.fetch(query);
}
