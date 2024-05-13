'use client'

import * as _ from 'lodash-es'
import { useEffect, useMemo } from 'react'
import { useAppContext } from '@/store/AppContext'
import { px, useMantineTheme } from '@mantine/core'
import type { BreakPoint, BreakPointData } from '@/types/common'

export type Value = string | number | boolean | undefined
export type Values = BreakPointData<any>
export type Data<T> = Partial<{ [k in BreakPoint]: T }>
type Point = { key: BreakPoint; value: number }

export function useScreenQuery() {
  const theme = useMantineTheme()
  const { state, updateState } = useAppContext()
  const {
    viewportSize: { width },
  } = state

  const points: Point[] = useMemo(() => {
    const values = _.map(theme.breakpoints, (value, key) => ({
      key: key as BreakPoint,
      value: Number(px(value)),
    }))
    return _.orderBy(values, ['value'], ['asc'])
  }, [theme.breakpoints])

  useEffect(() => {
    const breakPoints = points.reduce<BreakPoint[]>(
      (cur, point) => {
        if (width >= point.value) {
          cur.push(point.key)
        }
        return cur
      },
      ['base']
    )

    updateState({ breakPoints })
  }, [points, width])
}

export function useScreenQueryValue<T, K extends keyof T>(
  val: Data<T> | undefined,
  dataKey: K
): T[K] | undefined {
  const { breakPoints } = useAppContext().state
  const values: Partial<Values> = {}

  _.forEach(val, (v, k) => {
    values[k as BreakPoint] = _.get(v, [dataKey])
  })

  const value: T[K] | undefined = breakPoints.reduce((cur, k) => {
    return values[k] || cur
  }, undefined)

  return value
}
