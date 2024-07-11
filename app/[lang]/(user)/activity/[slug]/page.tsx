import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { getTweet as _getTweet } from 'react-tweet/api'
import { TweetSkeleton, EmbeddedTweet, TweetNotFound } from 'react-tweet'
import ActivityDetail from '@/components/Activity/Detail'

export const revalidate = 3600 // revalidate at most every hour

const getTweet = unstable_cache(async (id: string) => _getTweet(id), ['tweet'], {
  revalidate,
})

export default function ActivityDetailPage({
  params: { lang, slug },
}: {
  params: { lang: string; slug: string }
}) {
  // TODO: get post link from db
  return (
    <>
      <ActivityDetail slug={slug}>
        {/* Embedded Post */}
        <Suspense fallback={<TweetSkeleton />}>
          <TweetPage id="1629307668568633344" />
        </Suspense>
      </ActivityDetail>
    </>
  )
}

async function TweetPage({ id }: { id: string }) {
  try {
    const tweet = await getTweet(id)
    console.log('Successfully fetch tweet', id)
    return tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />
  } catch (error) {
    console.error(error)
    return <TweetNotFound error={error} />
  }
}
