import './globals.css'
import '@/utils/console'

import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  minimumScale: 1,
  initialScale: 1,
  userScalable: false,
}

// generateMetadata
export * from './metadata'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
