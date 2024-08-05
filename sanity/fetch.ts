import 'server-only'

import { draftMode } from 'next/headers'
import { client } from './client'
import { env } from '@/utils/env'
import type { QueryParams } from '@sanity/client'

const { sanityToken: token } = env

const DEFAULT_PARAMS: QueryParams = {}

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
}: {
  query: string
  params?: QueryParams
}): Promise<QueryResponse> {
  const isDraftMode = draftMode().isEnabled
  if (isDraftMode && !token) {
    throw new Error('The `SANITY_API_READ_TOKEN` environment variable is required.')
  }

  return client.fetch<QueryResponse>(query, params, {
    ...(isDraftMode && {
      token,
      perspective: 'previewDrafts',
    }),
    next: {
      revalidate: isDraftMode ? 0 : false,
    },
  })
}
