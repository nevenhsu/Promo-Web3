import * as _ from 'lodash-es'
import { locales } from '@/utils/env'
import type { FieldDefinition } from 'sanity'

const keys = _.keyBy(locales)

export function getLangField(
  fields: Omit<FieldDefinition, 'title' | 'name' | 'group'>
): FieldDefinition {
  return {
    title: 'Lang',
    name: 'lang',
    type: 'object',
    groups: locales.map((name, index) => ({
      name,
      title: name,
      default: index === 0,
    })),
    fields: locales
      .map(name => ({ name, title: name.toUpperCase(), group: name }))
      .map(o => ({ ...fields, ...o })),
    options: { collapsed: false },
    preview: {
      select: { ...keys },
      prepare: (keys: { [k: string]: any }) => {
        const title = _.reduce(
          keys,
          (result, value, key) => {
            if (!_.isEmpty(value)) {
              return `${result} ${key.toUpperCase()}`
            }
            return result
          },
          'Lang:'
        )
        return {
          title,
        }
      },
    },
  }
}
