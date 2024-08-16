import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { table } from '@sanity/table'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from '@/sanity/schemas'
import { defaultDocumentNode } from '@/sanity/defaultDocumentNode'
import { publicEnv } from '@/utils/env'
import LogoIcon from '@/public/logo-orange.svg'

const { projectId, dataset } = publicEnv.sanity

export default defineConfig({
  basePath: '/studio', // <-- important that `basePath` matches the route you're mounting your studio from

  projectId,
  dataset,
  plugins: [structureTool({ defaultDocumentNode }), visionTool(), media(), colorInput(), table()],
  schema: {
    types: schemaTypes,
  },

  icon: LogoIcon,
})
