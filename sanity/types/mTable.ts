import type { TableValue } from '@sanity/table'

export type MTableData = {
  title?: string
  thead?: string[]
  tbody?: TableValue
  tbodyColor?: 'text' | 'dimmed'
  layout?: { horizontalSpacing: number; verticalSpacing: number }
  divider?: { showDivider: boolean; noDividerTop: boolean; noDividerBottom: boolean }
}
