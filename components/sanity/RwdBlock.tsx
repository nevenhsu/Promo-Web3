'use client'

import * as _ from 'lodash-es'
import clsx from 'clsx'
import useRwd from '@/sanity/hooks/useRwd'
import { useScreenQueryValue } from '@/hooks/useScreenQuery'
import { Box, Divider } from '@mantine/core'
import RwdSimpleGrid from '@/components/sanity/Rwd/SimpleGrid'
import { MyPortableText } from '@/components/common'
import type { RwdData } from '@/sanity/types/rwd'
import type { BreakPointData } from '@/types/common'
import classes from './index.module.css'

const fullWidthData: Partial<BreakPointData<{ w: string }>> = {
  base: { w: '100%' },
  sm: { w: 'calc(100vw - 80px)' },
  lg: { w: '1120px' },
}

export function RwdBlock({ data }: { data: Partial<RwdData> }) {
  const { items, divider, rwd } = data || {}
  const { noDivider, noDividerTop, noDividerBottom } = divider || {}

  const boxWidth = useScreenQueryValue(fullWidthData, 'w')
  const fullWidth = useScreenQueryValue(rwd, 'fullWidth')
  const showItems = useScreenQueryValue(rwd, 'showItems')
  const cols = useScreenQueryValue(rwd, 'cols') || 1
  const verticalSpacing = useScreenQueryValue(rwd, 'verticalSpacing') ?? 40
  const elements = _.slice(items, 0, Number(showItems) || undefined)

  const gridProps = useRwd(
    {
      width: 'w',
      height: 'h',
      spacing: 'spacing',
    },
    rwd,
    {
      width: '100%',
    }
  )

  return (
    <Box
      className={clsx({ ['relative-horizontal']: fullWidth })}
      pos="relative"
      py={verticalSpacing}
      w={fullWidth ? boxWidth : '100%'}
    >
      <RwdSimpleGrid
        {...gridProps}
        className={clsx({ ['relative-horizontal']: gridProps.w !== '100%' })}
        cols={cols}
        verticalSpacing={verticalSpacing}
      >
        {elements.map((o, i) => {
          const { isFirstRow, isBottomRow } = checkRow(i, elements.length, cols)
          const showBorder = !isBottomRow && !noDivider
          const showBorderTop = isFirstRow && !noDividerTop
          const showBorderBottom = isBottomRow && !noDividerBottom

          return (
            <Box key={o._key}>
              {showBorderTop ? (
                <Divider pos="relative" bottom={_.round(verticalSpacing / 2)} />
              ) : null}
              <Box className={classes.block}>
                <MyPortableText content={[o] as any} />
              </Box>
              {showBorder || showBorderBottom ? (
                <Divider pos="relative" top={_.round(verticalSpacing / 2)} />
              ) : null}
            </Box>
          )
        })}
      </RwdSimpleGrid>
    </Box>
  )
}

function checkRow(index: number, length: number, perRow: number) {
  const totalRows = Math.ceil(length / perRow)
  const rowIndex = Math.ceil((index + 1) / perRow)

  const isFirstRow = rowIndex === 1
  const isBottomRow = rowIndex === totalRows

  return { isFirstRow, isBottomRow }
}
