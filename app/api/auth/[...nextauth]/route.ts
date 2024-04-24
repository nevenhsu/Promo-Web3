import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrivyClient } from '@privy-io/server-auth'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/user'

const handler = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        authToken: { label: 'AuthToken', type: 'text' },
        walletAddress: { label: 'WalletAddress', type: 'text' },
      },
      authorize: async (credentials, req) => {
        const { authToken, walletAddress } = credentials || {}

        if (authToken && walletAddress) {
          const claims = await verifyToken(authToken)

          if (claims) {
            const privyId = claims.userId

            await dbConnect()
            const user = await UserModel.findOne({ privyId }).exec()

            // auto create user if not exists
            if (!user) {
              const newUser = new UserModel({ privyId, walletAddress, username: walletAddress })
              await newUser.save()
              return { id: newUser._id.toString(), privyId }
            }

            return { id: user._id.toString(), privyId }
          }
        }

        return null
      },
    }),
  ],
  session: {
    maxAge: 365 * 24 * 60 * 60,
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
    const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID, process.env.PRIVY_APP_SECRET)
    const verifiedClaims = await privy.verifyAuthToken(authToken)

    return verifiedClaims
  } catch (error) {
    console.log(`Token verification failed with error ${error}.`)
  }
}
