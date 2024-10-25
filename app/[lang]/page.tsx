import { setRequestLocale } from 'next-intl/server'
import Introduction from '@/components/Introduction'

export default async function LocalePage({ params }: { params: { lang: string } }) {
  const { lang } = await params

  // Enable static rendering
  setRequestLocale(lang)

  return <Introduction />
}
