import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { getTweet as _getTweet } from 'react-tweet/api'
import { TweetSkeleton, EmbeddedTweet, TweetNotFound } from 'react-tweet'
import ActivityDetail from '@/components/Activity/Detail'
import dbConnect from '@/lib/dbConnect'
import { getPublicActivity } from '@/lib/db/activity'
import { SocialMedia } from '@/types/db'

// TODO: check the cache behavior in next 15

const getTweet = unstable_cache(async (id: string) => _getTweet(id), ['tweet'], {
  revalidate: 3600,
})

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug: _slug } = await params
  const slug = decodeURIComponent(_slug)

  await dbConnect()
  const activity = await getPublicActivity(slug)

  if (!activity) {
    // TODO: Show 404 page
    return null
  }

  const { details, socialMedia } = activity
  const postLink = details.link
  const isX = socialMedia === SocialMedia.X

  //  Warning: Only plain objects can be passed to Client Components
  return (
    <>
      <ActivityDetail data={JSON.parse(JSON.stringify(activity))}>
        {/* Embedded Post */}
        {isX && (
          <Suspense fallback={<TweetSkeleton />}>
            <TweetPage id={postLink} />
          </Suspense>
        )}
      </ActivityDetail>
    </>
  )
}

async function TweetPage({ id }: { id: string }) {
  try {
    if (!id) {
      return <TweetNotFound />
    }

    const tweet = await getTweet(id)
    return tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />
  } catch (error) {
    console.error(error)
    return <TweetNotFound error={error} />
  }
}
