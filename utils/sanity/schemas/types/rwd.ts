import _ from 'lodash'
import { defineType, defineField } from 'sanity'
import { getRwdField } from '@/utils/sanity/getRwdField'

export default defineType({
  title: 'RWD Block',
  name: 'rwd',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField(getRwdField({ type: 'layout' })),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        { title: 'Image', type: 'image' },
        { type: 'content' },
        { type: 'mTable' },
        { type: 'numberList' },
        { type: 'titleCard' },
        { type: 'contentCard' },
        { type: 'textCard' },
        { type: 'member' },
        { type: 'iframe' },
      ],
    }),
    defineField({
      title: 'Divider',
      name: 'divider',
      type: 'object',
      fieldsets: [{ name: 'divider', title: ' ', options: { collapsible: false, columns: 3 } }],
      fields: [
        defineField({
          title: 'Hidden',
          name: 'noDivider',
          type: 'boolean',
          fieldset: 'divider',
        }),
        defineField({
          title: 'Hide Top',
          name: 'noDividerTop',
          type: 'boolean',
          fieldset: 'divider',
        }),
        defineField({
          title: 'Hide Bottom',
          name: 'noDividerBottom',
          type: 'boolean',
          fieldset: 'divider',
        }),
      ],
      options: { collapsed: false },
    }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare({ title, items }) {
      const subtitle = _.map(items, o => o.title).join(', ')
      return {
        title: `RWD - ${title || ''}`,
        subtitle,
      }
    },
  },
})
