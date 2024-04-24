import { unstable_setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { ColorSchemeScript } from '@mantine/core'
import { AppProvider } from '@/store/AppContext'
import Providers from '@/components/providers/Providers'
import MyAppShell from '@/components/MyAppShell'
import { fontVariables } from '@/theme/font'
import { env, publicEnv } from '@/utils/env'

const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS

// Ensuring code needed for live previewing drafts are only loaded when needed.
const PreviewProvider = dynamic(() => import('@/components/providers/PreviewProvider'))

export const revalidate = 3600 // revalidate at most every hour

export function generateStaticParams() {
  return env.locales.map(lang => ({ lang }))
}

export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  unstable_setRequestLocale(lang)

  const { isEnabled } = draftMode()
  const messages = useMessages()

  const renderContent = () => {
    return <MyAppShell>{children}</MyAppShell>
  }

  return (
    <html lang={lang} className={fontVariables}>
      <head>
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></Script>
        <Script id="google-analytics">
          {gaId
            ? `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gaId}');
            `
            : null}
        </Script>
        <ColorSchemeScript defaultColorScheme={publicEnv.defaultColorScheme} />
      </head>
      <body style={{ width: '100vw', overflowX: 'hidden' }}>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <AppProvider isPreview={isEnabled}>
            <Providers>
              {isEnabled ? (
                <PreviewProvider token={env.sanityToken}>{renderContent()}</PreviewProvider>
              ) : (
                <>{renderContent()}</>
              )}
            </Providers>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
