'use client'

import _ from 'lodash'
import { useEffect } from 'react'
import { useLiveQuery } from '@sanity/preview-kit'
import { useAppContext } from '@/store/AppContext'

type Params<QueryResult> = Parameters<typeof useLiveQuery<QueryResult>>

export default function useQuery<QueryResult>(
  ...params: Params<QueryResult>
): [QueryResult, boolean, boolean] {
  const [initialData] = params

  const { isPreview } = useAppContext().state

  const liveResult = useLiveQuery<QueryResult>(...params)
  const enabled = liveResult[2]

  if (isPreview && !enabled) {
    throw new Error('not wrapped in a LiveQueryProvider')
  }

  useEffect(() => {
    if (isPreview) {
      const [data] = liveResult
      console.log('LIVE_QUERY', data)
      // @ts-ignore
      window.LIVE_QUERY = data
    }
  }, [isPreview, liveResult])

  return isPreview ? liveResult : [initialData, false, false]
}
