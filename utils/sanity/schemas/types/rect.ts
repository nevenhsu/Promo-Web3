import { defineType } from 'sanity'

export default defineType({
  title: 'Rect',
  name: 'rect',
  type: 'object',
  fieldsets: [
    { name: 'position', title: 'Position', options: { collapsible: false, columns: 2 } },
    { name: 'size', title: 'Size', options: { collapsible: false, columns: 2 } },
  ],
  fields: [
    {
      title: 'X',
      name: 'x',
      type: 'string',
      fieldset: 'position',
    },
    {
      title: 'Y',
      name: 'y',
      type: 'string',
      fieldset: 'position',
    },
    {
      title: 'Width',
      name: 'width',
      type: 'string',
      fieldset: 'size',
    },
    {
      title: 'Height',
      name: 'height',
      type: 'string',
      fieldset: 'size',
    },
  ],
  options: { collapsed: false },
  preview: {
    select: {
      x: 'x',
      y: 'y',
      width: 'width',
      height: 'height',
    },
    prepare: ({ x, y, width, height }) => {
      return {
        title: `X: ${x} | Y: ${y} | Width: ${width} | Height: ${height}`,
      }
    },
  },
})
