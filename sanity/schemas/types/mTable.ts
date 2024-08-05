import { defineField, defineType } from 'sanity'

export default defineType({
  title: 'Table',
  name: 'mTable',
  type: 'object',
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Table Head (optional)',
      name: 'thead',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      title: 'Table Body',
      name: 'tbody',
      type: 'table',
    }),
    defineField({
      title: 'Text Color',
      name: 'tbodyColor',
      type: 'string',
      options: {
        list: [
          { title: 'Normal', value: 'text' },
          { title: 'Dimmed', value: 'dimmed' },
        ],
      },
    }),
    defineField({
      title: 'Layout',
      name: 'layout',
      type: 'object',
      fieldsets: [{ name: 'layout', title: ' ', options: { collapsible: false, columns: 2 } }],
      fields: [
        { title: 'Spacing (X)', name: 'horizontalSpacing', type: 'number', fieldset: 'layout' },
        { title: 'Spacing (Y)', name: 'verticalSpacing', type: 'number', fieldset: 'layout' },
      ],
    }),
    defineField({
      title: 'Divider',
      name: 'divider',
      type: 'object',
      fieldsets: [{ name: 'divider', title: ' ', options: { collapsible: false, columns: 3 } }],
      fields: [
        defineField({
          title: 'Show',
          name: 'showDivider',
          type: 'boolean',
          fieldset: 'divider',
        }),
        defineField({
          title: 'Hide Top',
          name: 'noDividerTop',
          type: 'boolean',
          fieldset: 'divider',
        }),
        defineField({
          title: 'Hide Bottom',
          name: 'noDividerBottom',
          type: 'boolean',
          fieldset: 'divider',
        }),
      ],
      options: { collapsed: false },
    }),
  ],
})
