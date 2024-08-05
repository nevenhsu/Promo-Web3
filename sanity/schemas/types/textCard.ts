import { defineType } from 'sanity'

export default defineType({
  title: 'Text Card',
  name: 'textCard',
  type: 'object',
  fields: [{ title: 'Title', name: 'title', type: 'string' }],
  options: { collapsed: false },
})
