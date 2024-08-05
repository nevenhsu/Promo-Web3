import * as _ from 'lodash-es'
import { defineField, defineType } from 'sanity'
import IframeInput from '@/components/sanity/IframeInput'
import { extractIframeAttributes } from '@/sanity/lib/extractIframeAttributes'
import { getRwdField } from '@/sanity/schemas/lib/getRwdField'

export default defineType({
  name: 'iframe',
  title: 'Iframe',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      components: {
        input: IframeInput,
      },
    }),
    getRwdField({ type: 'string' }, { title: 'Height', name: 'height' }),
  ],
  preview: {
    select: { title: 'title', code: 'code', height: 'height' },
    prepare({ title, code, height }: any) {
      const attributes = extractIframeAttributes(code)
      const t = title || attributes?.title || 'Iframe'
      const h = _.map(_.omitBy(height, _.isEmpty), (v, k) => `${k}: ${v}`).join(', ')
      return {
        title: t,
        subtitle: `Width: 100% - Height: ${h || attributes?.height || 500}`,
      }
    },
  },
})
