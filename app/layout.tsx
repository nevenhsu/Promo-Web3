import './globals.css'
import '@/utils/console'

import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 2,
}

// generateMetadata
export * from './metadata'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('index layout')
  return <>{children}</>
}
