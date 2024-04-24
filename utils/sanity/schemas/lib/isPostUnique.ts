import { publicEnv } from '@/utils/env'
import type { SlugIsUniqueValidator } from 'sanity'

const { apiVersion } = publicEnv.sanity

// Note: this assumes that every document that has a slug field
// have it on the `slug` field at the root
export const isPostUnique: SlugIsUniqueValidator = async (slug, context) => {
  const { document, getClient } = context

  if (!document) return true

  const client = getClient({ apiVersion })

  const id = document._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    lang: document.lang,
  }
  const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug && lang == $lang][0]._id)`
  const result = await client.fetch(query, params)

  return result
}
