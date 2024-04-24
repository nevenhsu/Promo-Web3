import { defineType } from 'sanity'

export default defineType({
  title: 'Content Card',
  name: 'contentCard',
  type: 'object',
  fields: [
    { title: 'Title', name: 'title', type: 'string' },
    { name: 'blockContent', type: 'blockContent' },
  ],
  options: { collapsed: false },
})
