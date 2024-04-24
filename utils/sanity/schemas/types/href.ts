import { defineType, defineField } from 'sanity'

export default defineType({
  title: 'Href',
  name: 'href',
  type: 'object',
  fieldsets: [{ name: 'href', title: 'Href', options: { collapsible: false, columns: 3 } }],
  fields: [
    defineField({
      title: 'Text',
      name: 'text',
      type: 'string',
      fieldset: 'href',
    }),
    defineField({
      title: 'Link',
      name: 'link',
      type: 'string',
      fieldset: 'href',
    }),
    defineField({
      title: 'FontWeight',
      name: 'fontWeight',
      type: 'string',
      fieldset: 'href',
      options: {
        list: ['200', '400', '700', '900'],
      },
    }),
  ],
})
