import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrivyClient } from '@privy-io/server-auth'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/user'
import { createUser } from '@/lib/db/user'
import { getAdmin } from '@/lib/db/admin'

const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID, process.env.PRIVY_APP_SECRET)

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        authToken: { label: 'AuthToken', type: 'text' },
        privyId: { label: 'PrivyId', type: 'text' },
        walletAddress: { label: 'WalletAddress', type: 'text' },
      },
      authorize: async (credentials, req) => {
        const { authToken, privyId } = credentials || {}

        if (authToken && privyId) {
          const claims = await verifyToken(authToken)

          if (claims?.userId === privyId) {
            await dbConnect()
            const user = await UserModel.findOne({ privyId }).exec()

            // auto create user if not exists
            if (!user) {
              // Get user details from Privy
              const privyUser = await getPrivyUser(privyId)
              const name = privyUser?.google?.name || privyUser?.twitter?.name || ''
              const newUser = await createUser(privyId, { name })

              return { id: newUser._id.toString(), privyId }
            }

            const admin = await getAdmin(user._id.toString())
            const isAdmin = Boolean(admin)
            const adminRole = admin?.role

            return { id: user._id.toString(), privyId, isAdmin, adminRole }
          }
        }

        return null
      },
    }),
  ],
  session: {
    maxAge: 1 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as any
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user as any
      }
      return token
    },
  },
})

export { handler as GET, handler as POST }

async function verifyToken(authToken: string) {
  try {
    const verifiedClaims = await privy.verifyAuthToken(authToken)

    return verifiedClaims
  } catch (error) {
    console.log(`Token verification failed with error ${error}.`)
  }
}

async function getPrivyUser(userId: string) {
  try {
    const user = await privy.getUser(userId)

    return user
  } catch (error) {
    console.error(`Get privy user failed with error ${error}.`)
  }
}
