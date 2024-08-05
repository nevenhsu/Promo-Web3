import imageUrlBuilder from '@sanity/image-url'
import { publicEnv } from '@/utils/env'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const { projectId, dataset } = publicEnv.sanity

const builder = imageUrlBuilder({
  projectId,
  dataset,
})

export const urlFor = (source: SanityImageSource) => builder.image(source)
