import HistoryTx from '@/components/Wallet/History/Tx'

export default function ActivityDetailPage({
  params: { lang, tx },
}: {
  params: { lang: string; tx: string }
}) {
  return (
    <>
      <HistoryTx tx={tx} />
    </>
  )
}
