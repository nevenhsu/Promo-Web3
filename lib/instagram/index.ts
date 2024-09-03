import axios from 'axios'
import { addSeconds } from 'date-fns'

const baseUrl = 'https://graph.instagram.com'

export async function getMe(accessToken: string) {
  const url = new URL('/me', baseUrl)
  url.searchParams.append('fields', 'username,id')
  url.searchParams.append('access_token', accessToken)

  const { data } = await axios.get<{
    id: string
    username: string
  }>(url.toString())

  const { id, username } = data

  if (!id || !username) {
    throw new Error('Failed to get user info')
  }

  return data
}

export async function getLongLivedAccessToken(accessToken: string) {
  const secret = process.env.INSTAGRAM_SECRET
  if (!secret) throw new Error('INSTAGRAM_SECRET is not set')

  const url = new URL('/access_token', baseUrl)
  url.searchParams.append('grant_type', 'ig_exchange_token')
  url.searchParams.append('client_secret', process.env.INSTAGRAM_SECRET)
  url.searchParams.append('access_token', accessToken)

  const now = new Date()

  const { data } = await axios.get<{
    access_token: string
    token_type: string
    expires_in: number
  }>(url.toString())

  const { access_token, expires_in } = data
  const expiredAt = addSeconds(now, expires_in)

  if (!access_token) {
    throw new Error('Failed to get long lived access token')
  }

  return { expiredAt, longLivedAccessToken: access_token }
}

// at least 24 hours before the token expires
export async function refreshAccessToken(accessToken: string) {
  const url = new URL('/refresh_access_token', baseUrl)
  url.searchParams.append('grant_type', 'ig_refresh_token')
  url.searchParams.append('access_token', accessToken)

  const now = new Date()

  const { data } = await axios.get<{
    access_token: string
    token_type: string
    expires_in: number
  }>(url.toString())

  const { access_token, expires_in } = data
  const expiredAt = addSeconds(now, expires_in)

  if (!access_token) {
    throw new Error('Failed to refresh access token')
  }

  return { expiredAt, longLivedAccessToken: access_token }
}
