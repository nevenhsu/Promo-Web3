import { defineField, defineType } from 'sanity'
import { getLangField } from './lib/getLangField'
import { getRwdField } from './lib/getRwdField'
import { isPostUnique } from './lib/isPostUnique'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fieldsets: [{ name: 'time', title: 'Time', options: { collapsible: false, columns: 2 } }],
  fields: [
    defineField({
      name: 'hidden',
      type: 'boolean',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (url)',
      type: 'slug',
      options: {
        source: 'lang.en.title',
        maxLength: 96,
        isUnique: isPostUnique,
      },
    }),
    defineField(getLangField({ type: 'pageData' })),
    defineField(
      getRwdField(
        { type: 'image', options: { hotspot: true } },
        { title: 'Main Image', name: 'mainImage' }
      )
    ),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'avatar' },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      fieldset: 'time',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'number',
      fieldset: 'time',
    }),
  ],
  preview: {
    select: {
      title: 'lang.en.title',
      subtitle: 'lang.en.description',
      media: 'mainImage.base',
      hidden: 'hidden',
    },
    prepare({ title, subtitle, media, hidden }) {
      return {
        title: hidden ? `[Hidden] ${title}` : title,
        subtitle,
        media,
      }
    },
  },
})
