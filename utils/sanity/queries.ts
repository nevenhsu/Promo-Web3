import groq from 'groq'
import { client } from '@/utils/sanity/client'
import type { ImageData } from '@/types/sanity/image'
import type { HomeData } from '@/types/sanity/home'
import type { FooterData } from '@/types/sanity/footer'
import type { SanitySlug } from '@/types/sanity/common'

const assetQuery = groq`
asset {
  ...,
  "lqip": @->metadata.lqip,
  "url": @->url,
  "mimeType": @->mimeType,
  "dimensions": @->metadata.dimensions,
},
lottie {
  ...,
  "url": @.asset->url,
}
`

const imageQuery = groq`
*[_id == $id][0] 
`

const memberQuery = groq`
  ...,
  avatar-> {
    ...,
    image {
      ${assetQuery}
    }
  }
`

const activityDataQuery = groq`
  ...,
  categories[]->,
  mainImage {
    ...,
    base { ..., ${assetQuery} },
    xs { ..., ${assetQuery} },
    sm { ..., ${assetQuery} },
    md { ..., ${assetQuery} },
    lg { ..., ${assetQuery} },
    xl { ..., ${assetQuery} }
  },
  author-> {
    ...,
    image {
      ${assetQuery}
    }
  },
`

export async function getImageData(id: string) {
  try {
    const data = await client.fetch<ImageData>(imageQuery, { id })
    return data
  } catch (err) {
    console.error(err)
  }
}

export const homeQuery = groq`
*[_type=='home' && lang==$lang][0]
{
  ...,
  activities[]-> {
    ${activityDataQuery}
    "content": null,
  },
  gallery {
    ...,
    images[] {
      ...,
      "dimensions": lottieImage.asset->metadata.dimensions,
      lottieImage {
        ...,
        ${assetQuery}
      }
    }
  },
  pattern {
    ...,
    image {
      ...,
      "url": @.asset->url
    }
  }
}
`

export async function getHomeData(lang: string): Promise<Partial<HomeData>> {
  try {
    const data = await client.fetch<HomeData>(homeQuery, { lang })
    return data
  } catch (err) {
    console.error(err)
    return {}
  }
}

export const footerQuery = groq`
*[_type=='footer'][0] {
  ...,
  links[] {
    ...,
    qrcode {
      ...,
      ${assetQuery}
    }
  }
}
`

export async function getFooterData(): Promise<Partial<FooterData>> {
  try {
    const data = await client.fetch<FooterData>(footerQuery)
    return data
  } catch (err) {
    console.error(err)
    return {}
  }
}

export const slugQuery = groq`
*[_type=='activity']
{
  slug
}
`

export async function getSlugData() {
  try {
    const data = await client.fetch<Array<SanitySlug>>(slugQuery)
    return data
  } catch (err) {
    console.error(err)
    return []
  }
}

const contentRef = groq`
_type == 'space' => @->,
_type == 'image' => {
  ...,
  ${assetQuery}
},
_type == 'member' => {
  ${memberQuery}
},
_type == 'block' => {
  ...,
  markDefs[] {
    ...,
    _type == 'internalLink' => {
      ...,
      "slug": @.reference->slug.current,
    }
  }
}
`

const getBlockRef = (type: string) => groq`
_type == '${type}' => {
  ...,
  blockContent[] {
    ...,
    ${contentRef}
  }
}
`

const blockContent = groq`
{
  ...,
  ${contentRef},
  
  _type == 'rwd' => {
    ...,
    items[] {
      ...,
      ${contentRef},
      ${getBlockRef('content')},
      ${getBlockRef('titleCard')},
      ${getBlockRef('contentCard')}
    }
  }
}
`

export const activityQuery = groq`
*[_type=='activity' && slug.current==$slug && lang==$lang][0]
{ 
  ${activityDataQuery}
  content[] ${blockContent},
}
`

export const activityMetaQuery = groq`
*[_type=='activity' && slug.current==$slug && lang==$lang][0]
{ 
  ${activityDataQuery}
  "content": null
}
`

export async function getActivityData(slug: string, lang: string) {
  try {
    const data = await client.fetch(activityQuery, { slug, lang })
    return data
  } catch (err) {
    console.error(err)
    return {}
  }
}

export const activitiesQuery = groq`
*[_type=='activity' && lang==$lang && hidden!=true] | order(publishedAt desc)
{ 
  ${activityDataQuery} 
  "content": null
}
`

export async function getActivitiesData(lang: string) {
  try {
    const data = await client.fetch(activitiesQuery, { lang })
    return data
  } catch (err) {
    console.error(err)
    return {}
  }
}

export const devQuery = groq`
*[_type=='dev'][0] {
  ...,
  content[] ${blockContent}
}
`

export async function getDevData() {
  try {
    const data = await client.fetch<any>(devQuery)
    return data
  } catch (err) {
    console.error(err)
    return {}
  }
}

export const metadataQuery = groq`
*[_type=='metadata'][0]
{
  ...,
  cover {
    ...,
    "url": @.asset->url,
    "mimeType": @.asset->mimeType,
    "dimensions": @.asset->metadata.dimensions,
  },
  svg {
    ...,
    "url": @.asset->url,
  },
  png {
    ...,
    "url": @.asset->url,
  },
}
`
