import UserModel from '@/models/user'
import dbConnect from '@/lib/dbConnect'
import UserProfile from '@/components/UserProfile'

export default async function Profile({ params: { username } }: { params: { username: string } }) {
  const user = await getUser(username)

  return (
    <>
      <UserProfile user={user} />
    </>
  )
}

async function getUser(username: string) {
  try {
    if (!username) {
      throw new Error('no username')
    }
    await dbConnect()
    const user = await UserModel.findOne({ username }).exec()
    // issue: https://stackoverflow.com/a/76248614/22772942
    return JSON.parse(JSON.stringify(user)) || undefined
  } catch (err) {
    return undefined
  }
}
