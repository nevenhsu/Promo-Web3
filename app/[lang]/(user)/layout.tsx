import AuthGuard from '@/components/providers/AuthGuard'

export default function UserLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <>
      <AuthGuard>{children}</AuthGuard>
    </>
  )
}
