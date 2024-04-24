import _ from 'lodash'
import { defineType } from 'sanity'
import { getRwdField } from '@/utils/sanity/getRwdField'

const name = 'height'

export default defineType({
  name: 'space',
  title: 'Space',
  type: 'document',
  fields: [defineType(getRwdField({ type: 'number' }, { name, title: 'Height' }))],
  preview: {
    select: {
      height: 'height',
    },
    prepare({ height }: { [k: string]: any }) {
      const { base, xs, sm, md, lg, xl } = height
      const a = base ? `Base: ${base}` : ''
      const b = xs ? `, XS: ${xs}` : ''
      const c = sm ? `, SM: ${sm}` : ''
      const d = md ? `, MD: ${md}` : ''
      const e = lg ? `, LG: ${lg}` : ''
      const f = xl ? `, XL: ${xl}` : ''
      const subtitle = `${a}${b}${c}${d}${e}${f}`
      const values = _.compact([base, xs, sm, md, lg, xl]).join(', ')
      return {
        title: `Space (${values})`,
        subtitle,
      }
    },
  },
})
