import groq from 'groq'
import { client } from '@/sanity/client'
import type { ImageData } from '@/sanity/types/image'
import type { HomeData } from '@/sanity/types/home'
import type { PageData } from '@/sanity/types/page'
import type { FooterData } from '@/sanity/types/footer'
import type { SanitySlug } from '@/sanity/types/common'
import type { MetadataData } from '@/sanity/types/metadataData'

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

const pageDataQuery = groq`
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
  ...lang[$lang] {
    ...,
    content[] ${blockContent},
  },
  "lang": null,
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
  pages[]-> {
    ${pageDataQuery}
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
*[_type=='page']
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

export const pageQuery = groq`
*[_type=='page' && slug.current==$slug][0]
{ 
  ${pageDataQuery}
}
`

export const pageMetaQuery = groq`
*[_type=='page' && slug.current==$slug] {
  ...,
  ...lang[$lang],
  "content": null,
  "lang": null,
}
`

export async function getPageData(slug: string, lang: string) {
  try {
    const data = await client.fetch<PageData>(pageQuery, { slug, lang })
    return data
  } catch (err) {
    console.error(err)
    return {}
  }
}

export const pagesQuery = groq`
*[_type=='page' && lang==$lang && hidden!=true] | order(publishedAt desc)
{ 
  ${pageDataQuery} 
  "content": null
}
`

export async function getPagesData(lang: string) {
  try {
    const data = await client.fetch(pagesQuery, { lang })
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

export async function getMetadata() {
  try {
    const data = await client.fetch<Partial<MetadataData>>(metadataQuery)
    return data
  } catch (err) {
    console.error(err)
    return {}
  }
}
