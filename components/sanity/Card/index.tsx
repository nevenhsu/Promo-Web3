import clsx from 'clsx'
import { Box, type BoxProps } from '@mantine/core'
import classes from './index.module.css'

export default function Card({
  children,
  className,
  ...rest
}: BoxProps & { children?: React.ReactNode }) {
  return (
    <Box className={clsx(classes.card, className)} {...rest}>
      {children}
    </Box>
  )
}
