'use client'

import * as _ from 'lodash-es'
import { useEffect, useMemo } from 'react'
import { useAppContext } from '@/store/AppContext'
import { px, useMantineTheme } from '@mantine/core'
import type { BreakPoint } from '@/types/common'

export function useBreakPoints() {
  const theme = useMantineTheme()
  const { state, updateState } = useAppContext()
  const {
    viewportSize: { width },
  } = state

  const points = useMemo(() => {
    const values = _.map(theme.breakpoints, (value, key) => ({
      key,
      value: Number(px(value)),
    }))
    return _.orderBy(values, ['value'], ['asc'])
  }, [theme.breakpoints])

  useEffect(() => {
    const breakPoints = points.reduce<BreakPoint[]>(
      (cur, point) => {
        if (width >= point.value) {
          cur.push(point.key as BreakPoint)
        }
        return cur
      },
      ['base']
    )

    updateState({ breakPoints })
  }, [points, width])
}
