import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'dev',
  title: 'For Dev',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'content', type: 'blockContent' }),
  ],
})
