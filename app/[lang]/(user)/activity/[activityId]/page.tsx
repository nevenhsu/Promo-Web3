import ActivityDetail from '@/components/Activity/Detail'

export default function ActivityDetailPage({
  params: { lang, activityId },
}: {
  params: { lang: string; activityId: string }
}) {
  return (
    <>
      <ActivityDetail activityId={activityId} />
    </>
  )
}
