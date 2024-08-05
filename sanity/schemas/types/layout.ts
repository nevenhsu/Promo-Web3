import { defineType } from 'sanity'

export default defineType({
  title: 'Layout',
  name: 'layout',
  type: 'object',
  fieldsets: [
    { name: 'grid', title: 'Grid', options: { collapsible: false, columns: 2 } },
    { name: 'size', title: 'Size', options: { collapsible: false, columns: 2 } },
  ],
  fields: [
    { title: 'Width', name: 'width', type: 'string', fieldset: 'size' },
    { title: 'Height', name: 'height', type: 'string', fieldset: 'size' },
    { title: 'Full Width', name: 'fullWidth', type: 'boolean', fieldset: 'size' },
    { title: 'Columns', name: 'cols', type: 'number', fieldset: 'grid' },
    { title: 'Show Items', name: 'showItems', type: 'number', fieldset: 'grid' },
    { title: 'Spacing (X)', name: 'spacing', type: 'number', fieldset: 'grid' },
    { title: 'Spacing (Y)', name: 'verticalSpacing', type: 'number', fieldset: 'grid' },
  ],
  options: { collapsed: false },
})
