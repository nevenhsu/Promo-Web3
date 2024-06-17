import { AdminProvider } from '@/store/contexts/AdminContext'
import { EpochProvider } from '@/store/contexts/EpochContext'
import { ActivityProvider } from '@/store/contexts/ActivityContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminProvider>
        <EpochProvider>
          <ActivityProvider>{children}</ActivityProvider>
        </EpochProvider>
      </AdminProvider>
    </>
  )
}
