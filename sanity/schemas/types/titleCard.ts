import { defineType } from 'sanity'

export default defineType({
  title: 'Title Card',
  name: 'titleCard',
  type: 'object',
  fields: [
    { title: 'Title', name: 'title', type: 'string' },
    { name: 'blockContent', type: 'blockContent' },
  ],
  options: { collapsed: false },
})
