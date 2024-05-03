import { unstable_setRequestLocale } from 'next-intl/server'
import Introduction from '@/components/Introduction'

export default function LocalePage({ params: { lang } }: { params: { lang: string } }) {
  unstable_setRequestLocale(lang)

  return <Introduction />
}
