import ThemeProvider from '@/components/providers/ThemeProvider'
import { fontVariables } from '@/theme/font'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
