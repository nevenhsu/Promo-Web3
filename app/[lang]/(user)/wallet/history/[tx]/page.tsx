import HistoryTx from '@/components/Wallet/History/Tx'

export default async function ActivityDetailPage({
  params,
}: {
  params: { lang: string; tx: string }
}) {
  const { tx } = await params
  return (
    <>
      <HistoryTx tx={tx} />
    </>
  )
}
