import UserProfile from '@/components/u/Profile'
import dbConnect from '@/lib/dbConnect'
import { getUserByUsername } from '@/lib/db/user'
import { getUserToken } from '@/lib/db/userToken'
import { getTokens } from '@/lib/db/token'

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ lang: string; username: string }>
}) {
  const { username } = await params

  await dbConnect()

  const user = await getUserByUsername(username)
  const userToken = user ? await getUserToken(user._id) : null
  const tokens = userToken ? await getTokens(userToken._id.toString()) : []

  if (!user) {
    // TODO: Show 404 page
    return null
  }

  //  Warning: Only plain objects can be passed to Client Components
  return (
    <>
      <UserProfile
        data={parseData(user)}
        userToken={parseData(userToken)}
        tokens={parseData(tokens)}
      />
    </>
  )
}

function parseData(data: any) {
  return JSON.parse(JSON.stringify(data))
}
