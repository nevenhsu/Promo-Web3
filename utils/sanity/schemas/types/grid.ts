import { defineType } from 'sanity'

export default defineType({
  title: 'Grid',
  name: 'grid',
  type: 'object',
  fieldsets: [{ name: 'grid', title: 'Grid', options: { collapsible: false, columns: 3 } }],
  fields: [
    { name: 'cols', type: 'number', fieldset: 'grid' },
    { title: 'Spacing (X)', name: 'spacing', type: 'number', fieldset: 'grid' },
    { title: 'Spacing (Y)', name: 'verticalSpacing', type: 'number', fieldset: 'grid' },
  ],
  options: { collapsed: false },
  preview: {
    select: { cols: 'cols', spacing: 'spacing', verticalSpacing: 'verticalSpacing' },
    prepare(selection) {
      const { cols, spacing, verticalSpacing } = selection
      return {
        title: `Grid - ${cols} cols`,
        subtitle: `Spacing: ${spacing} - ${verticalSpacing}`,
      }
    },
  },
})
