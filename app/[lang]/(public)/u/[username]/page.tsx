import UserProfile from '@/components/u/Profile'
import dbConnect from '@/lib/dbConnect'
import { getUserByUsername } from '@/lib/db/user'

export const revalidate = 3600 // revalidate at most every hour

export default async function UserProfilePage({
  params,
}: {
  params: { lang: string; username: string }
}) {
  const { username } = await params

  await dbConnect()

  const user = await getUserByUsername(username)

  if (!user) {
    // TODO: Show 404 page
    return null
  }

  //  Warning: Only plain objects can be passed to Client Components
  return (
    <>
      <UserProfile data={JSON.parse(JSON.stringify(user))} />
    </>
  )
}
