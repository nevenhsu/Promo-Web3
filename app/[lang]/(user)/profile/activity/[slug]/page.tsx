import UpdateActivity from '@/components/Profile/Activity/Update'

export default async function UpdateActivityPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug: _slug } = await params
  const slug = decodeURIComponent(_slug)

  return (
    <>
      <UpdateActivity slug={slug} />
    </>
  )
}
