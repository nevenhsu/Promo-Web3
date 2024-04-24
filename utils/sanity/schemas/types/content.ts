import _ from 'lodash'
import { defineType } from 'sanity'
// import type { PortableTextBlock } from 'sanity'

export default defineType({
  title: 'Content',
  name: 'content',
  type: 'object',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'blockContent', type: 'blockContent' },
  ],
  preview: {
    select: { title: 'title' },
  },
})
