import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'metadata',
  title: 'Metadata',
  type: 'document',
  fieldsets: [{ name: 'icon', options: { collapsible: false, columns: 2 } }],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'string',
    }),
    defineField({
      name: 'author',
      type: 'string',
    }),
    defineField({
      name: 'keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'cover',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'svg',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'icon',
    }),
    defineField({
      name: 'png',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'icon',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare(selection) {
      const { title, description } = selection
      return { title, subtitle: description }
    },
  },
})
