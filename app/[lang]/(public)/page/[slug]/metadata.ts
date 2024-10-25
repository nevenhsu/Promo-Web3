import { client } from '@/sanity/client'
import { pageMetaQuery } from '@/sanity/queries'
import type { PageMetadataQuery } from '@/sanity/types/page'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { lang: string; slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, lang } = await params
  const data = await client.fetch<PageMetadataQuery>(pageMetaQuery, { slug, lang })

  if (!data) throw new Error('no metadata document')
  const { title, description, mainImage } = data

  const breakpoints = ['xl', 'lg', 'md', 'sm', 'xs', 'base'] as const

  const cover = mainImage?.[breakpoints.find(bp => mainImage[bp]) || 'base']

  const metadata: Metadata = {
    title,
    description,

    openGraph: cover?.asset
      ? {
          title,
          description,
          images: {
            url: cover.asset.url!,
            type: cover.asset.mimeType!,
            width: cover.asset.dimensions!.width,
            height: cover.asset.dimensions!.height,
          },
          type: 'website',
        }
      : {},
  }

  return metadata
}
