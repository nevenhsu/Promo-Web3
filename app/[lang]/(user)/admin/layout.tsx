import { AdminProvider } from '@/store/contexts/AdminContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminProvider>{children}</AdminProvider>
    </>
  )
}
