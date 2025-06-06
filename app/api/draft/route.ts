// route handler with secret and slug
import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Parse query string parameters
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const type = searchParams.get('type')

  let path = `/`

  switch (type) {
    case 'page': {
      path = `/page/${slug}`
      break
    }
    case 'home':
    default: {
      break
    }
  }

  // Check the secret and next parameters
  // This secret should only be known to this route handler and the CMS
  //   if (secret !== 'MY_SECRET_TOKEN' || !slug) {
  //     return new Response('Invalid token', { status: 401 })
  //   }

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  // const post = await getPostBySlug(slug)

  // If the slug doesn't exist prevent draft mode from being enabled
  // if (!post) {
  //   return new Response('Invalid slug', { status: 401 })
  // }

  // Enable Draft Mode by setting the cookie
  const { enable } = await draftMode()
  enable()

  return NextResponse.redirect(new URL(path, request.url))

  // Redirect to the path from the fetched post
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  // redirect(post.slug)
}
