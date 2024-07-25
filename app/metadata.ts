import { getMetadata } from '@/utils/sanity/queries'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const data = await getMetadata()

  // if (!data) throw new Error('no metadata document')
  const { title, description, author, keywords, cover, svg, png } = data || {}

  // cover
  const images = cover
    ? {
        url: cover?.url,
        type: cover?.mimeType,
        width: cover?.dimensions.width,
        height: cover?.dimensions.height,
      }
    : []

  // favicon
  const icon =
    svg && png
      ? [
          { type: 'image/svg+xml', url: svg?.url },
          { type: 'image/png', url: png?.url },
        ]
      : []

  const metadata: Metadata = {
    title,
    description,
    authors: { name: author },

    openGraph: {
      title,
      description,
      images,
      type: 'website',
    },

    keywords,

    icons: { icon },
  }

  return metadata
}
