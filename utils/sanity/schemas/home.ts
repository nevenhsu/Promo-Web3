import { defineField, defineType } from 'sanity'
import { lang } from './fields/lang'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  fieldsets: [
    { name: 'title', title: 'Title', options: { collapsible: false, columns: 1 } },
    { name: 'news', title: 'News', options: { collapsible: false, columns: 2 } },
  ],
  fields: [
    lang,
    defineField({
      name: 'header',
      title: 'Header',
      type: 'string',
    }),
    defineField({
      name: 'titles',
      title: 'Titles',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      fieldset: 'title',
    }),
    defineField({
      name: 'titleDuration',
      title: 'Duration (seconds))',
      type: 'number',
      fieldset: 'title',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'subtitleHref',
      title: 'Subtitle Href',
      type: 'href',
    }),
    defineField({
      name: 'caption1',
      title: 'Caption (Line 1)',
      type: 'string',
    }),
    defineField({
      name: 'caption2',
      title: 'Caption (Line 2)',
      type: 'string',
    }),
    defineField({
      name: 'captionHref',
      title: 'Caption Href',
      type: 'href',
    }),
    defineField({
      name: 'newsTitle',
      title: 'Title',
      type: 'string',
      fieldset: 'news',
    }),
    defineField({
      name: 'arrowText',
      title: 'Arrow Text',
      type: 'string',
      fieldset: 'news',
    }),
    defineField({
      name: 'activities',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'activity' } }],
    }),
  ],
  preview: {
    select: {
      titles: 'titles',
      lang: 'lang',
    },
    prepare(selection) {
      const { titles, lang } = selection
      return { title: `[${lang.toUpperCase()}] Home`, subtitle: titles.join(', ') }
    },
  },
})
