import * as _ from 'lodash-es'
import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'
import type { SimpleGridProps } from '@mantine/core'
import type { Rwd } from '@/sanity/types/rwd'

type ToKey<T, V = any> = { [K in keyof T]: V }

type ValuesAsKeys<T extends Partial<Record<any, any>>> = Record<T[keyof T], any>

export default function useRwd<
  V extends Partial<Record<keyof T, keyof SimpleGridProps>>,
  T = Record<string, any>,
>(toKey: V, value: Rwd<T> | undefined, fallback: Partial<ToKey<T>>) {
  const { base, xs, sm, md, lg, xl } = value || {}

  const [results, setResults] = useState<ValuesAsKeys<V>>()

  const getValue = (k: string) => {
    const val = {
      base: _.get(base, [k], _.get(fallback, [k])),
      xs: _.get(xs, [k]),
      sm: _.get(sm, [k]),
      md: _.get(md, [k]),
      lg: _.get(lg, [k]),
      xl: _.get(xl, [k]),
    }
    return _.omitBy(val, _.isNil)
  }

  useDeepCompareEffect(() => {
    const temp: ValuesAsKeys<V> = {} as any

    _.forEach(toKey, (v, k) => {
      temp[v] = getValue(k)
    })

    setResults(temp)
  }, [toKey, value, fallback])

  return _.omitBy(results, _.isEmpty)
}
