import UserProfile from '@/components/u/Profile'
import dbConnect from '@/lib/dbConnect'
import { getUserByUsername } from '@/lib/db/user'
import { getUserTokens } from '@/lib/db/userToken'

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ lang: string; username: string }>
}) {
  const { username } = await params

  await dbConnect()

  const user = await getUserByUsername(username)
  const tokens = user ? await getUserTokens(user._id) : null

  if (!user) {
    // TODO: Show 404 page
    return null
  }

  //  Warning: Only plain objects can be passed to Client Components
  return (
    <>
      <UserProfile data={parseData(user)} tokens={parseData(tokens)} />
    </>
  )
}

function parseData(data: any) {
  return JSON.parse(JSON.stringify(data))
}
