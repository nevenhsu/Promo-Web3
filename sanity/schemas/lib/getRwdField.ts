import * as _ from 'lodash-es'
import type { FieldDefinition } from 'sanity'

export function getRwdField(
  fields: Omit<FieldDefinition, 'title' | 'name' | 'group'>,
  options?: { title?: string; name?: string }
): FieldDefinition {
  return {
    title: options?.title || 'RWD',
    name: options?.name || 'rwd',
    type: 'object',
    groups: [
      { name: 'base', title: 'Base', default: true },
      { name: 'xs', title: 'XS' },
      { name: 'sm', title: 'SM' },
      { name: 'md', title: 'MD' },
      { name: 'lg', title: 'LG' },
      { name: 'xl', title: 'XL' },
    ],
    fields: [
      { title: 'Base (Default)', name: 'base', group: 'base' },
      { title: 'XS (576)', name: 'xs', group: 'xs' },
      { title: 'SM (768)', name: 'sm', group: 'sm' },
      { title: 'MD (992)', name: 'md', group: 'md' },
      { title: 'LG (1200)', name: 'lg', group: 'lg' },
      { title: 'XL (1408)', name: 'xl', group: 'xl' },
    ].map(o => ({ ...fields, ...o })),
    options: { collapsed: false },
    preview: {
      select: { base: 'base', xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' },
      prepare: ({ base, xs, sm, md, lg, xl }: { [k: string]: any }) => {
        const title = _.reduce(
          { base, xs, sm, md, lg, xl },
          (result, value, key) => {
            if (!_.isEmpty(value)) {
              return `${result} ${key.toUpperCase()}`
            }
            return result
          },
          'RWD:'
        )
        return {
          title,
        }
      },
    },
  }
}
