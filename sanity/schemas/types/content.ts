import * as _ from 'lodash-es'
import { defineType } from 'sanity'

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
