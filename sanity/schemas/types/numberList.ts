import { defineField, defineType } from 'sanity'

export default defineType({
  title: 'Number List',
  name: 'numberList',
  type: 'object',
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'List',
      name: 'list',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'body', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      title: 'No Divider',
      name: 'noDivider',
      type: 'boolean',
    }),
  ],
})
