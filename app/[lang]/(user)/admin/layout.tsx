import { AdminProvider } from '@/store/contexts/admin/AdminContext'
import { EpochProvider } from '@/store/contexts/admin/EpochContext'
import { ActivityProvider } from '@/store/contexts/admin/ActivityContext'

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
