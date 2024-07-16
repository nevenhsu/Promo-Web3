import { defineField, defineType } from 'sanity'
import { getRwdField } from '@/utils/sanity/getRwdField'
import { lang } from './fields/lang'
import { isPostUnique } from './lib/isPostUnique'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fieldsets: [
    { name: 'password', title: 'Password', options: { collapsible: false, columns: 1 } },
    { name: 'time', title: 'Time', options: { collapsible: false, columns: 2 } },
  ],
  fields: [
    defineField({
      name: 'hidden',
      type: 'boolean',
    }),
    lang,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isPostUnique,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'locked',
      title: 'Lock',
      type: 'boolean',
      fieldset: 'password',
    }),
    defineField({
      name: 'password',
      title: 'Password',
      type: 'string',
      fieldset: 'password',
    }),
    defineField({
      name: 'passwordHint',
      title: 'Password Hint',
      type: 'string',
      fieldset: 'password',
    }),
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
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
  ],
  options: { collapsed: false },
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'mainImage.base',
      hidden: 'hidden',
    },
    prepare(selection) {
      const { hidden, title } = selection
      return {
        ...selection,
        title: hidden ? `[Hidden] ${title}` : title,
      }
    },
  },
})
