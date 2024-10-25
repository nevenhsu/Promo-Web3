import { NextIntlClientProvider } from 'next-intl'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { ColorSchemeScript } from '@mantine/core'
import { detectDevice } from '@/lib/userAgent'
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const { lang } = await params

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(lang as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(lang)

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  const { isEnabled } = await draftMode()
  const { isMobileDevice } = await detectDevice()

  const renderContent = () => {
    return <MyAppShell>{children}</MyAppShell>
  }

  return (
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
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
          <AppProvider isPreview={isEnabled} isMobileDevice={isMobileDevice}>
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
