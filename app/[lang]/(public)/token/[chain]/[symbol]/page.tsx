import dbConnect from '@/lib/dbConnect'
import Token from '@/components/Token'
import { getTokenBySymbol } from '@/lib/db/userToken'
import { getUserById } from '@/lib/db/user'
import { countTokenDoc, getTokenDocs } from '@/lib/db/token'
import { getPublicActivities } from '@/lib/db/activity'

export default async function TokenPage({
  params,
}: {
  params: Promise<{ lang: string; chain: string; symbol: string }>
}) {
  await dbConnect()

  const { chain, symbol } = await params
  const token = await getTokenBySymbol({ symbol, chainId: parseInt(chain) })
  const user = token ? await getUserById(token._user.toString()) : null
  const userTokenId = token ? token._id.toString() : null
  const count = userTokenId ? await countTokenDoc(userTokenId) : 0
  const ranking = userTokenId ? await getTokenDocs(userTokenId, 100) : []
  const { activities } = userTokenId
    ? await getPublicActivities({ limit: 100 }, { ongoing: true, userToken: userTokenId })
    : { activities: [] }

  if (!token || !user) {
    // TODO: Show 404 page
    return null
  }

  //  Warning: Only plain objects can be passed to Client Components
  return (
    <>
      <Token
        data={parseData(token)}
        username={user.username}
        count={count}
        ranking={parseData(ranking)}
        activities={parseData(activities)}
      />
    </>
  )
}

function parseData(data: any) {
  return JSON.parse(JSON.stringify(data))
}
