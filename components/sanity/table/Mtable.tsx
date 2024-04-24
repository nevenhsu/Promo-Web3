import _ from 'lodash'
import { Box, Table, Divider } from '@mantine/core'
import { Subtitle, Body } from '@/components/Fonts'
import type { MTableData } from '@/types/mTable'
import classes from './index.module.css'

export function MTable({ data }: { data: Partial<MTableData> }) {
  const { thead, divider, layout, tbody, tbodyColor = 'dimmed' } = data || {}
  const { horizontalSpacing = 16, verticalSpacing = 12 } = layout || {}
  const { showDivider, noDividerBottom, noDividerTop } = divider || {}

  const rows = _.map(tbody?.rows, row => {
    const { cells } = row
    return (
      <Table.Tr key={row._key}>
        {_.map(cells, (cell, i) => {
          return (
            <Table.Td key={`${cell}-${i}`}>
              <Body>{cell}</Body>
            </Table.Td>
          )
        })}
      </Table.Tr>
    )
  })

  return (
    <Box>
      {noDividerTop ? null : <Divider />}
      <Box py={verticalSpacing}>
        <Table
          className={classes.root}
          horizontalSpacing={_.round(horizontalSpacing / 2)}
          verticalSpacing={_.round(verticalSpacing / 2)}
          withRowBorders={Boolean(showDivider)}
        >
          {thead?.length ? (
            <Table.Thead>
              <Table.Tr>
                {_.map(thead, (cell, i) => {
                  return (
                    <Table.Th key={`${cell}-${i}`}>
                      <Subtitle>{cell}</Subtitle>
                    </Table.Th>
                  )
                })}
              </Table.Tr>
            </Table.Thead>
          ) : null}

          <Table.Tbody
            c={`var(--mantine-color-${tbodyColor})`}
            style={{
              verticalAlign: 'top',
            }}
          >
            {rows}
          </Table.Tbody>
        </Table>
      </Box>
      {noDividerBottom ? null : <Divider />}
    </Box>
  )
}
