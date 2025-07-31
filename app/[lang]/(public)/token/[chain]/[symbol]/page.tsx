import dbConnect from '@/lib/dbConnect'
import Token from '@/components/Token'
import { getTokenBySymbol } from '@/lib/db/userToken'
import { getUserById } from '@/lib/db/user'
import { countTokenDoc } from '@/lib/db/token'

export default async function TokenPage({
  params,
}: {
  params: Promise<{ lang: string; chain: string; symbol: string }>
}) {
  await dbConnect()

  const { chain, symbol } = await params
  const token = await getTokenBySymbol({ symbol, chainId: parseInt(chain) })
  const user = token ? await getUserById(token._user.toString()) : null
  const count = token ? await countTokenDoc(token._id.toString()) : 0

  if (!token || !user) {
    // TODO: Show 404 page
    return null
  }

  //  Warning: Only plain objects can be passed to Client Components
  return (
    <>
      <Token data={parseData(token)} username={user.username} count={count} />
    </>
  )
}

function parseData(data: any) {
  return JSON.parse(JSON.stringify(data))
}
