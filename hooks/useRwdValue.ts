'use client'

import * as _ from 'lodash-es'
import { useAppContext } from '@/store/AppContext'
import type { BreakPoint, BreakPointData } from '@/types/common'

export type Values = BreakPointData<any>
export type Data<T> = Partial<{ [k in BreakPoint]: T }>

export function useRwdValue<T, K extends keyof T>(
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
