import { draftMode } from 'next/headers'
import { getSlugData, getPageData } from '@/sanity/queries'
import Page from '@/components/Page'

// generateMetadata
export * from './metadata'

type PageProps = {
  params: Promise<{ lang: string; slug: string }>
}

export default async function PagePage({ params }: PageProps) {
  const { lang, slug } = await params
  const { isEnabled } = await draftMode()
  const data = isEnabled ? {} : await getPageData(slug, lang)

  return (
    <>
      <Page slug={slug} lang={lang} initialData={data} />
    </>
  )
}

export const revalidate = 3600 // revalidate at most every hour

export async function generateStaticParams() {
  const results = await getSlugData()
  return results.map(o => ({ slug: o.slug.current }))
}
