import { AdminProvider } from '@/store/contexts/AdminContext'
import { EpochProvider } from '@/store/contexts/EpochContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminProvider>
        <EpochProvider>{children}</EpochProvider>
      </AdminProvider>
    </>
  )
}
